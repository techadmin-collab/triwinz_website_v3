import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";

import { serializeJobTypes } from "../../../../../lib/jobTypes";

function toLines(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value !== "string") return [];
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

export async function GET(_req, { params }) {
  const { error } = await requireModule("jobs");
  if (error) return error;

  const { id } = await params;
  const job = await prisma.job.findUnique({ where: { id } });
  if (!job) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(job);
}

export async function PUT(req, { params }) {
  const { error } = await requireModule("jobs");
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  try {
    const job = await prisma.job.update({
      where: { id },
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
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireModule("jobs");
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
