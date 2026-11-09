import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requirePanel } from "../../../../../../lib/interviewerPortal";
import {
  FEEDBACK_OPEN_STATUSES,
  FEEDBACK_RECOMMENDATIONS,
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
        notes: round.notes,
        panel: round.interviewerNames.filter(Boolean),
      },
      candidate: application,
      job: job || null,
      checklist,
      teamNotes,
      feedback: feedback
        ? {
            rating: feedback.rating,
            recommendation: feedback.recommendation,
            strengths: feedback.strengths,
            concerns: feedback.concerns,
            comments: feedback.comments,
            submittedAt: feedback.submittedAt,
            updatedAt: feedback.updatedAt,
          }
        : null,
      canEditFeedback: FEEDBACK_OPEN_STATUSES.includes(round.status),
    },
    { headers: { "cache-control": "no-store" } },
  );
}

// PUT { rating 1-5, recommendation, strengths?, concerns?, comments }
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

  const body = await req.json().catch(() => ({}));
  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Please give a rating from 1 to 5 stars" }, { status: 400 });
  }
  if (!FEEDBACK_RECOMMENDATIONS.some((r) => r.value === body.recommendation)) {
    return NextResponse.json({ error: "Please choose a recommendation" }, { status: 400 });
  }
  const comments = clean(body.comments);
  if (!comments) {
    return NextResponse.json({ error: "Please add your overall comments" }, { status: 400 });
  }

  const data = {
    rating,
    recommendation: body.recommendation,
    strengths: clean(body.strengths),
    concerns: clean(body.concerns),
    comments,
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

  return NextResponse.json({
    ok: true,
    feedback: {
      rating: saved.rating,
      recommendation: saved.recommendation,
      strengths: saved.strengths,
      concerns: saved.concerns,
      comments: saved.comments,
      submittedAt: saved.submittedAt,
      updatedAt: saved.updatedAt,
    },
  });
}
