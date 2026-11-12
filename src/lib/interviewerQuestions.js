// Private interview questions: each panel member's own questions for one interview level,
// with a rating and remarks for the candidate's answer. Only that panel member can see them.
import { NextResponse } from "next/server";
import { prisma } from "./prisma";
import { FEEDBACK_OPEN_STATUSES, OBJECT_ID_RE } from "./interviews";

export const QUESTION_LIMIT = 500;
export const REMARKS_LIMIT = 4000;
export const MAX_QUESTIONS_PER_INTERVIEW = 50;

export function serializeQuestion(q) {
  return {
    id: q.id,
    question: q.question,
    rating: q.rating ?? null,
    remarks: q.remarks || "",
    createdAt: q.createdAt,
    updatedAt: q.updatedAt,
  };
}

/** This panel member's questions for one interview level, oldest first. */
export async function questionsFor(roundId, interviewerId) {
  if (!prisma.interviewerQuestion) return [];
  const rows = await prisma.interviewerQuestion.findMany({
    where: { roundId, interviewerId },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(serializeQuestion);
}

export function jsonError(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function notReady() {
  return prisma.interviewerQuestion
    ? null
    : jsonError("This page is being updated. Please try again in a few minutes.", 503);
}

/**
 * The interview level, if this panel member is on it and it is still open.
 * Returns { round } or { error: Response }.
 */
export async function openRoundFor(interviewer, roundId) {
  if (typeof roundId !== "string" || !OBJECT_ID_RE.test(roundId)) {
    return { error: jsonError("Interview not found", 404) };
  }
  const round = await prisma.interviewRound.findUnique({ where: { id: roundId } });
  if (!round || !round.interviewerIds.includes(interviewer.id)) {
    return { error: jsonError("Interview not found", 404) };
  }
  if (!FEEDBACK_OPEN_STATUSES.includes(round.status)) {
    return { error: jsonError("This interview has been closed, so your questions can no longer be changed.", 409) };
  }
  return { round };
}

export function cleanText(value, limit) {
  const v = typeof value === "string" ? value.trim() : "";
  return v.slice(0, limit);
}
