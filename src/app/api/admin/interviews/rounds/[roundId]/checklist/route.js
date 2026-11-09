import { NextResponse } from "next/server";
import { prisma } from "../../../../../../../lib/prisma";
import { requireModule } from "../../../../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../../../../lib/interviews";
import { addChecklistItem, checklistFor, serializeChecklistItem } from "../../../../../../../lib/interviewChecklist";
import { badRequest } from "../../../_server";

function outdated() {
  return prisma.interviewChecklistItem
    ? null
    : badRequest('The database client is out of date. Run "npx prisma generate" and restart the dev server.', 503);
}

async function findRound(roundId) {
  if (!OBJECT_ID_RE.test(roundId)) return null;
  return prisma.interviewRound.findUnique({ where: { id: roundId } });
}

export async function GET(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  if (outdated()) return outdated();
  const { roundId } = await params;
  const round = await findRound(roundId);
  if (!round) return badRequest("Not found", 404);
  return NextResponse.json({ items: await checklistFor(round.id) });
}

// POST { text }
export async function POST(req, { params }) {
  const { error, session } = await requireModule("interviews");
  if (error) return error;
  if (outdated()) return outdated();
  const { roundId } = await params;
  const round = await findRound(roundId);
  if (!round) return badRequest("Not found", 404);
  const body = await req.json().catch(() => ({}));
  const result = await addChecklistItem(round, {
    text: body.text,
    addedBy: "admin",
    addedByName: session?.user?.name || "TriWinz team",
  });
  if (result.error) return badRequest(result.error);
  return NextResponse.json({ item: serializeChecklistItem(result.item) }, { status: 201 });
}
