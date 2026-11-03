import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";

// Save a new display order: body = { ids: [id1, id2, ...] } (first = shown first)
export async function PUT(req) {
  const { error } = await requireModule("team");
  if (error) return error;

  const { ids } = await req.json();
  if (!Array.isArray(ids) || ids.some((id) => typeof id !== "string")) {
    return NextResponse.json({ error: "Invalid order" }, { status: 400 });
  }

  try {
    await prisma.$transaction(
      ids.map((id, index) =>
        prisma.teamMember.update({ where: { id }, data: { order: index } }),
      ),
    );
    revalidatePath("/about");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Reorder failed" }, { status: 400 });
  }
}
