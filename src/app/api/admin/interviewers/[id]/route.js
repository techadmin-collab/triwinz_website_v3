import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { clientOutdated, str, badRequest } from "../../interviews/_server";

export async function PUT(req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { id } = await params;
  const body = await req.json();
  const data = {};
  if ("name" in body) {
    const name = str(body.name);
    if (!name) return badRequest("Name is required");
    data.name = name;
  }
  for (const key of ["email", "phone", "company", "designation", "notes"]) {
    if (key in body) data[key] = str(body[key]);
  }
  if ("active" in body) data.active = Boolean(body.active);
  // an inactive panel member's availability link stops working (see interviewerForToken)

  try {
    const interviewer = await prisma.interviewer.update({ where: { id }, data });
    // keep the names on upcoming/active levels in sync with a renamed interviewer
    if (data.name) {
      const rounds = await prisma.interviewRound.findMany({
        where: { interviewerIds: { has: id }, status: { in: ["scheduled", "on_hold"] } },
      });
      await Promise.all(
        rounds.map((r) =>
          prisma.interviewRound.update({
            where: { id: r.id },
            data: {
              interviewerNames: r.interviewerIds.map((iid, i) =>
                iid === id ? data.name : r.interviewerNames[i] || "",
              ),
            },
          }),
        ),
      );
    }
    return NextResponse.json(interviewer);
  } catch {
    return badRequest("Update failed");
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { id } = await params;
  const used = await prisma.interviewRound.count({ where: { interviewerIds: { has: id } } });
  if (used > 0) {
    return badRequest(
      "This interviewer is part of interview history. Mark them as inactive instead.",
      409,
    );
  }
  try {
    await prisma.interviewer.delete({ where: { id } });
    // their availability goes with them
    if (prisma.interviewerSlot) {
      await prisma.interviewerSlot.deleteMany({ where: { interviewerId: id } }).catch(() => {});
    }
    return NextResponse.json({ ok: true });
  } catch {
    return badRequest("Delete failed");
  }
}
