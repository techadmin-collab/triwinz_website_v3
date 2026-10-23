import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET() {
  const items = await prisma.caseStudy.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(items);
}
