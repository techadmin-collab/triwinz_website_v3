import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../../lib/prisma";
import { requireModule } from "../../../../../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../../../../../lib/interviews";
import { cleanChecklistText, doneData, serializeChecklistItem } from "../../../../../../../../lib/interviewChecklist";
import { badRequest } from "../../../../_server";

async function findItem(roundId, itemId) {
  if (!prisma.interviewChecklistItem || !OBJECT_ID_RE.test(itemId)) return null;
  const item = await prisma.interviewChecklistItem.findUnique({ where: { id: itemId } });
  return item && item.roundId === roundId ? item : null;
}

// PATCH { done?, text? } — the admin team can change any item
export async function PATCH(req, { params }) {
  const { error, session } = await requireModule("interviews");
  if (error) return error;
  const { roundId, itemId } = await params;
  const item = await findItem(roundId, itemId);
  if (!item) return badRequest("Not found", 404);
  const body = await req.json().catch(() => ({}));
  const data = {};
  if ("done" in body) Object.assign(data, doneData(Boolean(body.done), session?.user?.name || "TriWinz team"));
  if ("text" in body) {
    const text = cleanChecklistText(body.text);
    if (!text) return badRequest("Text can't be empty");
    data.text = text;
  }
  const updated = await prisma.interviewChecklistItem.update({ where: { id: item.id }, data });
  return NextResponse.json({ item: serializeChecklistItem(updated) });
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const { roundId, itemId } = await params;
  const item = await findItem(roundId, itemId);
  if (!item) return badRequest("Not found", 404);
  await prisma.interviewChecklistItem.delete({ where: { id: item.id } });
  return NextResponse.json({ ok: true });
}
