import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requireModule } from "../../../../../../lib/requireAdmin";
import { OBJECT_ID_RE } from "../../../../../../lib/interviews";
import {
  clientOutdated,
  badRequest,
  resolveInterviewers,
  parseRoundDetails,
  roundsFor,
} from "../../_server";

// Add the next level (Level 1, or the next one after a passed level)
export async function POST(req, { params }) {
  const { error } = await requireModule("interviews");
  if (error) return error;
  const outdated = clientOutdated();
  if (outdated) return outdated;

  const { applicationId } = await params;
  if (!OBJECT_ID_RE.test(applicationId)) return badRequest("Not found", 404);

  const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
  if (!application) return badRequest("Not found", 404);
  if (application.status === "selected") return badRequest("This candidate is already hired.");
  if (application.status === "rejected" || application.status === "archived") {
    return badRequest("This candidate has been rejected.");
  }

  const rounds = await roundsFor(applicationId);
  const latest = rounds[rounds.length - 1];
  if (latest && latest.status !== "passed") {
    return badRequest(`Mark Level ${latest.level} as passed before adding the next level.`);
  }

  const body = await req.json();
  const people = await resolveInterviewers(body.interviewerIds);
  if (people.error) return badRequest(people.error);
  const details = parseRoundDetails(body);
  if (details.error) return badRequest(details.error);

  const round = await prisma.interviewRound.create({
    data: {
      ...details.data,
      applicationId,
      jobSlug: application.jobSlug,
      level: (latest?.level || 0) + 1,
      interviewerIds: people.ids,
      interviewerNames: people.names,
      status: "scheduled",
    },
  });

  // Anyone being interviewed counts as shortlisted
  if (application.status === "new" || application.status === "on_hold") {
    await prisma.jobApplication.update({
      where: { id: applicationId },
      data: { status: "shortlisted" },
    });
  }

  return NextResponse.json(round, { status: 201 });
}
