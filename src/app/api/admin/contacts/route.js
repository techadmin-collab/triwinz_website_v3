import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";

export async function GET(req) {
  const { error } = await requireModule("contacts");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "";
  const emailSent = searchParams.get("emailSent");
  const page = Math.max(1, Number(searchParams.get("page") || 1));
  const pageSize = Math.min(
    50,
    Math.max(5, Number(searchParams.get("pageSize") || 10)),
  );

  const where = {};
  if (status) where.status = status;
  if (emailSent === "true") where.emailSent = true;
  if (emailSent === "false") where.emailSent = false;

  const [total, items, newCount, failedEmailCount] = await Promise.all([
    prisma.contactMessage.count({ where }),
    prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.contactMessage.count({ where: { status: "new" } }),
    prisma.contactMessage.count({ where: { emailSent: false } }),
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
    failedEmailCount,
  });
}
