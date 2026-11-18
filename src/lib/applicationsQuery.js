const ALLOWED_STATUSES = [
  "new",
  "reviewed",
  "shortlisted",
  "interviewing", // not stored: open applications that have an interview level
  "on_hold",
  "marked_for_rejection",
  "rejected",
  "selected",
];
const ALLOWED_PAGE_SIZES = [5, 10, 20];

// Hired, rejected or marked for rejection: these stay in their own tabs even when the
// candidate had interviews
export const CLOSED_STATUSES = ["rejected", "archived", "selected", "marked_for_rejection"];
const OPEN_STATUSES = ["new", "reviewed", "shortlisted", "on_hold"];

const ALLOWED_SORTS = {
  newest: { createdAt: "desc" },
  oldest: { createdAt: "asc" },
  name_asc: { fullName: "asc" },
  name_desc: { fullName: "desc" },
  job_asc: { jobTitle: "asc" },
  job_desc: { jobTitle: "desc" },
  status_asc: { status: "asc" },
  status_desc: { status: "desc" },
};

const DEFAULT_SORT = "newest";

function isValidDateString(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function buildApplicationsWhere({
  status,
  jobSlug,
  referralSource,
  dateFrom,
  dateTo,
  nameSearch,
  interviewAppIds = [],
  withInterviews = false, // e.g. the Shortlisted page: shortlisted incl. those in interviews
}) {
  const where = {};
  const and = [];

  if (status && ALLOWED_STATUSES.includes(status)) {
    if (status === "interviewing") {
      // every candidate with an interview level who isn't hired or rejected
      // (upcoming, waiting for a result, passed a level, on hold)
      where.status = { notIn: CLOSED_STATUSES };
      and.push({ id: { in: interviewAppIds } });
    } else if (OPEN_STATUSES.includes(status)) {
      // new / reviewed / shortlisted / on hold: only those not in interviews yet
      where.status = status;
      if (interviewAppIds.length && !withInterviews) and.push({ id: { notIn: interviewAppIds } });
    } else if (status === "rejected") {
      where.status = { in: ["rejected", "archived"] };
    } else {
      where.status = status;
    }
  }

  if (jobSlug) {
    where.jobSlug = jobSlug;
  }

  if (nameSearch) {
    and.push({
      OR: [
        { fullName: { contains: nameSearch, mode: "insensitive" } },
        { email: { contains: nameSearch, mode: "insensitive" } },
      ],
    });
  }

  if (referralSource === "__none__") {
    and.push({
      OR: [{ referralSource: null }, { referralSource: "" }],
    });
  } else if (referralSource) {
    where.referralSource = referralSource;
  }

  if (dateFrom || dateTo) {
    where.createdAt = {};
    if (dateFrom && isValidDateString(dateFrom)) {
      where.createdAt.gte = new Date(`${dateFrom}T00:00:00.000`);
    }
    if (dateTo && isValidDateString(dateTo)) {
      where.createdAt.lte = new Date(`${dateTo}T23:59:59.999`);
    }
  }

  if (and.length) {
    where.AND = and;
  }

  return where;
}

/** Ids of applications that have at least one interview level. */
export async function interviewApplicationIds(prisma) {
  if (!prisma.interviewRound) return [];
  const rows = await prisma.interviewRound.findMany({
    distinct: ["applicationId"],
    select: { applicationId: true },
  });
  return rows.map((r) => r.applicationId).filter(Boolean);
}

export function buildApplicationsOrderBy(sort) {
  return ALLOWED_SORTS[sort] || ALLOWED_SORTS[DEFAULT_SORT];
}

export function parseApplicationsQuery(searchParams) {
  const requestedPage = Math.max(1, Number(searchParams.get("page") || 1));
  const requestedPageSize = Number(searchParams.get("pageSize") || 10);
  const pageSize = ALLOWED_PAGE_SIZES.includes(requestedPageSize)
    ? requestedPageSize
    : 10;

  const status = searchParams.get("status") || "";
  const jobSlug = searchParams.get("jobSlug") || "";
  const referralSource = String(
    searchParams.get("referralSource") || "",
  ).trim();
  const nameSearch = String(searchParams.get("name") || "").trim();
  const dateFrom = searchParams.get("dateFrom") || "";
  const dateTo = searchParams.get("dateTo") || "";
  const withInterviews = searchParams.get("withInterviews") === "1";
  const requestedSort = searchParams.get("sort") || DEFAULT_SORT;
  const sort = ALLOWED_SORTS[requestedSort] ? requestedSort : DEFAULT_SORT;

  return {
    page: requestedPage,
    pageSize,
    sort,
    filters: {
      status: ALLOWED_STATUSES.includes(status) ? status : "",
      jobSlug,
      referralSource,
      nameSearch,
      dateFrom: isValidDateString(dateFrom) ? dateFrom : "",
      dateTo: isValidDateString(dateTo) ? dateTo : "",
      withInterviews,
    },
  };
}

export function getApplicationsPaginationMeta(total, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const from = total === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const to = Math.min(safePage * pageSize, total);

  return { totalPages, page: safePage, from, to, skip: (safePage - 1) * pageSize };
}

export { ALLOWED_STATUSES, ALLOWED_PAGE_SIZES, ALLOWED_SORTS, DEFAULT_SORT };
