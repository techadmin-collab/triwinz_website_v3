// Shared helpers for the team admin API

/** Turn the bio into an array of paragraphs (accepts an array or text split by blank lines). */
export function toParagraphs(value) {
  if (Array.isArray(value)) {
    return value.map((p) => String(p).trim()).filter(Boolean);
  }
  if (typeof value !== "string") return [];
  return value
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim())
    .filter(Boolean);
}

function cleanUrl(value) {
  const url = typeof value === "string" ? value.trim() : "";
  return url || null;
}

/** Pick and clean the editable fields from a request body. */
export function toTeamMemberData(body = {}) {
  return {
    name: String(body.name || "").trim(),
    role: String(body.role || "").trim(),
    bio: toParagraphs(body.bio),
    photoUrl: cleanUrl(body.photoUrl),
    photoPublicId: cleanUrl(body.photoPublicId),
    linkedin: cleanUrl(body.linkedin),
    published: body.published === undefined ? true : Boolean(body.published),
  };
}
