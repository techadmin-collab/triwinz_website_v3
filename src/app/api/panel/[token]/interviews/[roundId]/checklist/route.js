import { NextResponse } from "next/server";
import { addChecklistItem, checklistFor, serializeChecklistItem } from "../../../../../../../lib/interviewChecklist";
import { isLocked, loadPanelRound } from "./_shared";

// Checklist for one interview level, as seen by a panel member on that level.

export async function GET(_req, { params }) {
  const { interviewer, round, error } = await loadPanelRound(params);
  if (error) return error;
  return NextResponse.json({ items: await checklistFor(round.id, interviewer.id), locked: isLocked(round) });
}

// POST { text }
export async function POST(req, { params }) {
  const { interviewer, round, error } = await loadPanelRound(params);
  if (error) return error;
  if (isLocked(round)) {
    return NextResponse.json({ error: "This interview is closed, so the checklist can't be changed." }, { status: 409 });
  }
  const body = await req.json().catch(() => ({}));
  const result = await addChecklistItem(round, {
    text: body.text,
    addedBy: "panel",
    addedByName: interviewer.name,
    interviewerId: interviewer.id,
  });
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json({ item: serializeChecklistItem(result.item, interviewer.id) }, { status: 201 });
}
