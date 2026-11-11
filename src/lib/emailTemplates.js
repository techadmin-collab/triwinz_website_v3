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
                        alt="TriWinz Technologies"
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
                ${footerNote || "This email was sent by TriWinz Technologies."}
              </p>
              <p style="margin:0 0 10px;font-size:13px;line-height:1.5;">
                <a href="${escapeHtml(siteUrl)}" style="color:${BRAND.cyan};text-decoration:none;font-weight:700;">triwinz.com</a>
                <span style="color:#9ec9d0;">&nbsp;·&nbsp;</span>
                <a href="${escapeHtml(siteUrl)}/careers" style="color:${BRAND.cyan};text-decoration:none;font-weight:700;">Careers</a>
                <span style="color:#9ec9d0;">&nbsp;·&nbsp;</span>
                <a href="${escapeHtml(siteUrl)}/contact-us" style="color:${BRAND.cyan};text-decoration:none;font-weight:700;">Contact</a>
              </p>
              <p style="margin:0;font-size:12px;line-height:1.5;color:#9ca3af;">
                © ${new Date().getFullYear()} TriWinz Technologies. All rights reserved.
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
    preview: `${fullName} sent a message via the TriWinz website`,
    footerNote:
      "This is an internal notification from the TriWinz website contact form.",
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
    `Thank you for submitting your application for the position ${jobTitle} at TriWinz Technologies Pvt. Ltd.`,
    "",
    "We are pleased to confirm that your application has been successfully received through our Careers Portal. Our Talent Acquisition team will review your profile against the requirements of the position.",
    "",
    "If your qualifications and experience match our current requirements, we will contact you regarding the next steps in the selection process.",
    "",
    "We appreciate your interest in building your career with TriWinz Technologies and thank you for taking the time to apply.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "TriWinz Technologies Pvt. Ltd.",
  ].join("\n");

  const html = baseLayout({
    title: "Application received",
    eyebrow: "Careers Portal",
    preview: `Thank you for applying for ${jobTitle} at TriWinz Technologies`,
    footerNote:
      "This is an automated confirmation from TriWinz Careers. Please do not reply to this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 14px;">
        Thank you for submitting your application for the position
        <strong style="color:#111827;">${escapeHtml(jobTitle)}</strong>
        at TriWinz Technologies Pvt. Ltd.
      </p>
      <p style="margin:0 0 14px;">
        We are pleased to confirm that your application has been successfully received through our Careers Portal.
        Our Talent Acquisition team will review your profile against the requirements of the position.
      </p>
      <p style="margin:0 0 14px;">
        If your qualifications and experience match our current requirements, we will contact you regarding the next steps in the selection process.
      </p>
      <p style="margin:0 0 22px;">
        We appreciate your interest in building your career with TriWinz Technologies and thank you for taking the time to apply.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        TriWinz Technologies Pvt. Ltd.
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
    `Thank you for your interest in the ${jobTitle} role at TriWinz Technologies Pvt. Ltd. and for taking the time to apply.`,
    "",
    "After careful review, we will not be moving forward with your application at this time.",
    "We truly appreciate your interest in joining TriWinz and wish you all the best in your career.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "TriWinz Technologies Pvt. Ltd.",
  ].join("\n");

  const html = baseLayout({
    title: "Application update",
    eyebrow: "Careers Portal",
    preview: `Update on your application for ${jobTitle}`,
    footerNote:
      "This is an automated update from TriWinz Careers. Please do not reply to this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 14px;">
        Thank you for your interest in the
        <strong style="color:#111827;">${escapeHtml(jobTitle)}</strong>
        role at TriWinz Technologies Pvt. Ltd., and for the time you took to apply.
      </p>
      <p style="margin:0 0 14px;">
        After careful review, we will not be progressing with your application for this role.
        This decision does not reflect on your overall capabilities, and we encourage you to
        explore future openings that may be a stronger match.
      </p>
      <p style="margin:0 0 22px;">
        We sincerely appreciate your interest in TriWinz and wish you every success ahead.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        TriWinz Technologies Pvt. Ltd.
      </p>
    `,
  });

  return { subject, text, html };
}

/** Contact form → acknowledgement to the person who wrote to us */
export function contactReceivedTemplate({ fullName }) {
  const subject = "Thank you for contacting TriWinz";
  const text = [
    `Dear ${fullName},`,
    "",
    "Thank you for reaching out to TriWinz. We have received your message and our team will get back to you shortly.",
    "",
    "Best regards,",
    "Team TriWinz",
    "TriWinz Technologies Pvt. Ltd.",
  ].join("\n");

  const html = baseLayout({
    title: "We received your message",
    eyebrow: "Contact TriWinz",
    preview: "Thank you for contacting TriWinz. Our team will get back to you shortly.",
    footerNote:
      "This is an automated confirmation from TriWinz. Please do not reply to this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 22px;">
        Thank you for reaching out to <strong style="color:#111827;">TriWinz</strong>.
        We have received your message and our team will get back to you shortly.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Team TriWinz</strong><br />
        TriWinz Technologies Pvt. Ltd.
      </p>
    `,
  });

  return { subject, text, html };
}

/** Interview panel → private link to share their availability */
export function interviewerAvailabilityTemplate({ name, url }) {
  const subject = "Your TriWinz interview panel page";
  const text = [
    `Dear ${name},`,
    "",
    "Thank you for being part of the TriWinz interview panel.",
    "",
    "Your personal page is ready. Use the link below to see the interviews scheduled with you, view candidate resumes, share your assessment and mark the dates and times you are available. You can come back to the same link at any time.",
    "",
    url,
    "",
    "This link is personal to you, so please don't share it.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "TriWinz Technologies Pvt. Ltd.",
  ].join("\n");

  const html = baseLayout({
    title: "Your interview panel page",
    eyebrow: "Interview panel",
    preview: "See your interviews, share assessments and mark your availability",
    footerNote:
      "This link is personal to you. Please don't forward this email.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(name)}</strong>,</p>
      <p style="margin:0 0 14px;">
        Thank you for being part of the <strong style="color:#111827;">TriWinz</strong> interview panel.
      </p>
      <p style="margin:0 0 22px;">
        Your personal page is ready. Use it to see the interviews scheduled with you, view candidate
        resumes, share your assessment and mark the dates and times you are available.
        You can come back to the same link at any time.
      </p>
      <p style="margin:0 0 22px;">
        <a href="${escapeHtml(url)}" style="display:inline-block;background:#1D5758;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:8px;">
          Open my panel page
        </a>
      </p>
      <p style="margin:0 0 22px;color:#6b7280;font-size:13px;line-height:1.6;">
        If the button doesn't work, copy this link into your browser:<br />
        <span style="color:#1D5758;word-break:break-all;">${escapeHtml(url)}</span>
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        TriWinz Technologies Pvt. Ltd.
      </p>
    `,
  });

  return { subject, text, html };
}

/* ---------- Interview scheduled ---------- */

function detailRowsHtml(rows) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 22px;border:1px solid #e5eaea;border-radius:10px;border-collapse:separate;">
    ${rows
      .map(
        ([label, value], i) => `<tr>
        <td style="padding:10px 14px;${i ? "border-top:1px solid #eef1f1;" : ""}color:#6b7280;font-size:13px;width:34%;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:10px 14px;${i ? "border-top:1px solid #eef1f1;" : ""}color:#111827;font-size:14px;font-weight:600;vertical-align:top;">${value}</td>
      </tr>`,
      )
      .join("")}
  </table>`;
}

function linkHtml(url, label) {
  return `<a href="${escapeHtml(url)}" style="color:#1D5758;font-weight:700;word-break:break-all;">${escapeHtml(label || url)}</a>`;
}

/** Rows shared by both emails: [label, html, text] */
function interviewRows({ jobTitle, levelText, whenText, modeText, meetingLink, location }) {
  const rows = [
    ["Position", escapeHtml(jobTitle), jobTitle],
    ["Interview", escapeHtml(levelText), levelText],
    ["Date & time", escapeHtml(whenText), whenText],
  ];
  if (modeText) rows.push(["Mode", escapeHtml(modeText), modeText]);
  if (meetingLink) rows.push(["Meeting link", linkHtml(meetingLink, "Join meeting"), meetingLink]);
  if (location) rows.push([meetingLink ? "Venue" : "Location", escapeHtml(location), location]);
  return rows;
}

/** Interview scheduled → candidate */
export function interviewScheduledCandidateTemplate({ fullName, jobTitle, levelText, whenText, modeText, meetingLink, location, isUpdate }) {
  const subject = `${isUpdate ? "Updated: " : ""}Interview scheduled: ${jobTitle} at TriWinz`;
  const rows = interviewRows({ jobTitle, levelText, whenText, modeText, meetingLink, location });
  const text = [
    `Dear ${fullName},`,
    "",
    isUpdate
      ? `The details of your interview for the ${jobTitle} position at TriWinz Technologies have been updated. Please see the latest details below.`
      : `Thank you for your interest in the ${jobTitle} position at TriWinz Technologies. We are pleased to invite you for an interview.`,
    "",
    ...rows.map(([label, , value]) => `${label}: ${value}`),
    "",
    "Please join a few minutes early. A calendar invite is attached. If you need to reschedule, just reply to this email.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "TriWinz Technologies Pvt. Ltd.",
  ].join("\n");

  const html = baseLayout({
    title: isUpdate ? "Your interview has been updated" : "Your interview is scheduled",
    eyebrow: "TriWinz Careers",
    preview: `${levelText} for ${jobTitle} · ${whenText}`,
    footerNote: "This email was sent by the TriWinz Talent Acquisition team.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(fullName)}</strong>,</p>
      <p style="margin:0 0 18px;">
        ${
          isUpdate
            ? `The details of your interview for the <strong style="color:#111827;">${escapeHtml(jobTitle)}</strong> position at TriWinz Technologies have been updated. Please see the latest details below.`
            : `Thank you for your interest in the <strong style="color:#111827;">${escapeHtml(jobTitle)}</strong> position at TriWinz Technologies. We are pleased to invite you for an interview.`
        }
      </p>
      ${detailRowsHtml(rows.map(([l, h]) => [l, h]))}
      <p style="margin:0 0 22px;">
        Please join a few minutes early. A calendar invite is attached. If you need to reschedule, just reply to this email.
      </p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        TriWinz Technologies Pvt. Ltd.
      </p>
    `,
  });

  return { subject, text, html };
}

/** Interview scheduled → panel member */
export function interviewScheduledPanelTemplate({
  name,
  candidateName,
  jobTitle,
  levelText,
  whenText,
  modeText,
  meetingLink,
  location,
  panelNames,
  notes,
  panelUrl,
  isUpdate,
}) {
  const subject = `${isUpdate ? "Updated: " : ""}Interview: ${candidateName} · ${jobTitle} · ${whenText}`;
  const rows = [
    ["Candidate", escapeHtml(candidateName), candidateName],
    ...interviewRows({ jobTitle, levelText, whenText, modeText, meetingLink, location }),
  ];
  if (panelNames?.length) rows.push(["Panel", escapeHtml(panelNames.join(", ")), panelNames.join(", ")]);

  const text = [
    `Dear ${name},`,
    "",
    isUpdate
      ? `The interview below has been updated. Please see the latest details.`
      : `You have been scheduled to interview a candidate for TriWinz.`,
    "",
    ...rows.map(([label, , value]) => `${label}: ${value}`),
    notes ? `Notes from the TriWinz team: ${notes}` : null,
    "",
    panelUrl
      ? `Open your panel page to see the candidate's resume, the job description and the interview checklist, and to submit your assessment: ${panelUrl}`
      : null,
    "",
    "A calendar invite is attached.",
    "",
    "Best regards,",
    "Talent Acquisition Team",
    "TriWinz Technologies Pvt. Ltd.",
  ]
    .filter((l) => l !== null)
    .join("\n");

  const html = baseLayout({
    title: isUpdate ? "Interview updated" : "New interview scheduled",
    eyebrow: "Interview panel",
    preview: `${candidateName} · ${jobTitle} · ${whenText}`,
    footerNote: "Your panel link is personal to you. Please don't forward this email outside the panel.",
    bodyHtml: `
      <p style="margin:0 0 14px;">Dear <strong style="color:#111827;">${escapeHtml(name)}</strong>,</p>
      <p style="margin:0 0 18px;">
        ${isUpdate ? "The interview below has been updated. Please see the latest details." : "You have been scheduled to interview a candidate for TriWinz."}
      </p>
      ${detailRowsHtml(rows.map(([l, h]) => [l, h]))}
      ${
        notes
          ? `<p style="margin:0 0 6px;color:#6b7280;font-size:13px;">Notes from the TriWinz team</p>
             <div style="margin:0 0 22px;padding:12px 14px;background:#f8fafb;border:1px solid #eef2f3;border-radius:8px;white-space:pre-wrap;color:#111827;">${escapeHtml(notes)}</div>`
          : ""
      }
      ${
        panelUrl
          ? `<p style="margin:0 0 14px;">Open your panel page to see the candidate's resume, the job description and the interview checklist, and to submit your assessment.</p>
             <p style="margin:0 0 22px;">
               <a href="${escapeHtml(panelUrl)}" style="display:inline-block;background:#1D5758;color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:8px;">Open my panel page</a>
             </p>`
          : ""
      }
      <p style="margin:0 0 22px;color:#6b7280;font-size:13px;">A calendar invite is attached.</p>
      <p style="margin:0;color:#111827;line-height:1.7;">
        Best regards,<br />
        <strong>Talent Acquisition Team</strong><br />
        TriWinz Technologies Pvt. Ltd.
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
    "TriWinz Technologies Pvt. Ltd.",
  ].join("\n");

  const html = baseLayout({
    title: "Application received",
    eyebrow: "Corporate Training Programme",
    preview: "Thank you for applying to the TriWinz Intensive Corporate Training Programme",
    footerNote:
      "This is an automated confirmation from TriWinz Careers. Please do not reply to this email.",
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
        TriWinz Technologies Pvt. Ltd.
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
      "This is an internal notification from the TriWinz website training form.",
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
