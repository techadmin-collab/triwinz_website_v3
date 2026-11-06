"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AdminPageHeader from "../../../components/AdminPageHeader";
import { BRAND } from "../../../../../lib/brand";
import {
  TZ_LABEL,
  addDays,
  formatDay,
  formatRange,
  todayKey,
  weekStart,
} from "../../../../../lib/availability";

function weekLabel(from) {
  const to = addDays(from, 6);
  const a = formatDay(from, { day: "numeric", month: "short" });
  const b = formatDay(to, { day: "numeric", month: "short", year: "numeric" });
  return `${a} – ${b}`;
}

function linkStatus(iv) {
  if (!iv.hasLink) return { label: "No link", color: "#6b7280", bg: "#f3f4f6" };
  if (iv.portalSeenAt) {
    return {
      label: `Opened ${new Date(iv.portalSeenAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`,
      color: "#047857",
      bg: "#D1FAE5",
    };
  }
  if (iv.portalSentAt) return { label: "Emailed, not opened", color: "#B45309", bg: "#FEF3C7" };
  return { label: "Link not opened", color: "#B45309", bg: "#FEF3C7" };
}

export default function PanelAvailabilityPage() {
  const [from, setFrom] = useState(() => weekStart(todayKey()));
  const [filter, setFilter] = useState("all");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const qs = new URLSearchParams({ from, to: addDays(from, 6) });
      if (filter !== "all") qs.set("interviewerId", filter);
      const res = await fetch(`/api/admin/interviewers/availability?${qs}`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to load availability");
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [from, filter]);

  useEffect(() => {
    load();
  }, [load]);

  const today = data?.today || todayKey();
  const days = useMemo(() => Array.from({ length: 7 }, (_, i) => addDays(from, i)), [from]);

  // date -> [{ interviewerId, name, ranges: [] }]
  const byDay = useMemo(() => {
    const map = new Map(days.map((d) => [d, new Map()]));
    (data?.slots || []).forEach((s) => {
      const day = map.get(s.date);
      if (!day) return;
      if (!day.has(s.interviewerId)) day.set(s.interviewerId, { interviewerId: s.interviewerId, name: s.interviewerName, ranges: [] });
      day.get(s.interviewerId).ranges.push(s);
    });
    return map;
  }, [data, days]);

  const weekCounts = useMemo(() => {
    const counts = new Map();
    (data?.slots || []).forEach((s) => counts.set(s.interviewerId, (counts.get(s.interviewerId) || 0) + 1));
    return counts;
  }, [data]);

  const interviewers = data?.interviewers || [];
  const activeInterviewers = interviewers.filter((i) => i.active);
  const totalPeople = new Set((data?.slots || []).map((s) => s.interviewerId)).size;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Button
        component={Link}
        href="/admin/interviews"
        startIcon={<ArrowBackIcon />}
        sx={{ px: 0, mb: 2, textTransform: "none", fontWeight: 600, color: "#6b7280", "&:hover": { bgcolor: "transparent", color: "#111" } }}
      >
        Interviews
      </Button>
      <AdminPageHeader
        title="Panel availability"
        description={`When your interview panel is free, from their private links. Times are ${TZ_LABEL}.`}
        action={
          <Button
            component={Link}
            href="/admin/interviews/interviewers"
            startIcon={<BadgeOutlinedIcon />}
            sx={{
              textTransform: "none",
              fontWeight: 700,
              color: BRAND.primary,
              border: "1px solid rgba(29, 87, 88, 0.25)",
              px: 2,
              "&:hover": { bgcolor: "#E6F7F6" },
            }}
          >
            Share links
          </Button>
        }
      />

      {/* Controls */}
      <Paper
        elevation={0}
        sx={{
          p: 1.25,
          mb: 2,
          borderRadius: 2,
          border: "1px solid #e8eaed",
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <IconButton size="small" onClick={() => setFrom(addDays(from, -7))} aria-label="Previous week">
          <ChevronLeftIcon />
        </IconButton>
        <Typography sx={{ fontWeight: 800, fontSize: "0.92rem", color: "#111", minWidth: 170, textAlign: "center" }}>
          {weekLabel(from)}
        </Typography>
        <IconButton size="small" onClick={() => setFrom(addDays(from, 7))} aria-label="Next week">
          <ChevronRightIcon />
        </IconButton>
        {from !== weekStart(today) ? (
          <Button size="small" onClick={() => setFrom(weekStart(today))} sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary }}>
            This week
          </Button>
        ) : null}
        <Box sx={{ flex: 1 }} />
        <Select
          size="small"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          sx={{ minWidth: 200, fontSize: "0.85rem", bgcolor: "#fff" }}
        >
          <MenuItem value="all">All panel members</MenuItem>
          {interviewers.map((iv) => (
            <MenuItem key={iv.id} value={iv.id}>
              {iv.name}
              {!iv.active ? " (inactive)" : ""}
            </MenuItem>
          ))}
        </Select>
      </Paper>

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {loading && !data ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress size={28} sx={{ color: BRAND.primary }} />
        </Box>
      ) : (
        <>
          <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 1 }}>
            {totalPeople
              ? `${totalPeople} panel member${totalPeople === 1 ? "" : "s"} shared availability this week`
              : "No availability shared for this week yet"}
          </Typography>

          {/* Week */}
          <Box
            sx={{
              display: "grid",
              gap: 1,
              gridTemplateColumns: {
                xs: "minmax(0, 1fr)",
                sm: "repeat(2, minmax(0, 1fr))",
                lg: "repeat(7, minmax(0, 1fr))",
              },
              opacity: loading ? 0.6 : 1,
              transition: "opacity .15s",
            }}
          >
            {days.map((day) => {
              const people = [...(byDay.get(day)?.values() || [])].sort((a, b) => a.name.localeCompare(b.name));
              const isToday = day === today;
              const past = day < today;
              return (
                <Paper
                  key={day}
                  elevation={0}
                  sx={{
                    borderRadius: 2,
                    border: isToday ? `2px solid ${BRAND.primary}` : "1px solid #e8eaed",
                    bgcolor: past ? "#fafafa" : "#fff",
                    minWidth: 0,
                    minHeight: { lg: 220 },
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box sx={{ px: 1.25, py: 1, borderBottom: "1px solid #f1f2f4", display: "flex", alignItems: "baseline", gap: 0.75 }}>
                    <Typography sx={{ fontWeight: 800, fontSize: "0.82rem", color: past ? "#9ca3af" : "#111" }}>
                      {formatDay(day, { weekday: "short" })}
                    </Typography>
                    <Typography sx={{ fontSize: "0.78rem", color: past ? "#9ca3af" : "#6b7280" }}>
                      {formatDay(day, { day: "numeric", month: "short" })}
                    </Typography>
                    {isToday ? (
                      <Typography sx={{ ml: "auto", fontSize: "0.62rem", fontWeight: 800, color: BRAND.primary }}>TODAY</Typography>
                    ) : null}
                  </Box>
                  <Box sx={{ p: 1, display: "grid", gap: 1, alignContent: "start", flex: 1 }}>
                    {people.length === 0 ? (
                      <Typography sx={{ fontSize: "0.75rem", color: "#c4c9cf", px: 0.25 }}>No one available</Typography>
                    ) : (
                      people.map((p) => (
                        <Box key={p.interviewerId} sx={{ minWidth: 0, opacity: past ? 0.6 : 1 }}>
                          {filter === "all" ? (
                            <Typography
                              sx={{ fontSize: "0.74rem", fontWeight: 700, color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                              title={p.name}
                            >
                              {p.name}
                            </Typography>
                          ) : null}
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 0.25 }}>
                            {p.ranges.map((r) => (
                              <Chip
                                key={r.id}
                                size="small"
                                label={formatRange(r.startMin, r.endMin)}
                                sx={{
                                  height: 22,
                                  bgcolor: "#E6F7F6",
                                  color: BRAND.primary,
                                  fontWeight: 700,
                                  fontSize: "0.68rem",
                                  maxWidth: "100%",
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                      ))
                    )}
                  </Box>
                </Paper>
              );
            })}
          </Box>

          {/* Who has shared */}
          <Paper elevation={0} sx={{ mt: 2.5, borderRadius: 2, border: "1px solid #e8eaed", overflow: "hidden" }}>
            <Box sx={{ px: 2, py: 1.25, borderBottom: "1px solid #f1f2f4" }}>
              <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#111" }}>Panel members</Typography>
              <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                Who has their link and how many time ranges they shared for this week.
              </Typography>
            </Box>
            {activeInterviewers.length === 0 ? (
              <Typography sx={{ p: 2, fontSize: "0.85rem", color: "#6b7280" }}>No active panel members yet.</Typography>
            ) : (
              activeInterviewers.map((iv, idx) => {
                const st = linkStatus(iv);
                const count = weekCounts.get(iv.id) || 0;
                return (
                  <Box
                    key={iv.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      px: 2,
                      py: 1,
                      borderBottom: idx === activeInterviewers.length - 1 ? 0 : "1px solid #f1f2f4",
                      minWidth: 0,
                    }}
                  >
                    <Avatar sx={{ width: 28, height: 28, fontSize: "0.75rem", bgcolor: "#E6F7F6", color: BRAND.primary, fontWeight: 800 }}>
                      {iv.name?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.84rem", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {iv.name}
                      </Typography>
                      <Typography sx={{ fontSize: "0.72rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {[iv.designation, iv.company].filter(Boolean).join(" · ") || "—"}
                      </Typography>
                    </Box>
                    <Chip size="small" label={st.label} sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, color: st.color, bgcolor: st.bg }} />
                    <Tooltip title="Time ranges this week">
                      <Typography
                        sx={{ width: 44, textAlign: "right", fontSize: "0.8rem", fontWeight: 800, color: count ? BRAND.primary : "#c4c9cf" }}
                      >
                        {count}
                      </Typography>
                    </Tooltip>
                  </Box>
                );
              })
            )}
          </Paper>
        </>
      )}
    </Box>
  );
}
