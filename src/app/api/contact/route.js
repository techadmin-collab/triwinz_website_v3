import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { sendMail } from "../../../lib/mail";
import { contactNotificationTemplate } from "../../../lib/emailTemplates";

export async function POST(req) {
  try {
    const body = await req.json();

    const fullName = String(body.full_name || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const company = String(body.company || "").trim();
    const message = String(body.message || "").trim();

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
    return NextResponse.json(
      { error: error?.message || "Failed to send message" },
      { status: 500 },
    );
  }
}
