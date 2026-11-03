import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireModule } from "../../../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../../../lib/interviews";
import { clientOutdated, badRequest, roundsFor } from "../../_server";

// Final step: candidate passed the last level -> application becomes "selected".
// Body: { hiringTerms } (may be empty). If already hired, only the terms are updated.
export async function POST(req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { applicationId } = await params;
  if (!OBJECT_ID_RE.test(applicationId)) return badRequest("Not found", 404);

  const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
  if (!application) return badRequest("Not found", 404);

  const body = await req.json().catch(() => ({}));
  const hiringTerms =
    typeof body.hiringTerms === "string" && body.hiringTerms.trim()
      ? body.hiringTerms.trim()
      : null;

  if (application.status === "selected") {
    const updated = await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { hiringTerms },
    });
    return NextResponse.json(updated);
  }

  const rounds = await roundsFor(applicationId);
  const latest = rounds[rounds.length - 1];
  if (!latest || latest.status !== "passed") {
    return badRequest("The latest level must be passed before hiring.");
  }

  const updated = await prisma.jobApplication.update({
    where: { id: applicationId },
    data: { status: "selected", hiringTerms, hiredAt: new Date() },
  });
  return NextResponse.json(updated);
}
