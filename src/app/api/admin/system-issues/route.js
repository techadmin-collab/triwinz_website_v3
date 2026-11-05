import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";

function parseRecent(list) {
  return (list || [])
    .map((text) => {
      try {
        return JSON.parse(text);
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}

function clientOutdated(error) {
  return String(error?.message || "").includes("systemIssue") || error?.name === "TypeError";
}

// GET /api/admin/system-issues?status=open|resolved&page=1&pageSize=10
// GET /api/admin/system-issues?summary=1  -> just the counts (sidebar badge)
export async function GET(req) {
  const { error } = await requireModule("system");
  if (error) return error;

  try {
    const { searchParams } = new URL(req.url);
    const [open, openErrors, resolved] = await Promise.all([
      prisma.systemIssue.count({ where: { resolved: false } }),
      prisma.systemIssue.count({ where: { resolved: false, severity: "error" } }),
      prisma.systemIssue.count({ where: { resolved: true } }),
    ]);
    const counts = { open, openErrors, resolved };
    if (searchParams.get("summary")) return NextResponse.json({ counts });

    const status = searchParams.get("status") === "resolved" ? "resolved" : "open";
    const pageSize = Math.min(50, Math.max(1, Number(searchParams.get("pageSize")) || 10));
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const where = { resolved: status === "resolved" };

    const items = await prisma.systemIssue.findMany({
      where,
      orderBy: status === "resolved" ? { resolvedAt: "desc" } : { lastSeenAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return NextResponse.json({
      counts,
      total: status === "resolved" ? resolved : open,
      items: items.map((item) => ({ ...item, recent: parseRecent(item.recent) })),
    });
  } catch (err) {
    console.error("System issues list failed:", err);
    return NextResponse.json(
      {
        error: clientOutdated(err)
          ? "System issues need a database update. Run: npx prisma generate && npx prisma db push, then restart the app."
          : "Failed to load system issues",
      },
      { status: clientOutdated(err) ? 503 : 500 },
    );
  }
}

// POST { action: "resolve_all" }
export async function POST(req) {
  const { error, session } = await requireModule("system");
  if (error) return error;
  const body = await req.json().catch(() => ({}));
  if (body.action !== "resolve_all") {
    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
  const result = await prisma.systemIssue.updateMany({
    where: { resolved: false },
    data: {
      resolved: true,
      resolvedAt: new Date(),
      resolvedBy: session.user.name || session.user.email || null,
    },
  });
  return NextResponse.json({ ok: true, count: result.count });
}
