import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { deleteImage } from "../../../../../lib/cloudinary";
import { toTeamMemberData } from "../shared";

export async function GET(_req, { params }) {
  const { error } = await requireModule("team");
  if (error) return error;

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });
  if (!member) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PUT(req, { params }) {
  const { error } = await requireModule("team");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  // Quick visibility toggle from the list: { published } only
  const onlyPublished =
    Object.keys(body).length === 1 && "published" in body;

  try {
    const existing = await prisma.teamMember.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let data;
    if (onlyPublished) {
      data = { published: Boolean(body.published) };
    } else {
      data = toTeamMemberData(body);
      if (!data.name || !data.role) {
        return NextResponse.json(
          { error: "Name and role are required" },
          { status: 400 },
        );
      }
    }

    const member = await prisma.teamMember.update({ where: { id }, data });

    // Photo was replaced or removed: clean up the old Cloudinary image
    if (
      !onlyPublished &&
      existing.photoPublicId &&
      existing.photoPublicId !== member.photoPublicId
    ) {
      deleteImage(existing.photoPublicId).catch(() => {});
    }

    revalidatePath("/about");
    return NextResponse.json(member);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("team");
  if (error) return error;

  const { id } = await params;
  try {
    const member = await prisma.teamMember.delete({ where: { id } });
    if (member.photoPublicId) {
      deleteImage(member.photoPublicId).catch(() => {});
    }
    revalidatePath("/about");
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
