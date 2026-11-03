import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { getStage, OBJECT_ID_RE } from "../../../../../lib/interviews";

// Interview stage for a set of applications: /api/admin/interviews/summary?ids=a,b,c
export async function GET(req) {
  const { error } = await requireModule("applications");
  if (error) return error;
  if (!prisma.interviewRound) return NextResponse.json({});

  const ids = (new URL(req.url).searchParams.get("ids") || "")
    .split(",")
    .filter((id) => OBJECT_ID_RE.test(id))
    .slice(0, 200);
  if (ids.length === 0) return NextResponse.json({});

  const [apps, rounds] = await Promise.all([
    prisma.jobApplication.findMany({ where: { id: { in: ids } }, select: { id: true, status: true } }),
    prisma.interviewRound.findMany({ where: { applicationId: { in: ids } }, orderBy: { level: "asc" } }),
  ]);
  const result = {};
  apps.forEach((app) => {
    result[app.id] = getStage(app, rounds.filter((r) => r.applicationId === app.id));
  });
  return NextResponse.json(result);
}
