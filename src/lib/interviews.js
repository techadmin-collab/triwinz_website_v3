// Interview process: shared constants and helpers (used by admin pages and APIs)

export const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export const ROUND_STATUSES = [
  { value: "scheduled", label: "Scheduled", color: "#1D5758", bg: "#E6F7F6", border: "rgba(29, 87, 88, 0.25)" },
  { value: "passed", label: "Passed", color: "#047857", bg: "#D1FAE5", border: "#6EE7B7" },
  { value: "on_hold", label: "On hold", color: "#B45309", bg: "#FEF3C7", border: "#FCD34D" },
  { value: "rejected", label: "Rejected", color: "#B91C1C", bg: "#FEE2E2", border: "#FCA5A5" },
  { value: "cancelled", label: "Cancelled", color: "#4B5563", bg: "#F3F4F6", border: "#D1D5DB" },
];

// Outcomes the admin team can record for a level
export const RESULT_OPTIONS = ["passed", "on_hold", "rejected"];

export const INTERVIEW_MODES = [
  { value: "online", label: "Online" },
  { value: "in_person", label: "In person" },
  { value: "phone", label: "Phone" },
  { value: "hybrid", label: "Hybrid" }, // online + in person: meeting link and location
];

export const LEVEL_TITLE_SUGGESTIONS = ["Technical", "Managerial", "HR", "Final"];

export function roundStatusMeta(value) {
  return ROUND_STATUSES.find((s) => s.value === value) || ROUND_STATUSES[0];
}

export function modeLabel(value) {
  return INTERVIEW_MODES.find((m) => m.value === value)?.label || "";
}

export function levelLabel(round) {
  if (!round) return "";
  return round.title ? `Level ${round.level} · ${round.title}` : `Level ${round.level}`;
}

/** Overall hiring stage of an application, from its status and its interview rounds. */
export function getStage(application, rounds = []) {
  const sorted = [...rounds].sort((a, b) => a.level - b.level);
  const latest = sorted[sorted.length - 1];
  const status = application?.status;

  if (status === "selected") {
    return { key: "hired", label: "Hired", color: "#047857", bg: "#D1FAE5" };
  }
  if (status === "rejected" || status === "archived") {
    return {
      key: "rejected",
      label: latest ? `Rejected at L${latest.level}` : "Rejected",
      color: "#B91C1C",
      bg: "#FEE2E2",
    };
  }
  if (!latest) {
    return { key: "not_scheduled", label: "Not scheduled", color: "#4B5563", bg: "#F3F4F6" };
  }
  const meta = roundStatusMeta(latest.status);
  if (latest.status === "passed") {
    return {
      key: "in_progress",
      label: `L${latest.level} passed · next step`,
      color: meta.color,
      bg: meta.bg,
    };
  }
  return {
    key: "in_progress",
    label: `L${latest.level} · ${meta.label}`,
    color: meta.color,
    bg: meta.bg,
  };
}

/** ISO date -> value for <input type="datetime-local"> (in the viewer's time zone) */
export function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** <input type="datetime-local"> value -> ISO string (or null) */
export function fromLocalInput(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

// Panel member feedback (from their private link)
export const FEEDBACK_RECOMMENDATIONS = [
  { value: "strong_yes", label: "Strong yes", color: "#047857", bg: "#D1FAE5" },
  { value: "yes", label: "Yes", color: "#0F766E", bg: "#E6F7F6" },
  { value: "no", label: "No", color: "#B45309", bg: "#FEF3C7" },
  { value: "strong_no", label: "Strong no", color: "#B91C1C", bg: "#FEE2E2" },
];

export function recommendationMeta(value) {
  return FEEDBACK_RECOMMENDATIONS.find((r) => r.value === value) || null;
}

/** Average of the role-based criteria ratings, e.g. 3.8 (or null) */
export function averageScore(scores = []) {
  const list = (scores || []).filter((s) => Number.isFinite(s?.rating));
  if (!list.length) return null;
  return Math.round((list.reduce((sum, s) => sum + s.rating, 0) / list.length) * 10) / 10;
}

// Levels whose feedback can still be changed by the panel
export const FEEDBACK_OPEN_STATUSES = ["scheduled", "on_hold"];

/** "Thu, 12 Nov 2026, 10:30 AM IST" */
export function formatIST(value) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return `${d.toLocaleString("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })} IST`;
}
