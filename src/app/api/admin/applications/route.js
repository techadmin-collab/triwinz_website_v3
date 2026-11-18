import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import {
  buildApplicationsOrderBy,
  buildApplicationsWhere,
  CLOSED_STATUSES,
  getApplicationsPaginationMeta,
  interviewApplicationIds,
  parseApplicationsQuery,
} from "../../../../lib/applicationsQuery";
import { isAdminSession } from "../../../../lib/permissions";

export async function GET(req) {
  const { error, session } = await requireModule("applications");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const { page: requestedPage, pageSize, sort, filters } =
    parseApplicationsQuery(searchParams);
  const interviewAppIds = await interviewApplicationIds(prisma);
  const where = buildApplicationsWhere({ ...filters, interviewAppIds });
  const orderBy = buildApplicationsOrderBy(sort);

  // counts for the status tabs: same filters, any status
  const allStatusesWhere = buildApplicationsWhere({ ...filters, status: "", interviewAppIds });

  const [total, newCount, jobOptions, referralSourceRows, statusGroups, interviewGroups] = await Promise.all([
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
    // candidates without interview levels, by status
    prisma.jobApplication.groupBy({
      by: ["status"],
      where: interviewAppIds.length
        ? { AND: [allStatusesWhere, { id: { notIn: interviewAppIds } }] }
        : allStatusesWhere,
      _count: { _all: true },
    }),
    // candidates with interview levels, by status
    interviewAppIds.length
      ? prisma.jobApplication.groupBy({
          by: ["status"],
          where: { AND: [allStatusesWhere, { id: { in: interviewAppIds } }] },
          _count: { _all: true },
        })
      : Promise.resolve([]),
  ]);

  const statusCounts = { all: 0, interviewing: 0 };
  const addCount = (key, n) => {
    statusCounts[key] = (statusCounts[key] || 0) + n;
    statusCounts.all += n;
  };
  for (const group of statusGroups) {
    // older records: "archived" is shown as rejected
    addCount(group.status === "archived" ? "rejected" : group.status || "new", group._count._all);
  }
  for (const group of interviewGroups) {
    // hired / rejected keep their own tab; everyone else is "In interview"
    if (CLOSED_STATUSES.includes(group.status)) {
      addCount(group.status === "archived" ? "rejected" : group.status, group._count._all);
    } else {
      addCount("interviewing", group._count._all);
    }
  }

  const { totalPages, page, from, to, skip } = getApplicationsPaginationMeta(
    total,
    requestedPage,
    pageSize,
  );

  const inInterview = new Set(interviewAppIds);
  const items = (
    await prisma.jobApplication.findMany({
      where,
      orderBy,
      skip,
      take: pageSize,
    })
  ).map((item) => ({
    ...item,
    inInterview: !CLOSED_STATUSES.includes(item.status) && inInterview.has(item.id),
  }));

  return NextResponse.json({
    items,
    total,
    newCount,
    statusCounts,
    canReject: isAdminSession(session), // staff can't choose "Rejected"
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
