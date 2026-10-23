import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";

import { serializeJobTypes } from "../../../../lib/jobTypes";

function toLines(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function GET() {
  const { error } = await requireModule("jobs");
  if (error) return error;

  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(req) {
  const { error } = await requireModule("jobs");
  if (error) return error;

  const body = await req.json();
  const job = await prisma.job.create({
    data: {
      title: body.title,
      slug: body.slug,
      department: body.department || "",
      location: body.location || "",
      type: serializeJobTypes(body.type),
      workMode: body.workMode || "Hybrid",
      experience: body.experience || "",
      joiningPeriod: body.joiningPeriod || "",
      summary: body.summary || "",
      about: body.about || "",
      responsibilities: toLines(body.responsibilities),
      requirements: toLines(body.requirements),
      qualifications: toLines(body.qualifications),
      niceToHave: toLines(body.niceToHave),
      published: Boolean(body.published),
    },
  });
  return NextResponse.json(job, { status: 201 });
}
