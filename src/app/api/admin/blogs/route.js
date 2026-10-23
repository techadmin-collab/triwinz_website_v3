import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireAdmin } from "../../../../lib/requireAdmin";

export async function GET() {
  const { error } = await requireAdmin();
  if (error) return error;

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(blogs);
}

export async function POST(req) {
  const { error } = await requireAdmin();
  if (error) return error;

  const body = await req.json();
  const blog = await prisma.blog.create({
    data: {
      title: body.title,
      slug: body.slug,
      content: body.content || "",
      excerpt: body.excerpt || null,
      coverImage: body.coverImage || null,
      published: Boolean(body.published),
      seoTitle: body.seoTitle || null,
      seoDesc: body.seoDesc || null,
    },
  });
  return NextResponse.json(blog, { status: 201 });
}
