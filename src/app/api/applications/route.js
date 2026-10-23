import { NextResponse } from "next/server";
import { sendApplicationEmails } from "../../../lib/sendApplicationEmails";
import { prisma } from "../../../lib/prisma";
import { verifyTurnstileToken } from "../../../lib/turnstile";
import { uploadRawFile } from "../../../lib/cloudinary";
import {
  getResumeFileNameError,
  RESUME_FILENAME_ERROR,
} from "../../../lib/resumeFile";

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

export async function POST(req) {
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
    let turnstileToken;
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
      turnstileToken = String(formData.get("turnstileToken") || "");

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

      const uploaded = await uploadRawFile(file, "triwinz/resumes");
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
      turnstileToken = String(body.turnstileToken || "");
      resumeUrl = String(body.resumeUrl || "").trim();
      resumePublicId = body.resumePublicId || null;
      resumeFileName = body.resumeFileName || null;

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

    await sendApplicationEmails({
      fullName,
      email,
      jobTitle,
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("Application create failed:", error);
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
