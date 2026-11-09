import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../../lib/prisma";
import { OBJECT_ID_RE } from "../../../../../../../../lib/interviews";
import { cleanChecklistText, doneData, serializeChecklistItem } from "../../../../../../../../lib/interviewChecklist";
import { isLocked, loadPanelRound } from "../_shared";

async function load(params) {
  const ctx = await loadPanelRound(params);
  if (ctx.error) return ctx;
  const { itemId } = await params;
  const item = OBJECT_ID_RE.test(itemId)
    ? await prisma.interviewChecklistItem.findUnique({ where: { id: itemId } })
    : null;
  if (!item || item.roundId !== ctx.round.id) {
    return { error: NextResponse.json({ error: "Checklist item not found" }, { status: 404 }) };
  }
  if (isLocked(ctx.round)) {
    return { error: NextResponse.json({ error: "This interview is closed, so the checklist can't be changed." }, { status: 409 }) };
  }
  return { ...ctx, item };
}

// PATCH { done?, text? } — anyone on the panel can tick; only the person who added it can reword it
export async function PATCH(req, { params }) {
  const { interviewer, item, error } = await load(params);
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  const data = {};
  if ("done" in body) Object.assign(data, doneData(Boolean(body.done), interviewer.name));
  if ("text" in body) {
    if (item.interviewerId !== interviewer.id) {
      return NextResponse.json({ error: "You can only edit items you added" }, { status: 403 });
    }
    const text = cleanChecklistText(body.text);
    if (!text) return NextResponse.json({ error: "Text can't be empty" }, { status: 400 });
    data.text = text;
  }
  const updated = await prisma.interviewChecklistItem.update({ where: { id: item.id }, data });
  return NextResponse.json({ item: serializeChecklistItem(updated, interviewer.id) });
}

// Panel members can only remove items they added
export async function DELETE(_req, { params }) {
  const { interviewer, item, error } = await load(params);
  if (error) return error;
  if (item.interviewerId !== interviewer.id) {
    return NextResponse.json({ error: "You can only remove items you added" }, { status: 403 });
  }
  await prisma.interviewChecklistItem.delete({ where: { id: item.id } });
  return NextResponse.json({ ok: true });
}
