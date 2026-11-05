import { NextResponse } from "next/server";
import { sendApplicationEmails } from "../../../lib/sendApplicationEmails";
import { prisma } from "../../../lib/prisma";
import { checkRecaptcha } from "../../../lib/recaptcha";
import { reportIssue } from "../../../lib/reportIssue";
import { uploadRawFile } from "../../../lib/cloudinary";
import {
  getResumeFileNameError,
  RESUME_FILENAME_ERROR,
} from "../../../lib/resumeFile";

const SOURCE = "job-application";
const CAPTCHA_ACTION = "job_application";

const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

const MAX_BYTES = 512 * 1024; // 512KB
const MAX_REFERRAL_SOURCE_LENGTH = 25;

function parseYesNo(value) {
  if (value === true || value === "true" || value === "yes") return true;
  if (value === false || value === "false" || value === "no") return false;
  return null;
}

function isFileNameError(error) {
  const message = String(error?.message || "");
  return message.includes("public_id") && message.includes("invalid");
}

export async function POST(req) {
  // Who was affected — shown in System issues so the team can follow up.
  const context = {};
  let step = "reading the form";

  try {
    const contentType = req.headers.get("content-type") || "";
    let fullName;
    let email;
    let phone;
    let jobSlug;
    let jobTitle;
    let coverLetter;
    let referralSource;
    let availableToJoinAndRelocate;
    let captchaToken;
    let resumeUrl;
    let resumePublicId;
    let resumeFileName;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      fullName = String(formData.get("fullName") || "").trim();
      email = String(formData.get("email") || "").trim();
      phone = String(formData.get("phone") || "").trim();
      jobSlug = String(formData.get("jobSlug") || "").trim();
      jobTitle = String(formData.get("jobTitle") || "").trim();
      coverLetter = String(formData.get("coverLetter") || "").trim() || null;
      referralSource =
        String(formData.get("referralSource") || "").trim() || null;
      availableToJoinAndRelocate = parseYesNo(
        formData.get("availableToJoinAndRelocate"),
      );
      captchaToken = String(formData.get("recaptchaToken") || "");
      Object.assign(context, { applicantName: fullName, applicantEmail: email, jobTitle });

      const file = formData.get("resume");
      if (!file || typeof file === "string") {
        return NextResponse.json(
          { error: "Please upload your resume" },
          { status: 400 },
        );
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

      step = "checking the captcha";
      const captchaFail = await checkRecaptcha(req, {
        token: captchaToken,
        action: CAPTCHA_ACTION,
        source: SOURCE,
        context,
      });
      if (captchaFail) {
        return NextResponse.json({ error: captchaFail.error }, { status: captchaFail.status });
      }

      step = "uploading the resume";
      let uploaded;
      try {
        uploaded = await uploadRawFile(file, "triwinz/resumes");
      } catch (uploadError) {
        if (isFileNameError(uploadError)) {
          return NextResponse.json({ error: RESUME_FILENAME_ERROR }, { status: 400 });
        }
        await reportIssue({
          source: SOURCE,
          code: "resume_upload_failed",
          title: "Resume upload to Cloudinary failed, so the application was not saved.",
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
    } else {
      const body = await req.json();
      fullName = String(body.fullName || "").trim();
      email = String(body.email || "").trim();
      phone = String(body.phone || "").trim();
      jobSlug = String(body.jobSlug || "").trim();
      jobTitle = String(body.jobTitle || "").trim();
      coverLetter = body.coverLetter ? String(body.coverLetter).trim() : null;
      referralSource = body.referralSource
        ? String(body.referralSource).trim()
        : null;
      availableToJoinAndRelocate = parseYesNo(body.availableToJoinAndRelocate);
      captchaToken = String(body.recaptchaToken || "");
      resumeUrl = String(body.resumeUrl || "").trim();
      resumePublicId = body.resumePublicId || null;
      resumeFileName = body.resumeFileName || null;
      Object.assign(context, { applicantName: fullName, applicantEmail: email, jobTitle });

      step = "checking the captcha";
      const captchaFail = await checkRecaptcha(req, {
        token: captchaToken,
        action: CAPTCHA_ACTION,
        source: SOURCE,
        context,
      });
      if (captchaFail) {
        return NextResponse.json({ error: captchaFail.error }, { status: captchaFail.status });
      }
    }

    if (!fullName || !email || !phone || !jobSlug || !jobTitle || !resumeUrl) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    if (referralSource && referralSource.length > MAX_REFERRAL_SOURCE_LENGTH) {
      return NextResponse.json(
        {
          error: `Referral source must be ${MAX_REFERRAL_SOURCE_LENGTH} characters or fewer.`,
        },
        { status: 400 },
      );
    }

    step = "saving the application";
    const application = await prisma.jobApplication.create({
      data: {
        fullName,
        email,
        phone,
        jobSlug,
        jobTitle,
        coverLetter,
        referralSource,
        availableToJoinAndRelocate,
        resumeUrl,
        resumePublicId,
        resumeFileName,
        status: "new",
      },
    });

    step = "sending the confirmation email";
    const mailResult = await sendApplicationEmails({
      fullName,
      email,
      jobTitle,
    });
    if (!mailResult?.applicant) {
      // The application is saved; only the thank-you email failed.
      await reportIssue({
        source: SOURCE,
        code: "email_failed",
        title: "Application was saved, but the confirmation email to the applicant could not be sent.",
        error: mailResult?.error,
        context,
      });
    }

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Application create failed:", error);
    if (isFileNameError(error)) {
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
          ? "Application could not be saved to the database."
          : `Application failed while ${step}.`,
      error,
      context,
    });
    return NextResponse.json(
      { error: "Failed to submit application. Please try again in a few minutes." },
      { status: 500 },
    );
  }
}
