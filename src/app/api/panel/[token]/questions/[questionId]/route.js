import { NextResponse } from "next/server";
import { prisma } from "../../../../../../lib/prisma";
import { requirePanel } from "../../../../../../lib/interviewerPortal";
import { OBJECT_ID_RE } from "../../../../../../lib/interviews";
import {
  QUESTION_LIMIT,
  REMARKS_LIMIT,
  cleanText,
  jsonError,
  notReady,
  openRoundFor,
  serializeQuestion,
} from "../../../../../../lib/interviewerQuestions";

/** One of MY questions on an open interview, or { error } */
async function loadMine(params) {
  const { interviewer, error } = await requirePanel(params);
  if (error) return { error };
  const pending = notReady();
  if (pending) return { error: pending };

  const { questionId } = await params;
  if (!OBJECT_ID_RE.test(questionId)) return { error: jsonError("Question not found", 404) };
  const item = await prisma.interviewerQuestion.findUnique({ where: { id: questionId } });
  // other panel members' questions are treated as not existing
  if (!item || item.interviewerId !== interviewer.id) return { error: jsonError("Question not found", 404) };

  const { error: roundError } = await openRoundFor(interviewer, item.roundId);
  if (roundError) return { error: roundError };
  return { item };
}

// PATCH { question?, rating? (1-5, or null to clear), remarks? }
export async function PATCH(req, { params }) {
  const { item, error } = await loadMine(params);
  if (error) return error;

  const body = await req.json().catch(() => ({}));
  const data = {};

  if (body.question !== undefined) {
    const question = cleanText(body.question, QUESTION_LIMIT);
    if (!question) return jsonError("Please type a question");
    data.question = question;
  }
  if (body.rating !== undefined) {
    if (body.rating === null || body.rating === 0) {
      data.rating = null;
    } else {
      const rating = Number(body.rating);
      if (!Number.isInteger(rating) || rating < 1 || rating > 5) return jsonError("Rating must be from 1 to 5");
      data.rating = rating;
    }
  }
  if (body.remarks !== undefined) {
    data.remarks = cleanText(body.remarks, REMARKS_LIMIT) || null;
  }
  if (!Object.keys(data).length) return jsonError("Nothing to update");

  const saved = await prisma.interviewerQuestion.update({ where: { id: item.id }, data });
  return NextResponse.json({ item: serializeQuestion(saved) });
}

export async function DELETE(_req, { params }) {
  const { item, error } = await loadMine(params);
  if (error) return error;
  await prisma.interviewerQuestion.delete({ where: { id: item.id } });
  return NextResponse.json({ ok: true });
}
