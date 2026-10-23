import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import {
  buildApplicationsOrderBy,
  buildApplicationsWhere,
  parseApplicationsQuery,
} from "../../../../../lib/applicationsQuery";

function escapeCsv(value) {
  const str = value == null ? "" : String(value);
  if (/[",\n\r]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function toCsv(rows) {
  const headers = [
    "S.No",
    "Full Name",
    "Email",
    "Phone Number",
    "Job",
    "Resume Link",
  ];

  const lines = [headers.map(escapeCsv).join(",")];

  rows.forEach((row, index) => {
    lines.push(
      [
        index + 1,
        row.fullName,
        row.email,
        row.phone,
        row.jobTitle,
        row.resumeUrl || "",
      ]
        .map(escapeCsv)
        .join(","),
    );
  });

  return `\uFEFF${lines.join("\r\n")}`;
}

export async function GET(req) {
  const { error } = await requireModule("applications");
  if (error) return error;

  const { searchParams } = new URL(req.url);
  const { sort, filters } = parseApplicationsQuery(searchParams);
  const where = buildApplicationsWhere(filters);
  const orderBy = buildApplicationsOrderBy(sort);

  const items = await prisma.jobApplication.findMany({
    where,
    orderBy,
    select: {
      fullName: true,
      email: true,
      phone: true,
      jobTitle: true,
      resumeUrl: true,
    },
  });

  const csv = toCsv(items);
  const stamp = new Date().toISOString().slice(0, 10);
  const filename = `applications-${stamp}.csv`;

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
