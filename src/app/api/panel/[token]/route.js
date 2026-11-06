import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requirePanel } from "../../../../lib/interviewerPortal";
import { FEEDBACK_OPEN_STATUSES } from "../../../../lib/interviews";
import { todayKey } from "../../../../lib/availability";

// Public API behind the interview panel's private link. No login: the link itself is the key.
// GET -> who they are + numbers for the sidebar and overview
export async function GET(_req, { params }) {
  const { interviewer, error } = await requirePanel(params);
  if (error) return error;

  // Remember when they last opened the link (at most every 10 minutes)
  const seen = interviewer.portalSeenAt?.getTime() || 0;
  if (Date.now() - seen > 10 * 60 * 1000) {
    await prisma.interviewer
      .update({ where: { id: interviewer.id }, data: { portalSeenAt: new Date() } })
      .catch(() => {});
  }

  const now = new Date();
  const today = todayKey();
  const [rounds, myFeedback, availableDays] = await Promise.all([
    prisma.interviewRound.findMany({
      where: { interviewerIds: { has: interviewer.id }, status: { not: "cancelled" } },
      select: { id: true, status: true, scheduledAt: true },
    }),
    prisma.interviewFeedback.findMany({
      where: { interviewerId: interviewer.id },
      select: { roundId: true },
    }),
    prisma.interviewerSlot.findMany({
      where: { interviewerId: interviewer.id, date: { gte: today } },
      distinct: ["date"],
      select: { date: true },
    }),
  ]);
  const done = new Set(myFeedback.map((f) => f.roundId));

  return NextResponse.json(
    {
      interviewer: {
        name: interviewer.name,
        designation: interviewer.designation,
        company: interviewer.company,
        email: interviewer.email,
      },
      today,
      counts: {
        upcoming: rounds.filter((r) => r.status === "scheduled" && (!r.scheduledAt || r.scheduledAt >= now)).length,
        needsFeedback: rounds.filter(
          (r) =>
            FEEDBACK_OPEN_STATUSES.includes(r.status) &&
            r.scheduledAt &&
            r.scheduledAt <= now &&
            !done.has(r.id),
        ).length,
        feedbackGiven: done.size,
        availableDays: availableDays.length,
      },
    },
    { headers: { "cache-control": "no-store" } },
  );
}
