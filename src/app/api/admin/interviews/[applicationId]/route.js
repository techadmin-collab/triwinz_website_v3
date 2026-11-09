import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { getStage, OBJECT_ID_RE } from "../../../../../lib/interviews";
import { clientOutdated, badRequest, roundsFor } from "../_server";
import { serializeChecklistItem } from "../../../../../lib/interviewChecklist";

export async function GET(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { applicationId } = await params;
  if (!OBJECT_ID_RE.test(applicationId)) return badRequest("Not found", 404);

  const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
  if (!application) return badRequest("Not found", 404);

  const [rounds, interviewers, feedback, checklist, notes] = await Promise.all([
    roundsFor(applicationId),
    prisma.interviewer.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] }),
    prisma.interviewFeedback
      ? prisma.interviewFeedback.findMany({ where: { applicationId }, orderBy: { submittedAt: "asc" } })
      : Promise.resolve([]),
    prisma.interviewChecklistItem
      ? prisma.interviewChecklistItem.findMany({ where: { applicationId }, orderBy: { createdAt: "asc" } })
      : Promise.resolve([]),
    prisma.interviewNote
      ? prisma.interviewNote.findMany({ where: { applicationId }, orderBy: { createdAt: "asc" } })
      : Promise.resolve([]),
  ]);
  const notesByRound = new Map();
  notes.forEach((n) => {
    if (!notesByRound.has(n.roundId)) notesByRound.set(n.roundId, []);
    notesByRound.get(n.roundId).push(n);
  });
  const checklistByRound = new Map();
  checklist.forEach((item) => {
    if (!checklistByRound.has(item.roundId)) checklistByRound.set(item.roundId, []);
    checklistByRound.get(item.roundId).push(serializeChecklistItem(item));
  });
  const feedbackByRound = new Map();
  feedback.forEach((f) => {
    if (!feedbackByRound.has(f.roundId)) feedbackByRound.set(f.roundId, []);
    feedbackByRound.get(f.roundId).push(f);
  });

  return NextResponse.json({
    application,
    rounds: rounds.map((r) => ({
      ...r,
      panelFeedback: feedbackByRound.get(r.id) || [],
      checklist: checklistByRound.get(r.id) || [],
      interviewNotes: notesByRound.get(r.id) || [],
    })),
    interviewers,
    stage: getStage(application, rounds),
  });
}
