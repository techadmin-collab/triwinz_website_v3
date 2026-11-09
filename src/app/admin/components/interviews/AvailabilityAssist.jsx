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
import EventIcon from "@mui/icons-material/Event";
import { BRAND } from "../../../../lib/brand";
import { toLocalInput } from "../../../../lib/interviews";
import {
  AVAILABILITY_TZ,
  INTERVIEW_MINUTES,
  addDays,
  formatDay,
  formatRange,
  slotsOf,
  todayKey,
} from "../../../../lib/availability";

const WINDOW_DAYS = 21;

/** <input type="datetime-local"> value -> { date: "YYYY-MM-DD", min } in India time */
export function istPartsFromLocalInput(value) {
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

function SlotChip({ slot, selected, strong, onPick }) {
  return (
    <Tooltip title={selected ? "Selected · click again to clear" : "Book this slot"}>
      <Chip
        size="small"
        icon={selected ? <CheckIcon sx={{ fontSize: "14px !important" }} /> : undefined}
        label={formatRange(slot.startMin, slot.endMin)}
        onClick={onPick}
        sx={{
          height: 24,
          fontSize: "0.7rem",
          fontWeight: 700,
          border: "2px solid",
          borderColor: selected ? "#F59E0B" : "transparent",
          bgcolor: selected ? BRAND.primary : strong ? "#cdeeed" : "#E6F7F6",
          color: selected ? "#fff" : BRAND.primary,
          boxShadow: selected ? "0 0 0 3px rgba(245, 158, 11, 0.25)" : "none",
          "& .MuiChip-icon": { color: "#fff", ml: 0.5 },
          "&:hover": { bgcolor: selected ? BRAND.primaryDark : "#d3f1ef" },
        }}
      />
    </Tooltip>
  );
}

/**
 * Pick an interview time from the panel's 1-hour availability slots (times in IST).
 * Props: interviewers, selectedIds, scheduledAt (datetime-local value),
 *        onToggle(id) (add/remove an interviewer), onPickTime(localValue | "")
 */
export default function AvailabilityAssist({ interviewers, selectedIds, scheduledAt, onToggle, onPickTime }) {
  const [slots, setSlots] = useState([]); // [{ interviewerId, date, startMin, endMin }]
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const loaded = useRef(new Set());
  const selectedRef = useRef(null);

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
      setSlots((prev) => [...prev.filter((s) => s.date < from || s.date > to), ...json.slots]);
    } catch {
      loaded.current.delete(key);
      setFailed(true);
    }
  }

  useEffect(() => {
    setLoading(true);
    fetchWindow(today, addDays(today, WINDOW_DAYS - 1)).finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // a saved time outside the next few weeks (e.g. editing an older level)
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
  const isSelected = (date, slot) => Boolean(chosen && chosen.date === date && chosen.min === slot.startMin);
  const pick = (date, slot) => onPickTime(isSelected(date, slot) ? "" : localInputFromIst(date, slot.startMin));
  const freeAt = (id, date, min) =>
    rangesFor(id, date).some((r) => min >= r.startMin && min + INTERVIEW_MINUTES <= r.endMin);

  // keep the selected slot in view when the dialog opens with a time
  useEffect(() => {
    if (!loading) selectedRef.current?.scrollIntoView({ block: "nearest" });
  }, [loading]);

  const wrapSx = { p: 1.5, borderRadius: 2, border: "1px solid #dcefed", bgcolor: "#F7FCFB" };
  const header = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 1, flexWrap: "wrap" }}>
      <EventAvailableOutlinedIcon sx={{ fontSize: 18, color: BRAND.primary }} />
      <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: "#111" }}>Book an interview slot</Typography>
      <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>· 1-hour slots in IST</Typography>
    </Box>
  );

  /* ---------- the selected slot ---------- */
  const summary = chosen ? (
    <Box
      sx={{
        mb: 1.25,
        p: 1.25,
        borderRadius: 1.5,
        bgcolor: "#fff",
        border: "2px solid #F59E0B",
        boxShadow: "0 0 0 3px rgba(245, 158, 11, 0.12)",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <EventIcon sx={{ fontSize: 18, color: BRAND.primary }} />
        <Typography sx={{ fontWeight: 800, fontSize: "0.86rem", color: "#111" }}>
          {formatDay(chosen.date, { weekday: "short", day: "numeric", month: "short", year: "numeric" })} ·{" "}
          {formatRange(chosen.min, chosen.min + INTERVIEW_MINUTES)} IST
        </Typography>
        <Button
          size="small"
          onClick={() => onPickTime("")}
          sx={{ ml: "auto", textTransform: "none", fontWeight: 700, color: "#6b7280", minWidth: 0, px: 1 }}
        >
          Clear
        </Button>
      </Box>
      {selectedIds.length ? (
        <Box sx={{ display: "grid", gap: 0.4, mt: 0.75 }}>
          {selectedIds.map((id) => {
            const ok = freeAt(id, chosen.date, chosen.min);
            const shared = rangesFor(id, chosen.date).length > 0;
            const Icon = ok ? CheckCircleIcon : shared ? ErrorOutlineIcon : HelpOutlineIcon;
            const color = ok ? "#047857" : shared ? "#B45309" : "#9ca3af";
            return (
              <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                <Icon sx={{ fontSize: 16, color }} />
                <Typography sx={{ fontSize: "0.78rem", color: "#111" }}>
                  <strong>{nameOf(id)}</strong>{" "}
                  <Box component="span" sx={{ color }}>
                    {ok ? "is free" : shared ? "isn't free for the full hour" : "hasn't shared availability for this day"}
                  </Box>
                </Typography>
              </Box>
            );
          })}
        </Box>
      ) : (
        <Typography sx={{ mt: 0.5, fontSize: "0.78rem", color: "#B45309" }}>Now choose the interviewers above.</Typography>
      )}
    </Box>
  ) : null;

  if (loading) {
    return (
      <Box sx={{ ...wrapSx, display: "flex", alignItems: "center", gap: 1 }}>
        <CircularProgress size={16} sx={{ color: BRAND.primary }} />
        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>Loading panel availability…</Typography>
      </Box>
    );
  }

  /* ---------- upcoming days with free slots ---------- */
  const people = selectedIds.length ? selectedIds : active.map((i) => i.id);
  const dayKeys = Array.from({ length: WINDOW_DAYS }, (_, i) => addDays(today, i));
  if (chosen && !dayKeys.includes(chosen.date)) dayKeys.push(chosen.date);
  dayKeys.sort();

  const rows = dayKeys
    .map((date) => {
      const free = people.filter((id) => slotsOf(rangesFor(id, date)).length);
      const common =
        selectedIds.length > 1 && free.length === selectedIds.length
          ? selectedIds.map((id) => rangesFor(id, date)).reduce((acc, list) => intersect(acc, list))
          : null;
      return { date, free, commonSlots: common ? slotsOf(common) : [] };
    })
    .filter((r) => r.free.length || (chosen && chosen.date === r.date));

  return (
    <Box sx={wrapSx}>
      {header}
      {summary}

      {failed && slots.length === 0 ? (
        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
          Panel availability couldn&apos;t be loaded. Use &quot;set a time manually&quot; below.
        </Typography>
      ) : rows.length === 0 ? (
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
            {selectedIds.length > 1
              ? "Darker slots are when everyone selected is free. Click a slot to book it."
              : selectedIds.length
                ? "Click a slot to book it."
                : "Click a slot to book it, and use + to add that person as an interviewer."}
          </Typography>
          <Box sx={{ display: "grid", gap: 1.25, maxHeight: 280, overflowY: "auto", pr: 0.5 }}>
            {rows.map(({ date, free, commonSlots }) => {
              const isChosenDay = chosen && chosen.date === date;
              return (
                <Box
                  key={date}
                  sx={{
                    minWidth: 0,
                    p: isChosenDay ? 1 : 0,
                    borderRadius: 1.5,
                    bgcolor: isChosenDay ? "#FFFBEB" : "transparent",
                  }}
                >
                  <Typography sx={{ fontSize: "0.76rem", fontWeight: 800, color: "#111", mb: 0.4 }}>
                    {formatDay(date, { weekday: "short", day: "numeric", month: "short" })}
                    {selectedIds.length > 1 ? (
                      <Box component="span" sx={{ ml: 0.75, fontWeight: 600, color: commonSlots.length ? "#047857" : "#9ca3af" }}>
                        {commonSlots.length ? "· everyone free" : `· ${free.length} of ${selectedIds.length} free`}
                      </Box>
                    ) : null}
                  </Typography>

                  {commonSlots.length ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {commonSlots.map((slot) => (
                        <Box key={slot.startMin} ref={isSelected(date, slot) ? selectedRef : undefined} component="span">
                          <SlotChip slot={slot} strong selected={isSelected(date, slot)} onPick={() => pick(date, slot)} />
                        </Box>
                      ))}
                    </Box>
                  ) : free.length ? (
                    <Box sx={{ display: "grid", gap: 0.4 }}>
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
                                  sx={{ ml: 0.5, border: 0, bgcolor: "transparent", color: BRAND.primary, cursor: "pointer", p: 0, verticalAlign: "middle", lineHeight: 0 }}
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
                            {slotsOf(rangesFor(id, date)).map((slot) => (
                              <Box key={slot.startMin} ref={isSelected(date, slot) ? selectedRef : undefined} component="span">
                                <SlotChip slot={slot} selected={isSelected(date, slot)} onPick={() => pick(date, slot)} />
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography sx={{ fontSize: "0.74rem", color: "#9ca3af" }}>No one has shared availability for this day.</Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        </>
      )}
    </Box>
  );
}
