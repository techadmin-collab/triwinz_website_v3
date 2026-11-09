// Server helpers for interview-level checklists (admin + panel APIs)
import { prisma } from "./prisma";

export const CHECKLIST_MAX_ITEMS = 50;
export const CHECKLIST_MAX_LENGTH = 300;

export function cleanChecklistText(value) {
  const text = typeof value === "string" ? value.replace(/\s+/g, " ").trim() : "";
  return text.slice(0, CHECKLIST_MAX_LENGTH);
}

/** Shape sent to the browser. `mine` = this panel member added it (admin sees mine=false). */
export function serializeChecklistItem(item, interviewerId = null) {
  return {
    id: item.id,
    text: item.text,
    done: item.done,
    doneByName: item.doneByName,
    doneAt: item.doneAt,
    addedBy: item.addedBy,
    addedByName: item.addedByName,
    mine: Boolean(interviewerId && item.interviewerId === interviewerId),
    createdAt: item.createdAt,
  };
}

export async function checklistFor(roundId, interviewerId = null) {
  if (!prisma.interviewChecklistItem) return [];
  const items = await prisma.interviewChecklistItem.findMany({
    where: { roundId },
    orderBy: { createdAt: "asc" },
  });
  return items.map((i) => serializeChecklistItem(i, interviewerId));
}

/** Add an item; returns { item } or { error } */
export async function addChecklistItem(round, { text, addedBy, addedByName, interviewerId = null }) {
  const clean = cleanChecklistText(text);
  if (!clean) return { error: "Type something to add" };
  const count = await prisma.interviewChecklistItem.count({ where: { roundId: round.id } });
  if (count >= CHECKLIST_MAX_ITEMS) return { error: `A checklist can have up to ${CHECKLIST_MAX_ITEMS} items` };
  const item = await prisma.interviewChecklistItem.create({
    data: {
      roundId: round.id,
      applicationId: round.applicationId,
      text: clean,
      addedBy,
      addedByName: addedByName || (addedBy === "admin" ? "TriWinz team" : "Panel member"),
      interviewerId,
    },
  });
  return { item };
}

/** Tick / untick data */
export function doneData(done, byName) {
  return done
    ? { done: true, doneByName: byName || null, doneAt: new Date() }
    : { done: false, doneByName: null, doneAt: null };
}
