"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Box, Button, Chip, CircularProgress, Tooltip, Typography } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { BRAND } from "../../../../lib/brand";
import { toLocalInput } from "../../../../lib/interviews";
import {
  AVAILABILITY_TZ,
  addDays,
  formatDay,
  formatMinutes,
  formatRange,
  todayKey,
} from "../../../../lib/availability";

const WINDOW_DAYS = 21;

/** <input type="datetime-local"> value -> { date: "YYYY-MM-DD", min } in India time */
function istPartsFromLocalInput(value) {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: AVAILABILITY_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  );
  return { date: `${parts.year}-${parts.month}-${parts.day}`, min: Number(parts.hour) * 60 + Number(parts.minute) };
}

/** India date + minutes -> datetime-local value in the admin's own time zone */
function localInputFromIst(date, min) {
  const hh = String(Math.floor(min / 60)).padStart(2, "0");
  const mm = String(min % 60).padStart(2, "0");
  return toLocalInput(new Date(`${date}T${hh}:${mm}:00+05:30`).toISOString());
}

/** Overlap of two sorted range lists */
function intersect(a, b) {
  const out = [];
  let i = 0;
  let j = 0;
  while (i < a.length && j < b.length) {
    const start = Math.max(a[i].startMin, b[j].startMin);
    const end = Math.min(a[i].endMin, b[j].endMin);
    if (end - start >= 15) out.push({ startMin: start, endMin: end });
    if (a[i].endMin < b[j].endMin) i += 1;
    else j += 1;
  }
  return out;
}

function TimeChip({ range, onPick, strong }) {
  return (
    <Tooltip title="Use this time">
      <Chip
        size="small"
        label={formatRange(range.startMin, range.endMin)}
        onClick={onPick}
        sx={{
          height: 22,
          fontSize: "0.7rem",
          fontWeight: 700,
          bgcolor: strong ? BRAND.primary : "#E6F7F6",
          color: strong ? "#fff" : BRAND.primary,
          "&:hover": { bgcolor: strong ? BRAND.primaryDark : "#d3f1ef" },
        }}
      />
    </Tooltip>
  );
}

/**
 * Shows panel availability inside the "Schedule level" dialog.
 * Props: interviewers, selectedIds, scheduledAt (datetime-local value), onToggle(id), onPickTime(localValue)
 */
export default function AvailabilityAssist({ interviewers, selectedIds, scheduledAt, onToggle, onPickTime }) {
  const [slots, setSlots] = useState([]); // [{ interviewerId, date, startMin, endMin }]
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const loaded = useRef(new Set()); // "from:to" windows already fetched

  const today = todayKey();
  const chosen = istPartsFromLocalInput(scheduledAt);

  async function fetchWindow(from, to) {
    const key = `${from}:${to}`;
    if (loaded.current.has(key)) return;
    loaded.current.add(key);
    try {
      const res = await fetch(`/api/admin/interviewers/availability?from=${from}&to=${to}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const json = await res.json();
      setSlots((prev) => {
        const keep = prev.filter((s) => s.date < from || s.date > to);
        return [...keep, ...json.slots];
      });
    } catch {
      loaded.current.delete(key);
      setFailed(true);
    }
  }

  // next few weeks, once
  useEffect(() => {
    setLoading(true);
    fetchWindow(today, addDays(today, WINDOW_DAYS - 1)).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a date outside that window
  useEffect(() => {
    if (!chosen) return;
    if (chosen.date >= today && chosen.date <= addDays(today, WINDOW_DAYS - 1)) return;
    fetchWindow(chosen.date, chosen.date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chosen?.date]);

  // interviewerId -> date -> ranges
  const byPerson = useMemo(() => {
    const map = new Map();
    slots.forEach((s) => {
      if (!map.has(s.interviewerId)) map.set(s.interviewerId, new Map());
      const days = map.get(s.interviewerId);
      if (!days.has(s.date)) days.set(s.date, []);
      days.get(s.date).push(s);
    });
    map.forEach((days) => days.forEach((list) => list.sort((a, b) => a.startMin - b.startMin)));
    return map;
  }, [slots]);

  const nameOf = (id) => interviewers.find((i) => i.id === id)?.name || "Panel member";
  const active = interviewers.filter((i) => i.active || selectedIds.includes(i.id));
  const rangesFor = (id, date) => byPerson.get(id)?.get(date) || [];

  const header = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1 }}>
      <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: BRAND.primary }} />
      <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: "#111" }}>Panel availability</Typography>
      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>· times in IST · click a time to use it</Typography>
    </Box>
  );

  const wrapSx = { p: 1.5, borderRadius: 2, border: "1px solid #dcefed", bgcolor: "#F7FCFB" };

  if (loading) {
    return (
      <Box sx={{ ...wrapSx, display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} sx={{ color: BRAND.primary }} />
        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>Loading panel availability…</Typography>
      </Box>
    );
  }
  if (failed && slots.length === 0) {
    return (
      <Box sx={wrapSx}>
        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
          Panel availability couldn&apos;t be loaded. You can still schedule as usual.
        </Typography>
      </Box>
    );
  }

  /* ---------- A date is chosen: who's free that day ---------- */
  if (chosen) {
    const { date, min } = chosen;
    const freeAt = (id) => rangesFor(id, date).some((r) => min >= r.startMin && min < r.endMin);
    const othersFree = active.filter((i) => !selectedIds.includes(i.id) && rangesFor(i.id, date).length);
    const common =
      selectedIds.length > 1
        ? selectedIds.map((id) => rangesFor(id, date)).reduce((acc, list) => intersect(acc, list))
        : [];

    return (
      <Box sx={wrapSx}>
        {header}
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#374151", mb: 1 }}>
          {formatDay(date)} at {formatMinutes(min)} IST
        </Typography>

        {selectedIds.length > 1 ? (
          <Box sx={{ mb: 1.25 }}>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", mb: 0.5 }}>Everyone selected is free</Typography>
            {common.length ? (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {common.map((r) => (
                  <TimeChip key={`${r.startMin}`} range={r} strong onPick={() => onPickTime(localInputFromIst(date, r.startMin))} />
                ))}
              </Box>
            ) : (
              <Typography sx={{ fontSize: "0.76rem", color: "#B45309" }}>No common free time on this day.</Typography>
            )}
          </Box>
        ) : null}

        {selectedIds.length ? (
          <Box sx={{ display: "grid", gap: 0.75, mb: othersFree.length ? 1.25 : 0 }}>
            {selectedIds.map((id) => {
              const ranges = rangesFor(id, date);
              const ok = freeAt(id);
              const Icon = ok ? CheckCircleIcon : ranges.length ? ErrorOutlineIcon : HelpOutlineIcon;
              const color = ok ? "#047857" : ranges.length ? "#B45309" : "#9ca3af";
              return (
                <Box key={id} sx={{ display: "flex", alignItems: "flex-start", gap: 0.75, minWidth: 0 }}>
                  <Icon sx={{ fontSize: 17, color, mt: 0.2, flexShrink: 0 }} />
                  <Box sx={{ minWidth: 0 }}>
                    <Typography sx={{ fontSize: "0.8rem", color: "#111" }}>
                      <strong>{nameOf(id)}</strong>{" "}
                      <Box component="span" sx={{ color }}>
                        {ok ? "is free at this time" : ranges.length ? "isn't free at this time" : "hasn't shared availability for this day"}
                      </Box>
                    </Typography>
                    {ranges.length && !ok ? (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.4 }}>
                        {ranges.map((r) => (
                          <TimeChip key={r.id} range={r} onPick={() => onPickTime(localInputFromIst(date, r.startMin))} />
                        ))}
                      </Box>
                    ) : null}
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : null}

        {othersFree.length ? (
          <>
            <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", mb: 0.5 }}>
              {selectedIds.length ? "Also free this day" : "Free this day"}
            </Typography>
            <Box sx={{ display: "grid", gap: 0.6 }}>
              {othersFree.map((iv) => (
                <Box key={iv.id} sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", minWidth: 0 }}>
                  <Button
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: 16 }} />}
                    onClick={() => onToggle(iv.id)}
                    sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary, px: 0.75, minWidth: 0, fontSize: "0.78rem" }}
                  >
                    {iv.name}
                  </Button>
                  {freeAt(iv.id) ? (
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#047857" }}>free at this time</Typography>
                  ) : null}
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {rangesFor(iv.id, date).map((r) => (
                      <TimeChip key={r.id} range={r} onPick={() => onPickTime(localInputFromIst(date, r.startMin))} />
                    ))}
                  </Box>
                </Box>
              ))}
            </Box>
          </>
        ) : !selectedIds.length ? (
          <Typography sx={{ fontSize: "0.78rem", color: "#9ca3af" }}>No one has shared availability for this day.</Typography>
        ) : null}
      </Box>
    );
  }

  /* ---------- No date yet: upcoming free days ---------- */
  const days = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(today, i));
  const people = selectedIds.length ? selectedIds : active.map((i) => i.id);
  const rows = days
    .map((date) => {
      const free = people.filter((id) => rangesFor(id, date).length);
      const common =
        selectedIds.length > 1 && free.length === selectedIds.length
          ? selectedIds.map((id) => rangesFor(id, date)).reduce((acc, list) => intersect(acc, list))
          : null;
      return { date, free, common };
    })
    .filter((r) => r.free.length);

  return (
    <Box sx={wrapSx}>
      {header}
      {rows.length === 0 ? (
        <Typography sx={{ fontSize: "0.78rem", color: "#6b7280" }}>
          {selectedIds.length
            ? "The selected interviewers haven't shared availability for the next 3 weeks."
            : "No panel availability shared for the next 3 weeks."}{" "}
          <Link href="/admin/interviews/interviewers" style={{ color: BRAND.primary, fontWeight: 700 }}>
            Share panel links
          </Link>
        </Typography>
      ) : (
        <>
          <Typography sx={{ fontSize: "0.74rem", color: "#6b7280", mb: 1 }}>
            {selectedIds.length
              ? "Upcoming days the selected interviewers are free. Pick a time to fill in the date."
              : "Choose interviewers, or pick a time below to see who's free."}
          </Typography>
          <Box sx={{ display: "grid", gap: 1, maxHeight: 240, overflowY: "auto", pr: 0.5 }}>
            {rows.slice(0, 12).map(({ date, free, common }) => (
              <Box key={date} sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: "0.76rem", fontWeight: 800, color: "#111", mb: 0.25 }}>
                  {formatDay(date, { weekday: "short", day: "numeric", month: "short" })}
                  {selectedIds.length > 1 ? (
                    <Box component="span" sx={{ ml: 0.75, fontWeight: 600, color: common?.length ? "#047857" : "#9ca3af" }}>
                      {common?.length ? "· everyone free" : `· ${free.length} of ${selectedIds.length} free`}
                    </Box>
                  ) : null}
                </Typography>
                {common?.length ? (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {common.map((r) => (
                      <TimeChip key={r.startMin} range={r} strong onPick={() => onPickTime(localInputFromIst(date, r.startMin))} />
                    ))}
                  </Box>
                ) : (
                  <Box sx={{ display: "grid", gap: 0.35 }}>
                    {free.map((id) => (
                      <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap" }}>
                        <Typography sx={{ fontSize: "0.74rem", color: "#374151", minWidth: 110 }}>
                          {nameOf(id)}
                          {!selectedIds.includes(id) ? (
                            <Tooltip title="Add as interviewer">
                              <Box
                                component="button"
                                type="button"
                                onClick={() => onToggle(id)}
                                sx={{
                                  ml: 0.5,
                                  border: 0,
                                  bgcolor: "transparent",
                                  color: BRAND.primary,
                                  cursor: "pointer",
                                  p: 0,
                                  verticalAlign: "middle",
                                  lineHeight: 0,
                                }}
                                aria-label={`Add ${nameOf(id)}`}
                              >
                                <AddIcon sx={{ fontSize: 15 }} />
                              </Box>
                            </Tooltip>
                          ) : (
                            <CheckIcon sx={{ fontSize: 13, ml: 0.5, color: "#047857", verticalAlign: "middle" }} />
                          )}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                          {rangesFor(id, date).map((r) => (
                            <TimeChip key={r.id} range={r} onPick={() => onPickTime(localInputFromIst(date, r.startMin))} />
                          ))}
                        </Box>
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
