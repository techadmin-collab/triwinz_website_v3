import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import {
  buildApplicationsOrderBy,
  buildApplicationsWhere,
  getApplicationsPaginationMeta,
  parseApplicationsQuery,
} from "../../../../lib/applicationsQuery";

export async function GET(req) {
  const { error } = await requireModule("applications");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const { page: requestedPage, pageSize, sort, filters } =
    parseApplicationsQuery(searchParams);
  const where = buildApplicationsWhere(filters);
  const orderBy = buildApplicationsOrderBy(sort);

  const [total, newCount, jobOptions, referralSourceRows] = await Promise.all([
    prisma.jobApplication.count({ where }),
    prisma.jobApplication.count({ where: { status: "new" } }),
    prisma.jobApplication.findMany({
      distinct: ["jobSlug"],
      select: { jobSlug: true, jobTitle: true },
      orderBy: { jobTitle: "asc" },
    }),
    prisma.jobApplication.findMany({
      where: {
        AND: [
          { referralSource: { not: null } },
          { NOT: { referralSource: "" } },
        ],
      },
      distinct: ["referralSource"],
      select: { referralSource: true },
      orderBy: { referralSource: "asc" },
    }),
  ]);

  const { totalPages, page, from, to, skip } = getApplicationsPaginationMeta(
    total,
    requestedPage,
    pageSize,
  );

  const items = await prisma.jobApplication.findMany({
    where,
    orderBy,
    skip,
    take: pageSize,
  });

  return NextResponse.json({
    items,
    total,
    newCount,
    jobOptions,
    referralSourceOptions: referralSourceRows
      .map((row) => row.referralSource)
      .filter(Boolean),
    page,
    pageSize,
    totalPages,
    from,
    to,
    sort,
    filters,
  });
}
