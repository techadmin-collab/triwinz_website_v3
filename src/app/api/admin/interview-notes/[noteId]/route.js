import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../../lib/interviews";
import { badRequest } from "../../interviews/_server";

async function findNote(noteId) {
  if (!prisma.interviewNote || !OBJECT_ID_RE.test(noteId)) return null;
  return prisma.interviewNote.findUnique({ where: { id: noteId } });
}

// PATCH { text }
export async function PATCH(req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const { noteId } = await params;
  const note = await findNote(noteId);
  if (!note) return badRequest("Note not found", 404);
  const body = await req.json().catch(() => ({}));
  const text = typeof body.text === "string" ? body.text.trim().slice(0, 2000) : "";
  if (!text) return badRequest("A note can't be empty");
  const updated = await prisma.interviewNote.update({ where: { id: note.id }, data: { text } });
  return NextResponse.json({ note: updated });
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const { noteId } = await params;
  const note = await findNote(noteId);
  if (!note) return badRequest("Note not found", 404);
  await prisma.interviewNote.delete({ where: { id: note.id } });
  return NextResponse.json({ ok: true });
}
