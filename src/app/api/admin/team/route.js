import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import { toTeamMemberData } from "./shared";

// List all team members (visible + hidden), in display order
// prisma.teamMember only exists after `npx prisma generate` has run with the new schema
function clientOutdated() {
  return NextResponse.json(
    { error: 'The database client is out of date. Run "npx prisma generate" and restart the dev server.' },
    { status: 503 },
  );
}

export async function GET() {
  const { error } = await requireModule("team");
  if (error) return error;
  if (!prisma.teamMember) return clientOutdated();

  const members = await prisma.teamMember.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json(members);
}

// Create a member; it goes to the end of the list
export async function POST(req) {
  const { error } = await requireModule("team");
  if (error) return error;

  if (!prisma.teamMember) return clientOutdated();

  const body = await req.json();
  const data = toTeamMemberData(body);
  if (!data.name || !data.role) {
    return NextResponse.json(
      { error: "Name and role are required" },
      { status: 400 },
    );
  }

  const last = await prisma.teamMember.findFirst({
    orderBy: { order: "desc" },
    select: { order: true },
  });

  const member = await prisma.teamMember.create({
    data: { ...data, order: (last?.order ?? -1) + 1 },
  });
  revalidatePath("/about");
  return NextResponse.json(member, { status: 201 });
}
