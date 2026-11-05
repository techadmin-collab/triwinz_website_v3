import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

// PATCH { resolved: true | false }
export async function PATCH(req, { params }) {
  const { error, session } = await requireModule("system");
  if (error) return error;
  const { id } = await params;
  if (!OBJECT_ID_RE.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const body = await req.json().catch(() => ({}));
  const resolved = Boolean(body.resolved);
  try {
    const issue = await prisma.systemIssue.update({
      where: { id },
      data: resolved
        ? {
            resolved: true,
            resolvedAt: new Date(),
            resolvedBy: session.user.name || session.user.email || null,
          }
        : { resolved: false, resolvedAt: null, resolvedBy: null },
    });
    return NextResponse.json({ ok: true, id: issue.id, resolved: issue.resolved });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function DELETE(req, { params }) {
  const { error } = await requireModule("system");
  if (error) return error;
  const { id } = await params;
  if (!OBJECT_ID_RE.test(id)) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  try {
    await prisma.systemIssue.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
