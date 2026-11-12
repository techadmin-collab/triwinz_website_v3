import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requirePanel } from "../../../../../lib/interviewerPortal";
import {
  MAX_QUESTIONS_PER_INTERVIEW,
  QUESTION_LIMIT,
  cleanText,
  jsonError,
  notReady,
  openRoundFor,
  serializeQuestion,
} from "../../../../../lib/interviewerQuestions";

// POST { roundId, question } -> add one of my own questions to this interview level
export async function POST(req, { params }) {
  const { interviewer, error } = await requirePanel(params);
  if (error) return error;
  const pending = notReady();
  if (pending) return pending;

  const body = await req.json().catch(() => ({}));
  const { round, error: roundError } = await openRoundFor(interviewer, body.roundId);
  if (roundError) return roundError;

  const question = cleanText(body.question, QUESTION_LIMIT);
  if (!question) return jsonError("Please type a question");

  const count = await prisma.interviewerQuestion.count({
    where: { roundId: round.id, interviewerId: interviewer.id },
  });
  if (count >= MAX_QUESTIONS_PER_INTERVIEW) {
    return jsonError(`You can add up to ${MAX_QUESTIONS_PER_INTERVIEW} questions for one interview.`);
  }

  const item = await prisma.interviewerQuestion.create({
    data: {
      roundId: round.id,
      applicationId: round.applicationId,
      interviewerId: interviewer.id,
      question,
    },
  });
  return NextResponse.json({ item: serializeQuestion(item) }, { status: 201 });
}
