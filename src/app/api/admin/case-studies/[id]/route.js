import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/requireAdmin";

export async function GET(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const item = await prisma.caseStudy.findUnique({ where: { id } });
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PUT(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  try {
    const item = await prisma.caseStudy.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.slug,
        content: body.content || "",
        summary: body.summary || "",
        coverImage: body.coverImage || null,
        client: body.client || null,
        industry: body.industry || null,
        result: body.result || null,
        published: Boolean(body.published),
        seoTitle: body.seoTitle || null,
        seoDesc: body.seoDesc || null,
      },
    });
    return NextResponse.json(item);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.caseStudy.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
