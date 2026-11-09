import { prisma } from "../../../../lib/prisma";

// Interview assessment questions are internal; never send them to the public pages
function publicJob(job) {
  if (!job) return job;
  // eslint-disable-next-line no-unused-vars
  const { assessmentCriteria, overallQuestions, ...rest } = job;
  return rest;
}

export async function getPublishedJobs() {
  const jobs = await prisma.job.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });
  return jobs.map(publicJob);
}

export async function getPublishedJobBySlug(slug) {
  const job = await prisma.job.findFirst({
    where: { slug, published: true },
  });
  return publicJob(job);
}
