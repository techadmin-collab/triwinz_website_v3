"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { toast } from "react-hot-toast";
import {
  TZ_LABEL,
  addDays,
  formatDay,
  formatRange,
  keyToDate,
  minutesToTime,
  normalizeRanges,
  timeToMinutes,
  weekStart,
} from "../../../../lib/availability";
import { usePanel } from "../PanelShell";

const PRIMARY = "#1D5758";
const PRIMARY_DARK = "#164546";
const ACCENT = "#2BD1C7";
const TINT = "#E6F7F6";

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const PRESETS = [
  { label: "Morning", start: "09:00", end: "12:00" },
  { label: "Afternoon", start: "13:00", end: "17:00" },
  { label: "Evening", start: "17:00", end: "20:00" },
  { label: "Full day", start: "09:00", end: "18:00" },
];

function monthKeyOf(dateKey) {
  return `${dateKey.slice(0, 7)}-01`;
}

function shiftMonth(monthKey, delta) {
  const d = keyToDate(monthKey);
  d.setUTCMonth(d.getUTCMonth() + delta);
  return d.toISOString().slice(0, 10);
}

function toDraft(slots = []) {
  return slots.map((s) => ({ start: minutesToTime(s.startMin), end: minutesToTime(s.endMin % 1440) }));
}

function sameRanges(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function PanelAvailability() {
  const { token, me, refresh } = usePanel();
  const [loading, setLoading] = useState(true);
  const [invalid, setInvalid] = useState("");
  const [data, setData] = useState(null); // { today, maxDate, slots }
  const [month, setMonth] = useState(null);
  const [selected, setSelected] = useState(null);
  const [draft, setDraft] = useState([]);
  const [saving, setSaving] = useState(false);

  const slotsByDate = useMemo(() => {
    const map = new Map();
    (data?.slots || []).forEach((s) => {
      if (!map.has(s.date)) map.set(s.date, []);
      map.get(s.date).push(s);
    });
    return map;
  }, [data]);

  const saved = useMemo(() => toDraft(selected ? slotsByDate.get(selected) : []), [selected, slotsByDate]);
  const dirty = Boolean(selected) && !sameRanges(draft, saved);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/panel/${encodeURIComponent(token)}/availability`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setInvalid(json.error || "This link is no longer valid.");
        return;
      }
      setData(json);
      setMonth((m) => m || monthKeyOf(json.today));
      setSelected((s) => s || json.today);
    } catch {
      setInvalid("We couldn't load this page. Please check your connection and refresh.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  // load the chosen day's saved times into the editor
  useEffect(() => {
    setDraft(saved);
  }, [saved]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return undefined;
    const handler = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [dirty]);

  function pickDay(key) {
    if (key === selected) return;
    if (dirty && !window.confirm("You have unsaved changes for this day. Discard them?")) return;
    setSelected(key);
    setMonth(monthKeyOf(key));
  }

  function updateRow(index, field, value) {
    setDraft((rows) => rows.map((r, i) => (i === index ? { ...r, [field]: value } : r)));
  }

  function addRow(start, end) {
    setDraft((rows) => {
      if (start && end) return [...rows, { start, end }];
      const last = rows[rows.length - 1];
      if (!last) return [...rows, { start: "10:00", end: "11:00" }];
      const [h, m] = last.end.split(":").map(Number);
      const s = Math.min(h * 60 + m, 22 * 60);
      return [...rows, { start: minutesToTime(s), end: minutesToTime(Math.min(s + 60, 23 * 60 + 45)) }];
    });
  }

  async function save(rows = draft) {
    const check = normalizeRanges(rows);
    if (check.error) {
      toast.error(check.error);
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/panel/${encodeURIComponent(token)}/availability`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ date: selected, ranges: rows }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save. Please try again.");
      setData((d) => ({ ...d, slots: json.slots }));
      refresh();
      toast.success(rows.length ? "Availability saved" : "Day cleared");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading && !data) {
    return (
      <Box>
        <Box sx={{ py: 12, display: "grid", placeItems: "center" }}>
          <CircularProgress size={30} sx={{ color: PRIMARY }} />
        </Box>
      </Box>
    );
  }

  if (invalid) {
    return (
      <Paper elevation={0} sx={{ p: 4, textAlign: "center", borderRadius: 3, border: "1px solid #e5eaea" }}>
        <Typography sx={{ color: "#6b7280" }}>{invalid}</Typography>
      </Paper>
    );
  }

  const { today, maxDate } = data;
  const firstOfMonth = month;
  const gridStart = weekStart(firstOfMonth);
  const nextMonth = shiftMonth(firstOfMonth, 1);
  const cells = [];
  for (let i = 0; i < 42; i += 1) {
    const key = addDays(gridStart, i);
    if (i >= 35 && key >= nextMonth) break; // drop an all-next-month last row
    cells.push(key);
  }
  const canPrev = firstOfMonth > monthKeyOf(today);
  const canNext = nextMonth <= maxDate;
  const monthLabel = keyToDate(firstOfMonth).toLocaleDateString("en-GB", { timeZone: "UTC", month: "long", year: "numeric" });

  const upcomingDates = [...slotsByDate.keys()].sort();
  const selectedEditable = selected && selected >= today && selected <= maxDate;

  return (
    <Box>
      <Typography sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
        When are you free to take interviews, {me.name.split(" ")[0]}?
      </Typography>
      <Typography sx={{ mt: 0.75, color: "#4b5563", fontSize: "0.92rem", maxWidth: 680 }}>
        Pick a date, add the times you&apos;re available and press <strong>Save</strong>. You can come back to this
        link any time to update it. All times are India Standard Time ({TZ_LABEL}).
      </Typography>

      <Box
        sx={{
          mt: 3,
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 1.1fr) minmax(0, 1fr)" },
          alignItems: "start",
        }}
      >
        {/* Calendar */}
        <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.25 }, borderRadius: 3, border: "1px solid #e5eaea", minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
            <IconButton size="small" disabled={!canPrev} onClick={() => setMonth(shiftMonth(firstOfMonth, -1))} aria-label="Previous month">
              <ChevronLeftIcon />
            </IconButton>
            <Typography sx={{ flex: 1, textAlign: "center", fontWeight: 800, color: "#111" }}>{monthLabel}</Typography>
            <IconButton size="small" disabled={!canNext} onClick={() => setMonth(nextMonth)} aria-label="Next month">
              <ChevronRightIcon />
            </IconButton>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, minmax(0, 1fr))", gap: { xs: 0.5, sm: 0.75 } }}>
            {WEEKDAYS.map((d) => (
              <Typography key={d} sx={{ textAlign: "center", fontSize: "0.72rem", fontWeight: 700, color: "#6b7280", pb: 0.5 }}>
                {d}
              </Typography>
            ))}
            {cells.map((key) => {
              const inMonth = key.slice(0, 7) === firstOfMonth.slice(0, 7);
              const disabled = key < today || key > maxDate;
              const has = slotsByDate.has(key);
              const isSel = key === selected;
              const isToday = key === today;
              return (
                <Box
                  key={key}
                  component="button"
                  type="button"
                  disabled={disabled}
                  onClick={() => pickDay(key)}
                  aria-label={`${formatDay(key)}${has ? ", available" : ""}`}
                  aria-pressed={isSel}
                  sx={{
                    position: "relative",
                    aspectRatio: "1 / 1",
                    minHeight: 38,
                    border: isSel ? `2px solid ${PRIMARY}` : "1px solid transparent",
                    borderRadius: 2,
                    bgcolor: has ? TINT : "transparent",
                    color: disabled ? "#c4c9cf" : inMonth ? "#111" : "#9ca3af",
                    fontWeight: isToday || has ? 800 : 500,
                    fontSize: "0.88rem",
                    fontFamily: "inherit",
                    cursor: disabled ? "default" : "pointer",
                    transition: "background-color .15s",
                    "&:hover:not(:disabled)": { bgcolor: has ? "#d3f1ef" : "#f3f5f5" },
                    "&:focus-visible": { outline: `2px solid ${ACCENT}`, outlineOffset: 1 },
                  }}
                >
                  {Number(key.slice(8))}
                  {has ? (
                    <Box
                      component="span"
                      sx={{ position: "absolute", left: "50%", bottom: 5, transform: "translateX(-50%)", width: 14, height: 3, borderRadius: 2, bgcolor: ACCENT }}
                    />
                  ) : null}
                  {isToday ? (
                    <Box component="span" sx={{ position: "absolute", top: 4, right: 5, width: 5, height: 5, borderRadius: "50%", bgcolor: PRIMARY }} />
                  ) : null}
                </Box>
              );
            })}
          </Box>
          <Box sx={{ mt: 1.5, display: "flex", gap: 2, flexWrap: "wrap", fontSize: "0.72rem", color: "#6b7280" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 14, height: 14, borderRadius: 1, bgcolor: TINT, borderBottom: `3px solid ${ACCENT}` }} />
              You&apos;re available
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
              <Box sx={{ width: 6, height: 6, borderRadius: "50%", bgcolor: PRIMARY }} />
              Today
            </Box>
          </Box>
        </Paper>

        {/* Day editor */}
        <Paper elevation={0} sx={{ p: { xs: 1.75, sm: 2.25 }, borderRadius: 3, border: "1px solid #e5eaea", minWidth: 0 }}>
          {selectedEditable ? (
            <>
              <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, color: PRIMARY, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Your times
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: "1.05rem", color: "#111", mb: 1.5 }}>{formatDay(selected)}</Typography>

              {draft.length === 0 ? (
                <Typography sx={{ color: "#6b7280", fontSize: "0.88rem", mb: 1.5 }}>
                  No times added for this day. Add a time range or use a quick option below.
                </Typography>
              ) : (
                <Box sx={{ display: "grid", gap: 1.25, mb: 1.5 }}>
                  {draft.map((row, i) => (
                    <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1, minWidth: 0 }}>
                      <TextField
                        type="time"
                        size="small"
                        label="From"
                        value={row.start}
                        onChange={(e) => updateRow(i, "start", e.target.value)}
                        inputProps={{ step: 900 }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1, minWidth: 0 }}
                      />
                      <Typography sx={{ color: "#9ca3af" }}>–</Typography>
                      <TextField
                        type="time"
                        size="small"
                        label="To"
                        value={row.end}
                        onChange={(e) => updateRow(i, "end", e.target.value)}
                        inputProps={{ step: 900 }}
                        InputLabelProps={{ shrink: true }}
                        sx={{ flex: 1, minWidth: 0 }}
                      />
                      <Tooltip title="Remove">
                        <IconButton
                          size="small"
                          onClick={() => setDraft((rows) => rows.filter((_, j) => j !== i))}
                          sx={{ color: "#9ca3af", "&:hover": { color: "#dc2626" } }}
                          aria-label="Remove time range"
                        >
                          <DeleteOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  ))}
                </Box>
              )}

              <Button
                startIcon={<AddIcon />}
                onClick={() => addRow()}
                sx={{ textTransform: "none", fontWeight: 700, color: PRIMARY, px: 1, mb: 1.5 }}
              >
                Add time range
              </Button>

              <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mb: 0.75 }}>Quick add</Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, mb: 2.5 }}>
                {PRESETS.map((p) => (
                  <Chip
                    key={p.label}
                    label={`${p.label} · ${formatRange(timeToMinutes(p.start), timeToMinutes(p.end))}`}
                    onClick={() => addRow(p.start, p.end)}
                    size="small"
                    variant="outlined"
                    sx={{ borderColor: "rgba(29, 87, 88, 0.3)", color: PRIMARY, fontWeight: 600, fontSize: "0.72rem" }}
                  />
                ))}
              </Box>

              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "center" }}>
                <Button
                  variant="contained"
                  disableElevation
                  disabled={!dirty || saving}
                  onClick={() => save()}
                  sx={{
                    textTransform: "none",
                    fontWeight: 800,
                    px: 3,
                    bgcolor: PRIMARY,
                    "&:hover": { bgcolor: PRIMARY_DARK },
                  }}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                {dirty ? (
                  <Button onClick={() => setDraft(saved)} disabled={saving} sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}>
                    Discard changes
                  </Button>
                ) : null}
                {saved.length > 0 && !dirty ? (
                  <Button
                    onClick={() => {
                      setDraft([]);
                      save([]);
                    }}
                    disabled={saving}
                    sx={{ textTransform: "none", fontWeight: 600, color: "#b91c1c", ml: "auto" }}
                  >
                    Clear this day
                  </Button>
                ) : null}
              </Box>
              {dirty ? (
                <Typography sx={{ mt: 1, fontSize: "0.75rem", color: "#b45309" }}>You have unsaved changes.</Typography>
              ) : null}
            </>
          ) : (
            <Typography sx={{ color: "#6b7280" }}>Choose a date on the calendar.</Typography>
          )}
        </Paper>
      </Box>

      {/* Everything they've shared */}
      <Paper elevation={0} sx={{ mt: 2.5, p: { xs: 1.75, sm: 2.25 }, borderRadius: 3, border: "1px solid #e5eaea" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          <EventAvailableOutlinedIcon sx={{ color: PRIMARY, fontSize: 20 }} />
          <Typography sx={{ fontWeight: 800, color: "#111" }}>Your upcoming availability</Typography>
        </Box>
        {upcomingDates.length === 0 ? (
          <Typography sx={{ color: "#6b7280", fontSize: "0.88rem" }}>Nothing shared yet.</Typography>
        ) : (
          <Box sx={{ display: "grid", gap: 0.5 }}>
            {upcomingDates.map((key) => (
              <Box
                key={key}
                component="button"
                type="button"
                onClick={() => pickDay(key)}
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "center",
                  gap: 1,
                  textAlign: "left",
                  p: 1,
                  border: 0,
                  borderRadius: 1.5,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  bgcolor: key === selected ? TINT : "transparent",
                  "&:hover": { bgcolor: key === selected ? TINT : "#f6f8f8" },
                }}
              >
                <Typography sx={{ minWidth: 150, fontWeight: 700, fontSize: "0.85rem", color: "#111" }}>
                  {formatDay(key, { weekday: "short", day: "numeric", month: "short" })}
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {slotsByDate.get(key).map((s) => (
                    <Chip
                      key={`${s.startMin}-${s.endMin}`}
                      size="small"
                      label={formatRange(s.startMin, s.endMin)}
                      sx={{ bgcolor: TINT, color: PRIMARY, fontWeight: 700, fontSize: "0.72rem" }}
                    />
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <Typography sx={{ mt: 3, textAlign: "center", fontSize: "0.75rem", color: "#9ca3af" }}>
        This page is private to you. Please don&apos;t share the link.
      </Typography>
    </Box>
  );
}
