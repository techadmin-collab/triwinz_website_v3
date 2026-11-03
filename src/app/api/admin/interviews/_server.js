// Server-side helpers for the interview APIs
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { OBJECT_ID_RE } from "../../../../lib/interviews";

export function str(value) {
  const v = typeof value === "string" ? value.trim() : "";
  return v || null;
}

export function badRequest(message, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

// prisma.interviewRound only exists after `npx prisma generate` with the new schema
export function clientOutdated() {
  if (prisma.interviewRound && prisma.interviewer) return null;
  return badRequest(
    'The database client is out of date. Run "npx prisma generate" and restart the dev server.',
    503,
  );
}

/** Validate interviewer ids and return { ids, names } (in the given order). */
export async function resolveInterviewers(ids) {
  if (!Array.isArray(ids)) return { error: "Choose at least one interviewer" };
  const clean = [...new Set(ids.filter((id) => typeof id === "string" && OBJECT_ID_RE.test(id)))];
  if (clean.length === 0) return { error: "Choose at least one interviewer" };
  const found = await prisma.interviewer.findMany({
    where: { id: { in: clean } },
    select: { id: true, name: true },
  });
  const byId = new Map(found.map((i) => [i.id, i.name]));
  const valid = clean.filter((id) => byId.has(id));
  if (valid.length === 0) return { error: "Choose at least one interviewer" };
  return { ids: valid, names: valid.map((id) => byId.get(id)) };
}

/** Parse the editable details of a level from a request body. */
export function parseRoundDetails(body = {}) {
  const data = {};
  if ("title" in body) data.title = str(body.title);
  if ("mode" in body) {
    data.mode = ["online", "in_person", "phone"].includes(body.mode) ? body.mode : null;
  }
  if ("location" in body) data.location = str(body.location);
  if ("notes" in body) data.notes = str(body.notes);
  if ("scheduledAt" in body) {
    if (!body.scheduledAt) data.scheduledAt = null;
    else {
      const d = new Date(body.scheduledAt);
      if (Number.isNaN(d.getTime())) return { error: "Invalid interview date" };
      data.scheduledAt = d;
    }
  }
  return { data };
}

export async function roundsFor(applicationId) {
  return prisma.interviewRound.findMany({
    where: { applicationId },
    orderBy: { level: "asc" },
  });
}
