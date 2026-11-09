// Interview panel availability: shared helpers (browser + server).
// Dates are calendar days "YYYY-MM-DD"; times are minutes from midnight. All in India time (IST).

export const AVAILABILITY_TZ = "Asia/Kolkata";
export const TZ_LABEL = "IST";
export const MAX_DAYS_AHEAD = 180;
export const MAX_RANGES_PER_DAY = 12;
export const MIN_RANGE_MINUTES = 15;

export const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

/** Today's date in India, "YYYY-MM-DD". */
export function todayKey(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: AVAILABILITY_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

/** "YYYY-MM-DD" -> Date at UTC midnight (used only for calendar maths). */
export function keyToDate(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function dateToKey(date) {
  return date.toISOString().slice(0, 10);
}

export function addDays(key, days) {
  const d = keyToDate(key);
  d.setUTCDate(d.getUTCDate() + days);
  return dateToKey(d);
}

/** Monday of the week containing this day. */
export function weekStart(key) {
  const d = keyToDate(key);
  const dow = (d.getUTCDay() + 6) % 7; // Mon=0
  d.setUTCDate(d.getUTCDate() - dow);
  return dateToKey(d);
}

export function isValidDateKey(key) {
  if (typeof key !== "string" || !DATE_RE.test(key)) return false;
  return dateToKey(keyToDate(key)) === key;
}

export function formatDay(key, opts = { weekday: "long", day: "numeric", month: "short", year: "numeric" }) {
  return keyToDate(key).toLocaleDateString("en-GB", { timeZone: "UTC", ...opts });
}

export function timeToMinutes(value) {
  const m = TIME_RE.exec(String(value || ""));
  return m ? Number(m[1]) * 60 + Number(m[2]) : null;
}

export function minutesToTime(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

/** 570 -> "9:30 AM" */
export function formatMinutes(min) {
  if (min >= 1440) return "12:00 AM";
  const h = Math.floor(min / 60);
  const m = min % 60;
  const suffix = h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
}

export function formatRange(startMin, endMin) {
  return `${formatMinutes(startMin)} – ${formatMinutes(endMin)}`;
}

/**
 * Check and tidy a day's ranges [{ start: "HH:MM", end: "HH:MM" }].
 * Overlapping or touching ranges are merged.
 * @returns {{ ranges: {startMin:number,endMin:number}[] } | { error: string }}
 */
export function normalizeRanges(input) {
  if (!Array.isArray(input)) return { error: "Invalid time ranges" };
  if (input.length > MAX_RANGES_PER_DAY) {
    return { error: `You can add up to ${MAX_RANGES_PER_DAY} time ranges per day` };
  }
  const parsed = [];
  for (const r of input) {
    const startMin = timeToMinutes(r?.start);
    let endMin = timeToMinutes(r?.end);
    if (startMin === null || endMin === null) return { error: "Please fill in every start and end time" };
    if (endMin === 0) endMin = 1440; // "00:00" as an end time means midnight
    if (endMin <= startMin) return { error: "Each end time must be after its start time" };
    if (endMin - startMin < MIN_RANGE_MINUTES) {
      return { error: `Each time range must be at least ${MIN_RANGE_MINUTES} minutes` };
    }
    parsed.push({ startMin, endMin });
  }
  parsed.sort((a, b) => a.startMin - b.startMin);
  const merged = [];
  for (const r of parsed) {
    const last = merged[merged.length - 1];
    if (last && r.startMin <= last.endMin) last.endMin = Math.max(last.endMin, r.endMin);
    else merged.push({ ...r });
  }
  return { ranges: merged };
}

// Interviews are scheduled for one hour, so admins see availability as 1-hour slots:
// 10:00–12:00 -> 10:00–11:00, 11:00–12:00. Leftover time shorter than an hour is left out.
export const INTERVIEW_MINUTES = 60;

export function splitIntoSlots(startMin, endMin, length = INTERVIEW_MINUTES) {
  const slots = [];
  for (let s = startMin; s + length <= endMin; s += length) {
    slots.push({ startMin: s, endMin: s + length });
  }
  return slots;
}

/** All 1-hour slots inside a list of ranges [{ startMin, endMin }] */
export function slotsOf(ranges = [], length = INTERVIEW_MINUTES) {
  return ranges.flatMap((r) => splitIntoSlots(r.startMin, r.endMin, length));
}
