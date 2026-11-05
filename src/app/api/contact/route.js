import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../lib/mail";
import { contactNotificationTemplate } from "../../../lib/emailTemplates";
import { reportIssue } from "../../../lib/reportIssue";

export async function POST(req) {
  const context = {};
  try {
    const body = await req.json();

    const fullName = String(body.full_name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "").trim();
    Object.assign(context, { applicantName: fullName, applicantEmail: email, company });

    if (!fullName || !email || !phone || !company || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const notifyTo =
      process.env.CONTACT_NOTIFICATION_EMAIL || "techadmin@triwinz.net";

    let emailSent = false;
    let emailError = null;

    try {
      const template = contactNotificationTemplate({
        fullName,
        email,
        phone,
        company,
        message,
      });

      await sendMail({
        to: notifyTo,
        subject: template.subject,
        text: template.text,
        html: template.html,
        replyTo: email,
      });
      emailSent = true;
    } catch (error) {
      emailError = error?.message || "SMTP send failed";
      console.error("Contact email failed:", error);
    }

    if (!emailSent) {
      await reportIssue({
        source: "contact",
        code: "email_failed",
        title: "Contact message was saved, but the notification email to the team could not be sent. Check Admin -> Contacts.",
        error: emailError,
        context,
      });
    }

    const saved = await prisma.contactMessage.create({
      data: {
        fullName,
        email,
        phone,
        company,
        message,
        emailSent,
        emailError,
        status: "new",
      },
    });

    return NextResponse.json({
      ok: true,
      id: saved.id,
      emailSent,
    });
  } catch (error) {
    console.error("Contact API error:", error);
    await reportIssue({
      source: "contact",
      code: "save_failed",
      title: "Contact form submission failed and the message was not saved.",
      error,
      context,
    });
    return NextResponse.json(
      { error: "Failed to send message. Please try again in a few minutes." },
      { status: 500 },
    );
  }
}
