"use client";

import { useEffect, useMemo, useState } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import { toast } from "react-hot-toast";
import AdminPageHeader from "../../components/AdminPageHeader";
import ListPagination from "../../components/ListPagination";
import StageChip from "../../components/interviews/StageChip";
import { formatDateTime, levelLabel } from "../../../../lib/interviews";
import { BRAND } from "../../../../lib/brand";

const TABS = [
  { value: "in_progress", label: "In progress" },
  { value: "not_scheduled", label: "Not scheduled" },
  { value: "hired", label: "Hired" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
];

export default function InterviewsPage() {
  const [items, setItems] = useState([]);
  const [interviewers, setInterviewers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("in_progress");
  const [search, setSearch] = useState("");
  const [job, setJob] = useState("all");
  const [interviewer, setInterviewer] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const UPCOMING_PER_PAGE = 6;

  // back to the first page whenever the list changes
  useEffect(() => {
    setPage(1);
    setUpcomingPage(1);
  }, [tab, search, job, interviewer, pageSize]);

  useEffect(() => {
    (async () => {
      const [res, resI] = await Promise.all([
        fetch("/api/admin/interviews"),
        fetch("/api/admin/interviewers"),
      ]);
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || "Failed to load interviews", { duration: 8000 });
        setLoading(false);
        return;
      }
      setItems((await res.json()).items || []);
      if (resI.ok) setInterviewers(await resI.json());
      setLoading(false);
    })();
  }, []);

  const jobs = useMemo(() => {
    const map = new Map();
    items.forEach((i) => map.set(i.jobSlug, i.jobTitle));
    return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter(
      (i) =>
        (job === "all" || i.jobSlug === job) &&
        (interviewer === "all" || i.interviewerIds.includes(interviewer)) &&
        (!q || `${i.fullName} ${i.email} ${i.phone}`.toLowerCase().includes(q)),
    );
  }, [items, search, job, interviewer]);

  const counts = useMemo(() => {
    const c = { all: filtered.length };
    filtered.forEach((i) => (c[i.stage.key] = (c[i.stage.key] || 0) + 1));
    return c;
  }, [filtered]);

  const visible = tab === "all" ? filtered : filtered.filter((i) => i.stage.key === tab);
  const pageRows = visible.slice((page - 1) * pageSize, page * pageSize);

  const upcoming = useMemo(() => {
    const now = Date.now() - 60 * 60 * 1000; // include ones that started in the last hour
    return filtered
      .filter(
        (i) =>
          i.stage.key === "in_progress" &&
          i.latest?.status === "scheduled" &&
          i.latest?.scheduledAt &&
          new Date(i.latest.scheduledAt).getTime() >= now,
      )
      .sort((a, b) => new Date(a.latest.scheduledAt) - new Date(b.latest.scheduledAt));
  }, [filtered]);
  const upcomingPages = Math.max(1, Math.ceil(upcoming.length / UPCOMING_PER_PAGE));
  const upcomingRows = upcoming.slice(
    (upcomingPage - 1) * UPCOMING_PER_PAGE,
    upcomingPage * UPCOMING_PER_PAGE,
  );

  return (
    <Box>
      <AdminPageHeader
        title="Interviews"
        description="Track shortlisted candidates through each interview level, from Level 1 to hire."
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
            Interview panel
          </Button>
        }
      />

      {loading ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress size={28} sx={{ color: BRAND.primary }} />
        </Box>
      ) : (
        <>
          {/* Upcoming interviews */}
          {upcoming.length ? (
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1, mb: 1.25 }}>
                <Typography sx={{ fontWeight: 800, color: "#111" }}>
                  Upcoming interviews ({upcoming.length})
                </Typography>
                {upcomingPages > 1 ? (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mr: 0.5 }}>
                      {upcomingPage} / {upcomingPages}
                    </Typography>
                    <IconButton
                      size="small"
                      aria-label="Previous"
                      disabled={upcomingPage === 1}
                      onClick={() => setUpcomingPage((p) => p - 1)}
                      sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5 }}
                    >
                      <ChevronLeftIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      aria-label="Next"
                      disabled={upcomingPage === upcomingPages}
                      onClick={() => setUpcomingPage((p) => p + 1)}
                      sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5 }}
                    >
                      <ChevronRightIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ) : null}
              </Box>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "minmax(0,1fr)", sm: "repeat(2, minmax(0,1fr))", lg: "repeat(3, minmax(0,1fr))" },
                  gap: 1.5,
                }}
              >
                {upcomingRows.map((i) => (
                  <Link key={i.id} href={`/admin/interviews/${i.id}`} style={{ textDecoration: "none", color: "inherit", minWidth: 0 }}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 1.4,
                        borderRadius: 2,
                        border: "1px solid rgba(29, 87, 88, 0.15)",
                        borderLeft: `4px solid ${BRAND.primary}`,
                        bgcolor: "#fff",
                        "&:hover": { bgcolor: "#F5FCFB" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, color: BRAND.primary, fontWeight: 800, fontSize: "0.74rem" }}>
                        <EventOutlinedIcon sx={{ fontSize: 14 }} />
                        {formatDateTime(i.latest.scheduledAt)}
                      </Box>
                      <Typography sx={{ mt: 0.4, fontWeight: 700, fontSize: "0.86rem", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {i.fullName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.74rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {levelLabel(i.latest)} · {i.latest.interviewerNames.join(", ")}
                      </Typography>
                    </Paper>
                  </Link>
                ))}
              </Box>
            </Box>
          ) : null}

          {/* Filters */}
          <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2 }, mb: 2, borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff" }}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "minmax(0,1fr)", md: "minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)" },
                gap: 1.5,
              }}
            >
              <TextField
                size="small"
                placeholder="Search name, email or phone"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
              />
              <TextField select size="small" label="Job" value={job} onChange={(e) => setJob(e.target.value)}>
                <MenuItem value="all">All jobs</MenuItem>
                {jobs.map(([slug, title]) => (
                  <MenuItem key={slug} value={slug}>{title}</MenuItem>
                ))}
              </TextField>
              <TextField select size="small" label="Interviewer" value={interviewer} onChange={(e) => setInterviewer(e.target.value)}>
                <MenuItem value="all">All interviewers</MenuItem>
                {interviewers.map((iv) => (
                  <MenuItem key={iv.id} value={iv.id}>{iv.name}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Paper>

          {/* Tabs */}
          <Box sx={{ borderBottom: "1px solid #e8eaed", mb: 2 }}>
            <Tabs
              value={tab}
              onChange={(_, v) => setTab(v)}
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
              sx={{ minHeight: 44, "& .MuiTabs-indicator": { height: 3, borderRadius: "3px 3px 0 0", backgroundColor: BRAND.primary } }}
            >
              {TABS.map((t) => (
                <Tab
                  key={t.value}
                  value={t.value}
                  disableRipple
                  label={`${t.label} (${counts[t.value] || 0})`}
                  sx={{ minHeight: 44, textTransform: "none", fontWeight: 700, color: "#6b7280", "&.Mui-selected": { color: BRAND.primary } }}
                />
              ))}
            </Tabs>
          </Box>

          {visible.length === 0 ? (
            <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff" }}>
              <PeopleAltOutlinedIcon sx={{ color: "#9ca3af", fontSize: 32, mb: 1 }} />
              <Typography sx={{ fontWeight: 700, color: "#111" }}>No candidates here</Typography>
              <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>
                Shortlist candidates from Applications to start their interviews.
              </Typography>
            </Paper>
          ) : (
            <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff", overflow: "hidden" }}>
              {pageRows.map((i, index) => (
                <Link key={i.id} href={`/admin/interviews/${i.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: { xs: "auto minmax(0,1fr) auto", md: "auto minmax(0,1.3fr) minmax(0,1.5fr) auto auto" },
                      alignItems: "center",
                      columnGap: { xs: 1.5, md: 2 },
                      rowGap: 0.75,
                      px: { xs: 1.5, sm: 2.25 },
                      py: 1.1,
                      borderBottom: index === pageRows.length - 1 ? 0 : "1px solid #f1f2f4",
                      "&:hover": { bgcolor: "#F5FCFB" },
                      "&:hover .row-arrow": { transform: "translateX(3px)", color: BRAND.primary },
                    }}
                  >
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "#E6F7F6", color: BRAND.primary, fontWeight: 800, fontSize: "0.82rem" }}>
                      {i.fullName?.[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: "0.86rem", color: "#111", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {i.fullName}
                      </Typography>
                      <Typography sx={{ fontSize: "0.74rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {i.jobTitle}
                      </Typography>
                    </Box>
                    <Box sx={{ display: { xs: "none", md: "block" }, minWidth: 0 }}>
                      {i.latest ? (
                        <>
                          <Typography sx={{ fontSize: "0.76rem", fontWeight: 600, color: "#374151", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {levelLabel(i.latest)} · {i.latest.interviewerNames.join(", ")}
                          </Typography>
                          <Typography sx={{ fontSize: "0.7rem", color: "#9ca3af" }}>
                            {i.latest.scheduledAt ? formatDateTime(i.latest.scheduledAt) : "Date not set"}
                          </Typography>
                        </>
                      ) : (
                        <Typography sx={{ fontSize: "0.74rem", color: "#9ca3af" }}>No interviews scheduled</Typography>
                      )}
                    </Box>
                    <Box sx={{ justifySelf: "end" }}>
                      <StageChip label={i.stage.label} color={i.stage.color} bg={i.stage.bg} size="sm" />
                    </Box>
                    <ArrowForwardIcon className="row-arrow" sx={{ display: { xs: "none", md: "block" }, fontSize: 16, color: "#9ca3af", transition: "transform 0.2s ease" }} />
                  </Box>
                </Link>
              ))}
              <ListPagination
                count={visible.length}
                page={page}
                pageSize={pageSize}
                onPageChange={(p) => {
                  setPage(p);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                onPageSizeChange={setPageSize}
              />
            </Paper>
          )}
        </>
      )}
    </Box>
  );
}
