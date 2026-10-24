import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { deleteRawFile } from "../../../../../lib/cloudinary";

const STATUSES = ["new", "contacted", "enrolled", "rejected"];

export async function PATCH(req, { params }) {
  const { error } = await requireModule("training");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  const status = String(body.status || "");
  if (!STATUSES.includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  try {
    const item = await prisma.trainingApplication.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("training");
  if (error) return error;

  const { id } = await params;
  try {
    const item = await prisma.trainingApplication.delete({ where: { id } });
    if (item.resumePublicId) {
      try {
        await deleteRawFile(item.resumePublicId);
      } catch (err) {
        console.error("Training resume delete failed:", err);
      }
    }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
