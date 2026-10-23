import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/requireAdmin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const items = await prisma.caseStudy.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const item = await prisma.caseStudy.create({
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
  return NextResponse.json(item, { status: 201 });
}
