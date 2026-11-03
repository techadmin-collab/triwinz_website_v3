import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import { getStage, OBJECT_ID_RE } from "../../../../../lib/interviews";
import { clientOutdated, badRequest, roundsFor } from "../_server";

export async function GET(_req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { applicationId } = await params;
  if (!OBJECT_ID_RE.test(applicationId)) return badRequest("Not found", 404);

  const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
  if (!application) return badRequest("Not found", 404);

  const [rounds, interviewers] = await Promise.all([
    roundsFor(applicationId),
    prisma.interviewer.findMany({ orderBy: [{ active: "desc" }, { name: "asc" }] }),
  ]);

  return NextResponse.json({
    application,
    rounds,
    interviewers,
    stage: getStage(application, rounds),
  });
}
