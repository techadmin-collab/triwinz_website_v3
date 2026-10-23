import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/requireAdmin";

export async function GET(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });
  if (!blog) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(blog);
}

export async function PUT(req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  const body = await req.json();

  try {
    const blog = await prisma.blog.update({
      where: { id },
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
    return NextResponse.json(blog);
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { id } = await params;
  try {
    await prisma.blog.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
