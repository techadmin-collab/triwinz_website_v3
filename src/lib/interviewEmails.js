// Emails sent when an interview level is scheduled (or its details are updated).
// Candidate: one email, cc'd to the HR inbox. Each panel member: one email, cc'd to the HR inbox.
import { prisma } from "./prisma";
import { sendMail } from "./mail";
import { formatIST, levelLabel, modeLabel } from "./interviews";
import { newPortalToken, portalUrl } from "./interviewerPortal";
import {
  interviewScheduledCandidateTemplate,
  interviewScheduledPanelTemplate,
} from "./emailTemplates";
import { reportIssue } from "./reportIssue";

const INTERVIEW_MINUTES = 60;

// Copied on every interview email (candidate and panel).
// Override with INTERVIEW_CC_EMAIL (comma-separated) in .env / Vercel.
const DEFAULT_CC = [
  "parvathys@triwinz.com",
  "parameswaran@triwinz.com",
  "rajkiran@triwinz.com",
  "abdul.samad@triwinz.net",
];

function ccAddress() {
  const fromEnv = (process.env.INTERVIEW_CC_EMAIL || "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);
  return fromEnv.length ? fromEnv : DEFAULT_CC;
}

function icsDate(date) {
  return date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function icsEscape(text) {
  return String(text || "").replace(/\\/g, "\\\\").replace(/;/g, "\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");
}

/** Calendar file so both sides can add the interview with one click */
function calendarInvite({ round, title, description, location }) {
  const start = new Date(round.scheduledAt);
  const end = new Date(start.getTime() + INTERVIEW_MINUTES * 60 * 1000);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//TriWinz//Interviews//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:interview-${round.id}@triwinz.com`,
    `SEQUENCE:${Math.floor(Date.now() / 1000)}`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(start)}`,
    `DTEND:${icsDate(end)}`,
    `SUMMARY:${icsEscape(title)}`,
    `DESCRIPTION:${icsEscape(description)}`,
    location ? `LOCATION:${icsEscape(location)}` : null,
    "END:VEVENT",
    "END:VCALENDAR",
  ]
    .filter(Boolean)
    .join("\r\n");
  return { filename: "interview.ics", content: ics, contentType: "text/calendar; charset=utf-8; method=PUBLISH" };
}

/** Make sure an active panel member has a private panel link (so the email can include it) */
async function ensurePanelLink(interviewer) {
  if (!interviewer.active) return null;
  if (interviewer.portalToken) return portalUrl(interviewer.portalToken);
  const updated = await prisma.interviewer.update({
    where: { id: interviewer.id },
    data: { portalToken: newPortalToken(), portalCreatedAt: new Date() },
  });
  return portalUrl(updated.portalToken);
}

/**
 * Send the interview emails. Never throws.
 * @returns {{ candidate: "sent"|"failed"|"no_email", panel: {name, status}[] , skipped?: string }}
 */
export async function sendInterviewEmails({ round, application, isUpdate = false }) {
  if (!round.scheduledAt) return { skipped: "no_time", candidate: null, panel: [] };

  const levelText = levelLabel(round);
  const whenText = formatIST(round.scheduledAt);
  const modeText = round.mode ? modeLabel(round.mode) : "";
  const isLink = (v) => /^https?:\/\//i.test(String(v || ""));
  const meetingLink = round.mode === "hybrid" ? round.meetingLink : isLink(round.location) ? round.location : null;
  const location = round.mode === "hybrid" ? round.location : isLink(round.location) ? null : round.location;
  const base = { jobTitle: application.jobTitle, levelText, whenText, modeText, meetingLink, location, isUpdate };
  const calLocation = [meetingLink, location].filter(Boolean).join(" / ");

  const summary = { candidate: null, panel: [] };

  // Candidate
  if (application.email) {
    try {
      const mail = interviewScheduledCandidateTemplate({ fullName: application.fullName, ...base });
      await sendMail({
        to: application.email,
        cc: ccAddress(),
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: [
          calendarInvite({
            round,
            title: `Interview with TriWinz · ${application.jobTitle}`,
            description: `${levelText}\n${meetingLink ? `Join: ${meetingLink}\n` : ""}${location ? `Location: ${location}` : ""}`,
            location: calLocation,
          }),
        ],
      });
      summary.candidate = "sent";
    } catch (error) {
      summary.candidate = "failed";
      console.error("Interview email to candidate failed:", error);
      await reportIssue({
        source: "interview",
        code: "schedule_email_failed",
        title: "An interview invitation email could not be sent.",
        error,
        context: { applicantName: application.fullName, applicantEmail: application.email, jobTitle: application.jobTitle },
      });
    }
  } else {
    summary.candidate = "no_email";
  }

  // Panel members (cc HR)
  const interviewers = await prisma.interviewer.findMany({ where: { id: { in: round.interviewerIds } } });
  const panelNames = round.interviewerNames.filter(Boolean);
  for (const iv of interviewers) {
    if (!iv.email) {
      summary.panel.push({ name: iv.name, status: "no_email" });
      continue;
    }
    try {
      const panelUrl = await ensurePanelLink(iv);
      const mail = interviewScheduledPanelTemplate({
        name: iv.name,
        candidateName: application.fullName,
        panelNames,
        notes: round.notes,
        panelUrl,
        ...base,
      });
      await sendMail({
        to: iv.email,
        cc: ccAddress(),
        subject: mail.subject,
        text: mail.text,
        html: mail.html,
        attachments: [
          calendarInvite({
            round,
            title: `Interview: ${application.fullName} · ${application.jobTitle}`,
            description: `${levelText}\n${meetingLink ? `Join: ${meetingLink}\n` : ""}${location ? `Location: ${location}\n` : ""}${panelUrl ? `Panel page: ${panelUrl}` : ""}`,
            location: calLocation,
          }),
        ],
      });
      summary.panel.push({ name: iv.name, status: "sent" });
    } catch (error) {
      summary.panel.push({ name: iv.name, status: "failed" });
      console.error(`Interview email to ${iv.name} failed:`, error);
      await reportIssue({
        source: "interview",
        code: "schedule_email_failed",
        title: "An interview invitation email could not be sent.",
        error,
        context: { panelMember: iv.name, jobTitle: application.jobTitle, candidate: application.fullName },
      });
    }
  }

  return summary;
}
