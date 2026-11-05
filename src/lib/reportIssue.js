import { prisma } from "./prisma";
import { sendMail } from "./mail";

// Problems a site visitor ran into, recorded so the team finds out before users complain.
// Every issue is saved under Admin -> System issues. "error" issues also send an alert
// email (at most once an hour per kind of problem, and again if it comes back after
// being marked resolved).

const SOURCE_LABELS = {
  "job-application": "Job application form",
  "training-application": "Training application form",
  contact: "Contact form",
};

const MAX_RECENT = 10;
const NOTIFY_EVERY_MS = 60 * 60 * 1000; // 1 hour
const EMAIL_TIMEOUT_MS = 6000;

export function sourceLabel(source) {
  return SOURCE_LABELS[source] || source;
}

function clip(value, max) {
  const text = String(value ?? "");
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error("timeout")), ms)),
  ]);
}

function escapeHtml(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

async function sendAlertEmail(issue, context) {
  const to =
    process.env.ALERT_EMAIL ||
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    "techadmin@triwinz.net";
  const site = (process.env.NEXTAUTH_URL || "https://www.triwinz.com").replace(/\/$/, "");
  const link = `${site}/admin/system-issues`;
  const lines = [
    `${sourceLabel(issue.source)}: ${issue.title}`,
    "",
    issue.message ? `Details: ${issue.message}` : null,
    `Seen ${issue.count} time${issue.count === 1 ? "" : "s"} (first ${issue.firstSeenAt.toISOString()}).`,
    context?.applicantEmail
      ? `Affected visitor: ${context.applicantName || ""} <${context.applicantEmail}>`
      : null,
    "",
    `Open the admin panel to review it: ${link}`,
  ].filter((l) => l !== null);

  await withTimeout(
    sendMail({
      to,
      subject: `[Triwinz site alert] ${sourceLabel(issue.source)}: ${issue.title}`,
      text: lines.join("\n"),
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#1f2937">${lines
        .map((l) => (l ? `<p style="margin:0 0 8px">${escapeHtml(l)}</p>` : "<br/>"))
        .join("")}<p><a href="${link}" style="color:#1D5758;font-weight:bold">Open System issues</a></p></div>`,
    }),
    EMAIL_TIMEOUT_MS,
  );
}

/**
 * Record a problem. Never throws — reporting must not break the request that hit it.
 *
 * @param {object} p
 * @param {"job-application"|"training-application"|"contact"} p.source
 * @param {string} p.code      short stable id, e.g. "resume_upload_failed"
 * @param {string} p.title     plain-language summary shown in the admin panel
 * @param {"error"|"warning"} [p.severity]
 * @param {unknown} [p.error]  the caught error (its message is stored)
 * @param {object} [p.context] extra facts (no secrets/tokens): applicantName, applicantEmail, jobTitle, ...
 */
export async function reportIssue({
  source,
  code,
  title,
  severity = "error",
  error,
  context = {},
}) {
  try {
    const fingerprint = `${source}:${code}`;
    const now = new Date();
    const message = error
      ? clip(error?.message || String(error), 1000)
      : context?.message
        ? clip(context.message, 1000)
        : null;

    const occurrence = JSON.stringify({
      at: now.toISOString(),
      ...(message ? { message } : {}),
      ...Object.fromEntries(
        Object.entries(context || {})
          .filter(([k, v]) => k !== "message" && v !== undefined && v !== null && v !== "")
          .map(([k, v]) => [k, clip(typeof v === "string" ? v : JSON.stringify(v), 300)]),
      ),
    });

    console.error(`[system-issue] ${fingerprint}: ${title}`, message || "");

    const existing = await prisma.systemIssue.findUnique({ where: { fingerprint } });

    let issue;
    let shouldNotify = false;

    if (!existing) {
      issue = await prisma.systemIssue.create({
        data: {
          fingerprint,
          source,
          code,
          severity,
          title,
          message,
          recent: [occurrence],
          count: 1,
          firstSeenAt: now,
          lastSeenAt: now,
        },
      });
      shouldNotify = severity === "error";
    } else {
      const reopened = existing.resolved;
      const lastNotified = existing.lastNotifiedAt?.getTime() || 0;
      shouldNotify =
        severity === "error" && (reopened || now.getTime() - lastNotified > NOTIFY_EVERY_MS);
      issue = await prisma.systemIssue.update({
        where: { id: existing.id },
        data: {
          severity,
          title,
          message,
          recent: [occurrence, ...(existing.recent || [])].slice(0, MAX_RECENT),
          count: { increment: 1 },
          lastSeenAt: now,
          ...(reopened ? { resolved: false, resolvedAt: null, resolvedBy: null } : {}),
        },
      });
    }

    if (shouldNotify) {
      try {
        await sendAlertEmail(issue, context);
        await prisma.systemIssue.update({
          where: { id: issue.id },
          data: { lastNotifiedAt: new Date() },
        });
      } catch (mailError) {
        // If email itself is broken the issue is still visible in the admin panel.
        console.error("System issue alert email failed:", mailError?.message || mailError);
      }
    }
  } catch (reportError) {
    console.error("reportIssue failed:", reportError?.message || reportError);
  }
}
