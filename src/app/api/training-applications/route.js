import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../lib/mail";
import { checkRecaptcha } from "../../../lib/recaptcha";
import { reportIssue } from "../../../lib/reportIssue";
import { uploadRawFile } from "../../../lib/cloudinary";
import {
  getResumeFileNameError,
  RESUME_FILENAME_ERROR,
} from "../../../lib/resumeFile";
import {
  trainingApplicationNotificationTemplate,
  trainingApplicationReceivedTemplate,
} from "../../../lib/emailTemplates";
import {
  normalizePhone,
  validateResumeFile,
  validateTrainingApplication,
} from "../../../lib/trainingValidation";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_BYTES = 512 * 1024; // 512KB
const SOURCE = "training-application";

function field(formData, key) {
  return String(formData.get(key) || "").trim();
}

export async function POST(req) {
  const context = {};
  let step = "reading the form";
  try {
    const formData = await req.formData();

    const fullName = field(formData, "fullName").replace(/\s+/g, " ");
    const email = field(formData, "email").toLowerCase();
    const phone = normalizePhone(field(formData, "phone"));
    const qualification = field(formData, "qualification");
    const college = field(formData, "college").replace(/\s+/g, " ");
    const yearOfPassing = field(formData, "yearOfPassing");
    const captchaToken = field(formData, "recaptchaToken");
    Object.assign(context, { applicantName: fullName, applicantEmail: email });

    const fieldErrors = validateTrainingApplication({
      fullName,
      email,
      phone,
      qualification,
      college,
      yearOfPassing,
    });
    if (Object.keys(fieldErrors).length > 0) {
      return NextResponse.json(
        { error: "Please fix the highlighted fields", fields: fieldErrors },
        { status: 400 },
      );
    }

    // Resume is mandatory for training applications.
    const file = formData.get("resume");
    const hasFile = file && typeof file !== "string" && file.size > 0;

    if (!hasFile) {
      return NextResponse.json(
        {
          error: "Please upload your resume",
          fields: { resume: "Please upload your resume" },
        },
        { status: 400 },
      );
    }

    if (hasFile) {
      const resumeError = validateResumeFile(file);
      if (resumeError) {
        return NextResponse.json({ error: resumeError }, { status: 400 });
      }
      if (file.size > MAX_BYTES) {
        return NextResponse.json(
          { error: "File too large. Max size is 512KB." },
          { status: 400 },
        );
      }
      if (file.type && !ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Only PDF or DOC/DOCX files are allowed." },
          { status: 400 },
        );
      }
      const fileNameError = getResumeFileNameError(file.name);
      if (fileNameError) {
        return NextResponse.json({ error: fileNameError }, { status: 400 });
      }
    }

    step = "checking the captcha";
    const captchaFail = await checkRecaptcha(req, {
      token: captchaToken,
      action: "training_application",
      source: SOURCE,
      context,
    });
    if (captchaFail) {
      return NextResponse.json({ error: captchaFail.error }, { status: captchaFail.status });
    }

    let resumeUrl = null;
    let resumePublicId = null;
    let resumeFileName = null;

    if (hasFile) {
      step = "uploading the resume";
      let uploaded;
      try {
        uploaded = await uploadRawFile(file, "triwinz/training-resumes");
      } catch (uploadError) {
        const msg = String(uploadError?.message || "");
        if (msg.includes("public_id") && msg.includes("invalid")) {
          return NextResponse.json({ error: RESUME_FILENAME_ERROR }, { status: 400 });
        }
        await reportIssue({
          source: SOURCE,
          code: "resume_upload_failed",
          title: "Resume upload to Cloudinary failed, so the training application was not saved.",
          error: uploadError,
          context: { ...context, fileName: file.name, fileSize: file.size },
        });
        return NextResponse.json(
          { error: "We couldn't upload your resume. Please try again in a few minutes." },
          { status: 502 },
        );
      }
      resumeUrl = uploaded.url;
      resumePublicId = uploaded.publicId;
      resumeFileName = file.name;
    }

    step = "saving the application";
    const application = await prisma.trainingApplication.create({
      data: {
        fullName,
        email,
        phone,
        qualification,
        college,
        yearOfPassing,
        resumeUrl,
        resumePublicId,
        resumeFileName,
        status: "new",
      },
    });

    // Emails are best-effort; a failure must not fail the submission.
    const notifyTo =
      process.env.TRAINING_NOTIFICATION_EMAIL ||
      process.env.CONTACT_NOTIFICATION_EMAIL ||
      "techadmin@triwinz.net";

    const applicantMail = trainingApplicationReceivedTemplate({ fullName });
    const teamMail = trainingApplicationNotificationTemplate({
      fullName,
      email,
      phone,
      qualification,
      college,
      yearOfPassing,
      resumeUrl,
    });

    await Promise.allSettled([
      sendMail({
        to: email,
        subject: applicantMail.subject,
        text: applicantMail.text,
        html: applicantMail.html,
      }),
      sendMail({
        to: notifyTo,
        subject: teamMail.subject,
        text: teamMail.text,
        html: teamMail.html,
        replyTo: email,
      }),
    ]).then(async (results) => {
      const [applicantResult, teamResult] = results;
      results.forEach((r) => {
        if (r.status === "rejected") {
          console.error("Training application email failed:", r.reason);
        }
      });
      if (applicantResult.status === "rejected" || teamResult.status === "rejected") {
        const failed = [
          applicantResult.status === "rejected" ? "applicant confirmation" : null,
          teamResult.status === "rejected" ? "team notification" : null,
        ].filter(Boolean);
        await reportIssue({
          source: SOURCE,
          code: "email_failed",
          title: `Training application was saved, but the ${failed.join(" and ")} email could not be sent.`,
          error: (applicantResult.status === "rejected" ? applicantResult : teamResult).reason,
          context,
        });
      }
    });

    return NextResponse.json({ ok: true, id: application.id }, { status: 201 });
  } catch (error) {
    console.error("Training application create failed:", error);
    const message = String(error?.message || "");
    if (message.includes("public_id") && message.includes("invalid")) {
      return NextResponse.json(
        { error: RESUME_FILENAME_ERROR },
        { status: 400 },
      );
    }
    await reportIssue({
      source: SOURCE,
      code: step === "saving the application" ? "save_failed" : "unexpected_error",
      title:
        step === "saving the application"
          ? "Training application could not be saved to the database."
          : `Training application failed while ${step}.`,
      error,
      context,
    });
    return NextResponse.json(
      { error: "Failed to submit application. Please try again in a few minutes." },
      { status: 500 },
    );
  }
}
