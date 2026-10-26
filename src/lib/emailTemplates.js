function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://triwinz.com";
  return String(raw).replace(/\/$/, "");
}

/**
 * Public absolute logo URL (do not use CID attachments — Gmail shows them
 * as paperclips in the inbox list). Prefer the live site so local SMTP tests
 * still load the logo.
 */
function getLogoUrl() {
  return "https://triwinz.com/og-image.webp";
}

const BRAND = {
  cyan: "#00C4D6",
  cyanSoft: "#E6FBFD",
  cyanBorder: "#C9F2F7",
  ink: "#111827",
  muted: "#6b7280",
  pageBg: "#f2f6f8",
};

function detailRow(label, valueHtml, isLast = false) {
  return `
    <tr>
      <td style="padding:12px 0;width:120px;vertical-align:top;font-size:12px;font-weight:700;letter-spacing:0.04em;text-transform:uppercase;color:${BRAND.muted};border-bottom:${isLast ? "none" : `1px solid ${BRAND.cyanBorder}`};">
        ${escapeHtml(label)}
      </td>
      <td style="padding:12px 0;vertical-align:top;font-size:15px;color:${BRAND.ink};border-bottom:${isLast ? "none" : `1px solid ${BRAND.cyanBorder}`};">
        ${valueHtml}
      </td>
    </tr>
  `;
}

function baseLayout({
  title,
  preview,
  eyebrow,
  bodyHtml,
  footerNote,
}) {
  const siteUrl = getSiteUrl();
  const logoUrl = getLogoUrl();

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:${BRAND.pageBg};font-family:Arial,Helvetica,sans-serif;color:#1f2937;-webkit-text-size-adjust:100%;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${escapeHtml(preview)}
  </div>
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:${BRAND.pageBg};padding:32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;border-collapse:separate;">
          <!-- Card -->
          <tr>
            <td style="background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid ${BRAND.cyanBorder};box-shadow:0 8px 24px rgba(0,196,214,0.08);">
              <!-- Dark logo header (matches logo background) -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background:#0b0b0b;padding:22px 28px;">
                    <a href="${escapeHtml(siteUrl)}" style="text-decoration:none;">
                      <img
                        src="${escapeHtml(logoUrl)}"
                        alt="Triwinz Technologies"
                        width="240"
                        style="display:block;width:240px;max-width:85%;height:auto;border:0;outline:none;text-decoration:none;"
                      />
                    </a>
                  </td>
                </tr>
                <tr>
                  <td style="height:4px;background:${BRAND.cyan};font-size:0;line-height:0;">&nbsp;</td>
                </tr>
              </table>

              <!-- Title block -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:28px 32px 8px;">
                    ${
                      eyebrow
                        ? `<div style="display:inline-block;padding:5px 10px;border-radius:999px;background:${BRAND.cyanSoft};color:#067a87;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:12px;">${escapeHtml(eyebrow)}</div>`
                        : ""
                    }
                    <h1 style="margin:0;font-size:24px;line-height:1.3;font-weight:700;color:${BRAND.ink};">
                      ${escapeHtml(title)}
                    </h1>
                  </td>
                </tr>
              </table>

              <!-- Body -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="padding:12px 32px 32px;font-size:15px;line-height:1.7;color:#4b5563;">
                    ${bodyHtml}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:22px 8px 0;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;line-height:1.5;color:${BRAND.muted};">
                ${footerNote || "This email was sent by Triwinz Technologies."}
              </p>
              <p style="margin:0 0 10px;font-size:13px;line-height:1.5;">
                <a href="${escapeHtml(siteUrl)}" style="color:${BRAND.cyan};text-decoration:none;font-weight:700;">triwinz.com</a>
                <span style="color:#9ec9d0;">&nbsp;·&nbsp;</span>
                <a href="${escapeHtml(siteUrl)}/careers" style="color:${BRAND.cyan};text-decoration:none;font-weight:700;">Careers</a>
                <span style="color:#9ec9d0;">&nbsp;·&nbsp;</span>
                <a href="${escapeHtml(siteUrl)}/contact-us" style="color:${BRAND.cyan};text-decoration:none;font-weight:700;">Contact</a>
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">
                © ${new Date().getFullYear()} Triwinz Technologies. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/** Contact form → internal notification to techadmin */
export function contactNotificationTemplate({
  fullName,
  email,
  phone,
  company,
  message,
}) {
  const subject = `New contact enquiry from ${fullName}`;
  const text = [
    "New contact enquiry",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Company: ${company}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const html = baseLayout({
    title: "New website enquiry",
    eyebrow: "Contact form",
    preview: `${fullName} sent a message via the Triwinz website`,
    footerNote:
      "This is an internal notification from the Triwinz website contact form.",
    bodyHtml: `
      <p style="margin:0 0 18px;">
        A new enquiry was submitted through the website. Details are below for follow-up.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.cyanBorder};border-radius:10px;background:${BRAND.cyanSoft};padding:4px 18px;">
        ${detailRow("Name", `<strong style="color:#111827;">${escapeHtml(fullName)}</strong>`)}
        ${detailRow(
          "Email",
          `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.cyan};text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>`,
        )}
        ${detailRow("Phone", escapeHtml(phone))}
        ${detailRow("Company", escapeHtml(company), true)}
      </table>
      <div style="margin-top:20px;border:1px solid ${BRAND.cyanBorder};border-radius:10px;overflow:hidden;">
        <div style="padding:10px 16px;background:${BRAND.cyan};color:#ffffff;font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;">
          Message
        </div>
        <div style="padding:16px;background:#ffffff;white-space:pre-wrap;color:#374151;font-size:14px;line-height:1.7;">
${escapeHtml(message)}
        </div>
      </div>
      <p style="margin:20px 0 0;font-size:13px;color:#6b7280;">
        You can reply directly to the sender using their email address above.
      </p>
    `,
  });

  return { subject, text, html };
}

/** Job application → thank-you to applicant */
export function applicationReceivedTemplate({ fullName, jobTitle }) {
  const subject = `We received your application for ${jobTitle}`;
  const text = [
    `Dear ${fullName},`,
    "",
    `Thank you for submitting your application for the position ${jobTitle} at Triwinz Technologies Pvt. Ltd.`,
    "",
    "We are pleased to confirm that your application has been successfully received through our Careers Portal. Our Talent Acquisition team will review your profile against the requirements of the position.",
    "",
    "If your qualifications and experience match our current requirements, we will contact you regarding the next steps in the selection process.",
    "",
    "We appreciate your interest in building your career with Triwinz Technologies and thank you for taking the time to apply.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "Triwinz Technologies Pvt. Ltd.",
    "Thiruvananthapuram, Kerala",
  ].join("\n");

  const html = baseLayout({
    title: "Application received",
    eyebrow: "Careers Portal",
    preview: `Thank you for applying for ${jobTitle} at Triwinz Technologies`,
    footerNote:
      "This is an automated confirmation from Triwinz Careers. Please do not reply to this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 14px;">
        Thank you for submitting your application for the position
        <strong style="color:#111827;">${escapeHtml(jobTitle)}</strong>
        at Triwinz Technologies Pvt. Ltd.
      </p>
      <p style="margin:0 0 14px;">
        We are pleased to confirm that your application has been successfully received through our Careers Portal.
        Our Talent Acquisition team will review your profile against the requirements of the position.
      </p>
      <p style="margin:0 0 14px;">
        If your qualifications and experience match our current requirements, we will contact you regarding the next steps in the selection process.
      </p>
      <p style="margin:0 0 22px;">
        We appreciate your interest in building your career with Triwinz Technologies and thank you for taking the time to apply.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        Triwinz Technologies Pvt. Ltd.<br />
        <span style="color:#6b7280;">Thiruvananthapuram, Kerala</span>
      </p>
    `,
  });

  return { subject, text, html };
}

/** Admin rejects application → email to applicant */
export function applicationRejectedTemplate({ fullName, jobTitle }) {
  const subject = `Update on your application for ${jobTitle}`;
  const text = [
    `Dear ${fullName},`,
    "",
    `Thank you for your interest in the ${jobTitle} role at Triwinz Technologies Pvt. Ltd. and for taking the time to apply.`,
    "",
    "After careful review, we will not be moving forward with your application at this time.",
    "We truly appreciate your interest in joining Triwinz and wish you all the best in your career.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "Triwinz Technologies Pvt. Ltd.",
    "Thiruvananthapuram, Kerala",
  ].join("\n");

  const html = baseLayout({
    title: "Application update",
    eyebrow: "Careers Portal",
    preview: `Update on your application for ${jobTitle}`,
    footerNote:
      "This is an automated update from Triwinz Careers. Please do not reply to this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 14px;">
        Thank you for your interest in the
        <strong style="color:#111827;">${escapeHtml(jobTitle)}</strong>
        role at Triwinz Technologies Pvt. Ltd., and for the time you took to apply.
      </p>
      <p style="margin:0 0 14px;">
        After careful review, we will not be progressing with your application for this role.
        This decision does not reflect on your overall capabilities, and we encourage you to
        explore future openings that may be a stronger match.
      </p>
      <p style="margin:0 0 22px;">
        We sincerely appreciate your interest in Triwinz and wish you every success ahead.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        Triwinz Technologies Pvt. Ltd.<br />
        <span style="color:#6b7280;">Thiruvananthapuram, Kerala</span>
      </p>
    `,
  });

  return { subject, text, html };
}

/** Training program application → confirmation to applicant */
export function trainingApplicationReceivedTemplate({ fullName }) {
  const subject = "We received your application: Intensive Corporate Training Programme";
  const text = [
    `Dear ${fullName},`,
    "",
    "Thank you for applying to the TriWinz Intensive Corporate Training Programme.",
    "",
    "Your application has been received. Our team will review your details and contact you with the next steps, including the selection process and batch schedule.",
    "",
    "Best regards,",
    "Training Team",
    "Triwinz Technologies Pvt. Ltd.",
    "Thiruvananthapuram, Kerala",
  ].join("\n");

  const html = baseLayout({
    title: "Application received",
    eyebrow: "Corporate Training Programme",
    preview: "Thank you for applying to the TriWinz Intensive Corporate Training Programme",
    footerNote:
      "This is an automated confirmation from Triwinz Careers. Please do not reply to this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 14px;">
        Thank you for applying to the
        <strong style="color:#111827;">TriWinz Intensive Corporate Training Programme</strong>.
      </p>
      <p style="margin:0 0 22px;">
        Your application has been received. Our team will review your details and contact you
        with the next steps, including the selection process and batch schedule.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Training Team</strong><br />
        Triwinz Technologies Pvt. Ltd.<br />
        <span style="color:#6b7280;">Thiruvananthapuram, Kerala</span>
      </p>
    `,
  });

  return { subject, text, html };
}

/** Training program application → internal notification */
export function trainingApplicationNotificationTemplate({
  fullName,
  email,
  phone,
  qualification,
  college,
  yearOfPassing,
  resumeUrl,
}) {
  const subject = `New Corporate Training Programme application from ${fullName}`;
  const text = [
    "New Intensive Corporate Training Programme application",
    "",
    `Name: ${fullName}`,
    `Email: ${email}`,
    `Phone: ${phone}`,
    `Qualification: ${qualification}`,
    `College: ${college}`,
    `Year of passing: ${yearOfPassing}`,
    `Resume: ${resumeUrl || "Not attached"}`,
  ].join("\n");

  const html = baseLayout({
    title: "New training application",
    eyebrow: "Corporate Training Programme",
    preview: `${fullName} applied for the Intensive Corporate Training Programme`,
    footerNote:
      "This is an internal notification from the Triwinz website training form.",
    bodyHtml: `
      <p style="margin:0 0 18px;">
        A new application for the Intensive Corporate Training Programme was submitted through the website.
      </p>
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border:1px solid ${BRAND.cyanBorder};border-radius:10px;background:${BRAND.cyanSoft};padding:4px 18px;">
        ${detailRow("Name", `<strong style="color:#111827;">${escapeHtml(fullName)}</strong>`)}
        ${detailRow(
          "Email",
          `<a href="mailto:${escapeHtml(email)}" style="color:${BRAND.cyan};text-decoration:none;font-weight:600;">${escapeHtml(email)}</a>`,
        )}
        ${detailRow("Phone", escapeHtml(phone))}
        ${detailRow("Qualification", escapeHtml(qualification))}
        ${detailRow("College", escapeHtml(college))}
        ${detailRow("Passing year", escapeHtml(yearOfPassing))}
        ${detailRow(
          "Resume",
          resumeUrl
            ? `<a href="${escapeHtml(resumeUrl)}" style="color:${BRAND.cyan};text-decoration:none;font-weight:600;">View resume</a>`
            : "Not attached",
          true,
        )}
      </table>
      <p style="margin:20px 0 0;font-size:13px;color:#6b7280;">
        Manage this application from the Training section of the admin dashboard.
      </p>
    `,
  });

  return { subject, text, html };
}
