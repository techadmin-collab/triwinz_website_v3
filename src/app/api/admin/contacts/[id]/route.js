import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";

export async function PATCH(req, { params }) {
  const { error } = await requireModule("contacts");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  const data = {};
  if (body.status) data.status = String(body.status);

  try {
    const item = await prisma.contactMessage.update({
      where: { id },
      data,
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("contacts");
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.contactMessage.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
