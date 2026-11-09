import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requirePanel } from "../../../../../../lib/interviewerPortal";
import {
  FEEDBACK_OPEN_STATUSES,
  FEEDBACK_RECOMMENDATIONS,
  averageScore,
  OBJECT_ID_RE,
} from "../../../../../../lib/interviews";
import { checklistFor } from "../../../../../../lib/interviewChecklist";

const LIMIT = 4000;

function clean(value) {
  const v = typeof value === "string" ? value.trim() : "";
  return v ? v.slice(0, LIMIT) : null;
}

async function loadRound(interviewer, roundId) {
  if (!OBJECT_ID_RE.test(roundId)) return null;
  const round = await prisma.interviewRound.findUnique({ where: { id: roundId } });
  // only interviews they are on the panel for
  if (!round || !round.interviewerIds.includes(interviewer.id)) return null;
  return round;
}

function serializeFeedback(fb) {
  if (!fb) return null;
  return {
    rating: fb.rating,
    recommendation: fb.recommendation,
    scores: fb.scores || [],
    overall: fb.overall || [],
    strengths: fb.strengths,
    concerns: fb.concerns,
    comments: fb.comments,
    submittedAt: fb.submittedAt,
    updatedAt: fb.updatedAt,
  };
}

function notFound() {
  return NextResponse.json({ error: "Interview not found" }, { status: 404 });
}

// GET -> interview details, candidate (name, role, resume, cover letter) and their own feedback
export async function GET(_req, { params }) {
  const { interviewer, error } = await requirePanel(params);
  if (error) return error;
  const { roundId } = await params;
  const round = await loadRound(interviewer, roundId);
  if (!round) return notFound();

  const [application, feedback, job, checklist, teamNotes] = await Promise.all([
    prisma.jobApplication.findUnique({
      where: { id: round.applicationId },
      // email and phone are deliberately not shared with the panel
      select: { fullName: true, jobTitle: true, resumeUrl: true, resumeFileName: true, coverLetter: true },
    }),
    prisma.interviewFeedback.findUnique({
      where: { roundId_interviewerId: { roundId: round.id, interviewerId: interviewer.id } },
    }),
    // the job description for this role (same details as the careers page)
    prisma.job.findUnique({
      where: { slug: round.jobSlug },
      select: {
        title: true,
        department: true,
        location: true,
        type: true,
        workMode: true,
        experience: true,
        joiningPeriod: true,
        summary: true,
        about: true,
        responsibilities: true,
        requirements: true,
        qualifications: true,
        niceToHave: true,
        assessmentCriteria: true,
        overallQuestions: true,
      },
    }),
    checklistFor(round.id, interviewer.id),
    prisma.interviewNote
      ? prisma.interviewNote.findMany({
          where: { roundId: round.id },
          orderBy: { createdAt: "asc" },
          select: { id: true, text: true, authorName: true, createdAt: true },
        })
      : Promise.resolve([]),
  ]);
  if (!application) return notFound();

  return NextResponse.json(
    {
      interview: {
        id: round.id,
        level: round.level,
        title: round.title,
        status: round.status,
        scheduledAt: round.scheduledAt,
        mode: round.mode,
        location: round.location,
        meetingLink: round.mode === "hybrid" ? round.meetingLink : null,
        notes: round.notes,
        panel: round.interviewerNames.filter(Boolean),
      },
      candidate: application,
      job: job || null,
      checklist,
      teamNotes,
      feedback: serializeFeedback(feedback),
      canEditFeedback: FEEDBACK_OPEN_STATUSES.includes(round.status),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

// PUT {
//   scores:  [{ question, rating 1-5, remarks? }]   one per role criterion (from the job)
//   overall: [{ question, details?, remarks? }]     one per overall question (from the job)
//   recommendation: strong_yes | yes | no | strong_no
//   comments?: remarks, used only when the job has no assessment questions
// }
export async function PUT(req, { params }) {
  const { interviewer, error } = await requirePanel(params);
  if (error) return error;
  const { roundId } = await params;
  const round = await loadRound(interviewer, roundId);
  if (!round) return notFound();

  if (!FEEDBACK_OPEN_STATUSES.includes(round.status)) {
    return NextResponse.json(
      { error: "This interview has been closed, so the assessment can no longer be changed." },
      { status: 409 },
    );
  }

  const job = await prisma.job.findUnique({
    where: { slug: round.jobSlug },
    select: { assessmentCriteria: true, overallQuestions: true },
  });
  const criteria = job?.assessmentCriteria || [];
  const questions = job?.overallQuestions || [];

  const body = await req.json().catch(() => ({}));
  const given = (list) => (Array.isArray(list) ? list : []);
  const find = (list, question) => given(list).find((x) => x?.question === question) || {};

  const scores = [];
  for (const question of criteria) {
    const entry = find(body.scores, question);
    const rating = Number(entry.rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json({ error: `Please rate “${question}” from 1 to 5` }, { status: 400 });
    }
    scores.push({ question, rating, remarks: clean(entry.remarks) });
  }
  const overall = questions.map((question) => {
    const entry = find(body.overall, question);
    return { question, details: clean(entry.details), remarks: clean(entry.remarks) };
  });

  if (!FEEDBACK_RECOMMENDATIONS.some((r) => r.value === body.recommendation)) {
    return NextResponse.json({ error: "Please answer “Would you recommend this candidate?”" }, { status: 400 });
  }

  const average = averageScore(scores);
  const data = {
    scores,
    overall,
    rating: average === null ? null : Math.round(average),
    recommendation: body.recommendation,
    comments: criteria.length || questions.length ? null : clean(body.comments),
    strengths: null,
    concerns: null,
    interviewerName: interviewer.name,
  };

  const saved = await prisma.interviewFeedback.upsert({
    where: { roundId_interviewerId: { roundId: round.id, interviewerId: interviewer.id } },
    update: data,
    create: {
      ...data,
      roundId: round.id,
      applicationId: round.applicationId,
      interviewerId: interviewer.id,
    },
  });

  return NextResponse.json({ ok: true, feedback: serializeFeedback(saved) });
}
