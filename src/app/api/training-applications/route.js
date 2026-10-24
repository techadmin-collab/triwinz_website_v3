import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../lib/mail";
import { verifyTurnstileToken } from "../../../lib/turnstile";
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

function field(formData, key) {
  return String(formData.get(key) || "").trim();
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const fullName = field(formData, "fullName").replace(/\s+/g, " ");
    const email = field(formData, "email").toLowerCase();
    const phone = normalizePhone(field(formData, "phone"));
    const qualification = field(formData, "qualification");
    const college = field(formData, "college").replace(/\s+/g, " ");
    const yearOfPassing = field(formData, "yearOfPassing");
    const turnstileToken = field(formData, "turnstileToken");

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

    const turnstileOk = await verifyTurnstileToken(
      turnstileToken,
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim(),
    );
    if (!turnstileOk) {
      return NextResponse.json(
        { error: "Captcha verification failed. Please try again." },
        { status: 400 },
      );
    }

    let resumeUrl = null;
    let resumePublicId = null;
    let resumeFileName = null;

    if (hasFile) {
      const uploaded = await uploadRawFile(file, "triwinz/training-resumes");
      resumeUrl = uploaded.url;
      resumePublicId = uploaded.publicId;
      resumeFileName = file.name;
    }

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
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === "rejected") {
          console.error("Training application email failed:", r.reason);
        }
      });
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
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 },
    );
  }
}
