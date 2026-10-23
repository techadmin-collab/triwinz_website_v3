import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";

export async function GET() {
  const { error } = await requireModule("applications");
  if (error) return error;

  const applications = await prisma.jobApplication.findMany({
    where: { status: { in: ["shortlisted", "reviewed"] } },
    select: { jobSlug: true, jobTitle: true },
    orderBy: { jobTitle: "asc" },
  });

  const jobsMap = new Map();

  for (const item of applications) {
    const existing = jobsMap.get(item.jobSlug);
    if (existing) {
      existing.count += 1;
    } else {
      jobsMap.set(item.jobSlug, {
        jobSlug: item.jobSlug,
        jobTitle: item.jobTitle,
        count: 1,
      });
    }
  }

  return NextResponse.json({
    jobs: Array.from(jobsMap.values()),
    total: applications.length,
  });
}
