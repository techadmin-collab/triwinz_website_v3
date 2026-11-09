// Shared by the panel checklist routes (route files may only export HTTP handlers)
import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/prisma";
import { requirePanel } from "../../../../../../../lib/interviewerPortal";
import { OBJECT_ID_RE } from "../../../../../../../lib/interviews";

export async function loadPanelRound(params) {
  const auth = await requirePanel(params);
  if (auth.error) return auth;
  if (!prisma.interviewChecklistItem) {
    return { error: NextResponse.json({ error: "This page is being updated. Please try again shortly." }, { status: 503 }) };
  }
  const { roundId } = await params;
  const round = OBJECT_ID_RE.test(roundId) ? await prisma.interviewRound.findUnique({ where: { id: roundId } }) : null;
  if (!round || !round.interviewerIds.includes(auth.interviewer.id)) {
    return { error: NextResponse.json({ error: "Interview not found" }, { status: 404 }) };
  }
  return { interviewer: auth.interviewer, round };
}

export function isLocked(round) {
  return !["scheduled", "on_hold"].includes(round.status);
}

