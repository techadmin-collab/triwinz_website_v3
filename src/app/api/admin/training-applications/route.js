import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";

export async function GET(req) {
  const { error } = await requireModule("training");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const q = (searchParams.get("q") || "").trim();
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(
    50,
    Math.max(5, Number(searchParams.get("pageSize") || 10)),
  );

  const where = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { fullName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { phone: { contains: q } },
      { college: { contains: q, mode: "insensitive" } },
    ];
  }

  const [total, items, newCount] = await Promise.all([
    prisma.trainingApplication.count({ where }),
    prisma.trainingApplication.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.trainingApplication.count({ where: { status: "new" } }),
  ]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages,
    from,
    to,
    newCount,
  });
}
