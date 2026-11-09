import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../lib/interviews";
import { badRequest } from "../interviews/_server";

const NOTE_MAX_LENGTH = 2000;

function cleanNote(value) {
  return typeof value === "string" ? value.trim().slice(0, NOTE_MAX_LENGTH) : "";
}

function outdated() {
  return prisma.interviewNote
    ? null
    : badRequest('The database client is out of date. Run "npx prisma generate" and restart the dev server.', 503);
}

// POST { roundId, text } — add a note to an interview level
export async function POST(req) {
  const { error, session } = await requireModule("interviews");
  if (error) return error;
  if (outdated()) return outdated();

  const body = await req.json().catch(() => ({}));
  if (!OBJECT_ID_RE.test(String(body.roundId || ""))) return badRequest("Interview level not found", 404);
  const round = await prisma.interviewRound.findUnique({ where: { id: body.roundId } });
  if (!round) return badRequest("Interview level not found", 404);
  const text = cleanNote(body.text);
  if (!text) return badRequest("Write a note first");
  const count = await prisma.interviewNote.count({ where: { roundId: round.id } });
  if (count >= 100) return badRequest("This level already has 100 notes");

  const note = await prisma.interviewNote.create({
    data: {
      roundId: round.id,
      applicationId: round.applicationId,
      text,
      authorName: session?.user?.name || "TriWinz team",
    },
  });
  return NextResponse.json({ note }, { status: 201 });
}
