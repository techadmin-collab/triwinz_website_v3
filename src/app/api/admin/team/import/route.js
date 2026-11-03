import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { DEFAULT_TEAM } from "../../../../../lib/teamDefaults";

// One-time import of the team that used to be hard-coded on the About page.
// Only runs while the team list is empty, so it can never create duplicates.
export async function POST() {
  const { error } = await requireModule("team");
  if (error) return error;

  const existing = await prisma.teamMember.count();
  if (existing > 0) {
    return NextResponse.json(
      { error: "The team list already has members." },
      { status: 409 },
    );
  }

  await prisma.teamMember.createMany({
    data: DEFAULT_TEAM.map((member, index) => ({
      name: member.name,
      role: member.role,
      bio: member.bio,
      photoUrl: member.photoUrl || null,
      linkedin: member.linkedin || null,
      order: index,
      published: true,
    })),
  });

  revalidatePath("/about");
  return NextResponse.json({ imported: DEFAULT_TEAM.length });
}
