import { prisma } from "../../../../lib/prisma";

export async function getPublishedJobs() {
  return prisma.job.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getPublishedJobBySlug(slug) {
  return prisma.job.findFirst({
    where: { slug, published: true },
  });
}
