import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { interviewerForToken } from "../../../../lib/interviewerPortal";
import {
  MAX_DAYS_AHEAD,
  addDays,
  isValidDateKey,
  normalizeRanges,
  todayKey,
} from "../../../../lib/availability";

// Public API behind the interview panel's private link. No login: the link itself is the key.

function notFound() {
  return NextResponse.json(
    { error: "This link is no longer valid. Please ask the TriWinz team for a new one." },
    { status: 404 },
  );
}

async function upcomingSlots(interviewerId, today) {
  const slots = await prisma.interviewerSlot.findMany({
    where: { interviewerId, date: { gte: today } },
    orderBy: [{ date: "asc" }, { startMin: "asc" }],
    select: { date: true, startMin: true, endMin: true },
  });
  return slots;
}

export async function GET(_req, { params }) {
  const { token } = await params;
  const interviewer = await interviewerForToken(token);
  if (!interviewer) return notFound();

  const today = todayKey();
  // Remember when they last opened the link (at most every 10 minutes)
  const seen = interviewer.portalSeenAt?.getTime() || 0;
  if (Date.now() - seen > 10 * 60 * 1000) {
    await prisma.interviewer
      .update({ where: { id: interviewer.id }, data: { portalSeenAt: new Date() } })
      .catch(() => {});
  }

  return NextResponse.json(
    {
      interviewer: {
        name: interviewer.name,
        designation: interviewer.designation,
        company: interviewer.company,
      },
      today,
      maxDate: addDays(today, MAX_DAYS_AHEAD),
      slots: await upcomingSlots(interviewer.id, today),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

// PUT { date: "YYYY-MM-DD", ranges: [{ start: "HH:MM", end: "HH:MM" }] }
// Replaces that day's availability (an empty list clears the day).
export async function PUT(req, { params }) {
  const { token } = await params;
  const interviewer = await interviewerForToken(token);
  if (!interviewer) return notFound();

  const body = await req.json().catch(() => ({}));
  const today = todayKey();
  const date = body.date;
  if (!isValidDateKey(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  if (date < today) {
    return NextResponse.json({ error: "You can't change availability for past days" }, { status: 400 });
  }
  if (date > addDays(today, MAX_DAYS_AHEAD)) {
    return NextResponse.json(
      { error: `You can add availability up to ${MAX_DAYS_AHEAD} days ahead` },
      { status: 400 },
    );
  }

  const result = normalizeRanges(body.ranges || []);
  if (result.error) return NextResponse.json({ error: result.error }, { status: 400 });

  await prisma.interviewerSlot.deleteMany({ where: { interviewerId: interviewer.id, date } });
  if (result.ranges.length) {
    await prisma.interviewerSlot.createMany({
      data: result.ranges.map((r) => ({
        interviewerId: interviewer.id,
        date,
        startMin: r.startMin,
        endMin: r.endMin,
      })),
    });
  }

  return NextResponse.json({ ok: true, slots: await upcomingSlots(interviewer.id, today) });
}
