import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import { clientOutdated, str, badRequest } from "../interviews/_server";
import { portalUrl } from "../../../../lib/interviewerPortal";

export async function GET() {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const [interviewers, rounds] = await Promise.all([
    prisma.interviewer.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] }),
    prisma.interviewRound.findMany({ select: { interviewerIds: true } }),
  ]);
  const counts = new Map();
  rounds.forEach((r) => r.interviewerIds.forEach((id) => counts.set(id, (counts.get(id) || 0) + 1)));

  return NextResponse.json(
    interviewers.map((i) => ({
      ...i,
      portalUrl: i.portalToken ? portalUrl(i.portalToken) : null,
      interviewCount: counts.get(i.id) || 0,
    })),
  );
}

export async function POST(req) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const body = await req.json();
  const name = str(body.name);
  if (!name) return badRequest("Name is required");

  const interviewer = await prisma.interviewer.create({
    data: {
      name,
      email: str(body.email),
      phone: str(body.phone),
      company: str(body.company),
      designation: str(body.designation),
      notes: str(body.notes),
      active: body.active !== false,
    },
  });
  return NextResponse.json({ ...interviewer, portalUrl: null, interviewCount: 0 }, { status: 201 });
}
