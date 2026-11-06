import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../../lib/interviews";
import { addDays, isValidDateKey, todayKey, weekStart } from "../../../../../lib/availability";
import { badRequest } from "../../interviews/_server";

// GET /api/admin/interviewers/availability?from=YYYY-MM-DD&to=YYYY-MM-DD&interviewerId=...
export async function GET(req) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  if (!prisma.interviewerSlot) {
    return badRequest(
      'The database client is out of date. Run "npx prisma generate" and restart the dev server.',
      503,
    );
  }

  const { searchParams } = new URL(req.url);
  const from = isValidDateKey(searchParams.get("from")) ? searchParams.get("from") : weekStart(todayKey());
  let to = isValidDateKey(searchParams.get("to")) ? searchParams.get("to") : addDays(from, 6);
  if (to < from) to = from;
  if (to > addDays(from, 62)) to = addDays(from, 62);
  const interviewerId = searchParams.get("interviewerId");

  const where = { date: { gte: from, lte: to } };
  if (interviewerId && OBJECT_ID_RE.test(interviewerId)) where.interviewerId = interviewerId;

  const [slots, interviewers] = await Promise.all([
    prisma.interviewerSlot.findMany({ where, orderBy: [{ date: "asc" }, { startMin: "asc" }] }),
    prisma.interviewer.findMany({
      orderBy: [{ active: "desc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        designation: true,
        company: true,
        active: true,
        portalToken: true,
        portalSentAt: true,
        portalSeenAt: true,
      },
    }),
  ]);

  const names = new Map(interviewers.map((i) => [i.id, i.name]));
  return NextResponse.json({
    from,
    to,
    today: todayKey(),
    slots: slots.map((s) => ({
      id: s.id,
      interviewerId: s.interviewerId,
      interviewerName: names.get(s.interviewerId) || "Removed panel member",
      date: s.date,
      startMin: s.startMin,
      endMin: s.endMin,
    })),
    interviewers: interviewers.map(({ portalToken, ...i }) => ({ ...i, hasLink: Boolean(portalToken) })),
  });
}
