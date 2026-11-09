import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireModule } from "../../../../../../lib/requireAdmin";
import { OBJECT_ID_RE, ROUND_STATUSES } from "../../../../../../lib/interviews";
import { sendApplicationRejectedEmail } from "../../../../../../lib/sendApplicationEmails";
import {
  clientOutdated,
  badRequest,
  resolveInterviewers,
  parseRoundDetails,
  roundsFor,
  str,
} from "../../_server";

const STATUS_VALUES = ROUND_STATUSES.map((s) => s.value);

// Edit a level's details and/or record its result
export async function PUT(req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { roundId } = await params;
  if (!OBJECT_ID_RE.test(roundId)) return badRequest("Not found", 404);
  const round = await prisma.interviewRound.findUnique({ where: { id: roundId } });
  if (!round) return badRequest("Not found", 404);
  const application = await prisma.jobApplication.findUnique({ where: { id: round.applicationId } });
  if (!application) return badRequest("Application not found", 404);

  const body = await req.json();
  const details = parseRoundDetails(body);
  if (details.error) return badRequest(details.error);
  const data = { ...details.data };

  if ("interviewerIds" in body) {
    const people = await resolveInterviewers(body.interviewerIds);
    if (people.error) return badRequest(people.error);
    data.interviewerIds = people.ids;
    data.interviewerNames = people.names;
  }

  const statusChanging = "status" in body && body.status !== round.status;
  if ("status" in body) {
    if (!STATUS_VALUES.includes(body.status)) return badRequest("Invalid result");
    if (statusChanging) {
      const rounds = await roundsFor(round.applicationId);
      const latest = rounds[rounds.length - 1];
      if (latest && latest.id !== round.id) {
        return badRequest("Only the latest level's result can be changed. Delete the later levels first.");
      }
      data.status = body.status;
      data.decidedAt = ["passed", "rejected", "on_hold"].includes(body.status) ? new Date() : null;
    }
  }
  if ("feedback" in body) data.feedback = str(body.feedback);
  if ("rating" in body) {
    const r = Number(body.rating);
    data.rating = Number.isInteger(r) && r >= 1 && r <= 5 ? r : null;
  }

  const updated = await prisma.interviewRound.update({ where: { id: roundId }, data });

  // Keep the application's main status in sync with the result
  let appStatus = application.status;
  if (statusChanging) {
    if (body.status === "rejected") {
      appStatus = "rejected";
    } else if (application.status === "rejected" || application.status === "selected") {
      // result changed after a rejection / hire: back into the process
      appStatus = "shortlisted";
    }
  }
  if (appStatus !== application.status) {
    await prisma.jobApplication.update({
      where: { id: application.id },
      data: { status: appStatus },
    });
    if (appStatus === "rejected" && body.sendRejectionEmail === true) {
      try {
        await sendApplicationRejectedEmail({
          fullName: application.fullName,
          email: application.email,
          jobTitle: application.jobTitle,
        });
      } catch (err) {
        console.error("Rejection email failed:", err);
      }
    }
  }

  return NextResponse.json({ round: updated, applicationStatus: appStatus });
}

// Remove a level (only the latest one, so levels stay in order)
export async function DELETE(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { roundId } = await params;
  if (!OBJECT_ID_RE.test(roundId)) return badRequest("Not found", 404);
  const round = await prisma.interviewRound.findUnique({ where: { id: roundId } });
  if (!round) return badRequest("Not found", 404);

  const rounds = await roundsFor(round.applicationId);
  const latest = rounds[rounds.length - 1];
  if (latest.id !== round.id) {
    return badRequest("Only the latest level can be removed.");
  }

  await prisma.interviewRound.delete({ where: { id: roundId } });
  if (prisma.interviewFeedback) {
    await prisma.interviewFeedback.deleteMany({ where: { roundId } }).catch(() => {});
  }
  if (prisma.interviewChecklistItem) {
    await prisma.interviewChecklistItem.deleteMany({ where: { roundId } }).catch(() => {});
  }
  if (prisma.interviewNote) {
    await prisma.interviewNote.deleteMany({ where: { roundId } }).catch(() => {});
  }

  // Undo the effect of a rejection / hire that came from this level
  const application = await prisma.jobApplication.findUnique({ where: { id: round.applicationId } });
  if (application && (application.status === "rejected" || application.status === "selected")) {
    await prisma.jobApplication.update({
      where: { id: application.id },
      data: { status: "shortlisted" },
    });
  }
  return NextResponse.json({ ok: true });
}
