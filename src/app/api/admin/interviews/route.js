import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import { getStage } from "../../../../lib/interviews";
import { clientOutdated } from "./_server";

// Everyone in the hiring process: shortlisted candidates + anyone with interview levels
export async function GET() {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const rounds = await prisma.interviewRound.findMany({ orderBy: { level: "asc" } });
  const byApp = new Map();
  rounds.forEach((r) => {
    if (!byApp.has(r.applicationId)) byApp.set(r.applicationId, []);
    byApp.get(r.applicationId).push(r);
  });

  const applications = await prisma.jobApplication.findMany({
    where: {
      OR: [
        { status: { in: ["shortlisted", "reviewed"] } },
        { id: { in: [...byApp.keys()] } },
      ],
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      phone: true,
      jobSlug: true,
      jobTitle: true,
      status: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const items = applications.map((app) => {
    const appRounds = byApp.get(app.id) || [];
    const latest = appRounds[appRounds.length - 1] || null;
    return {
      ...app,
      levels: appRounds.length,
      interviewerIds: [...new Set(appRounds.flatMap((r) => r.interviewerIds))],
      latest: latest && {
        id: latest.id,
        level: latest.level,
        title: latest.title,
        status: latest.status,
        scheduledAt: latest.scheduledAt,
        mode: latest.mode,
        interviewerNames: latest.interviewerNames,
      },
      stage: getStage(app, appRounds),
    };
  });

  return NextResponse.json({ items });
}
