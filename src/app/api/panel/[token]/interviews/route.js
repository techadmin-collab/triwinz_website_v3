import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requirePanel } from "../../../../../lib/interviewerPortal";

// GET -> every interview level this panel member is assigned to
export async function GET(_req, { params }) {
  const { interviewer, error } = await requirePanel(params);
  if (error) return error;

  const rounds = await prisma.interviewRound.findMany({
    where: { interviewerIds: { has: interviewer.id } },
    orderBy: [{ scheduledAt: "desc" }, { createdAt: "desc" }],
  });
  const appIds = [...new Set(rounds.map((r) => r.applicationId))];
  const [applications, feedback] = await Promise.all([
    prisma.jobApplication.findMany({
      where: { id: { in: appIds } },
      select: { id: true, fullName: true, jobTitle: true },
    }),
    prisma.interviewFeedback.findMany({
      where: { interviewerId: interviewer.id, roundId: { in: rounds.map((r) => r.id) } },
      select: { roundId: true, rating: true, recommendation: true, updatedAt: true },
    }),
  ]);
  const apps = new Map(applications.map((a) => [a.id, a]));
  const mine = new Map(feedback.map((f) => [f.roundId, f]));

  return NextResponse.json(
    {
      now: new Date().toISOString(),
      interviews: rounds
        .filter((r) => apps.has(r.applicationId))
        .map((r) => ({
          id: r.id,
          level: r.level,
          title: r.title,
          status: r.status,
          scheduledAt: r.scheduledAt,
          mode: r.mode,
          candidateName: apps.get(r.applicationId).fullName,
          jobTitle: apps.get(r.applicationId).jobTitle,
          myFeedback: mine.get(r.id) || null,
        })),
    },
    { headers: { "cache-control": "no-store" } },
  );
}
