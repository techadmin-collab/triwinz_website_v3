"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, Box, CircularProgress, Paper, Tab, Tabs, Typography } from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import ListPagination from "../../../admin/components/ListPagination";
import { BRAND } from "../../../../lib/brand";
import { usePanel } from "../PanelShell";
import usePanelInterviews from "../usePanelInterviews";
import InterviewRow, { isUpcoming, needsFeedback } from "../InterviewRow";

const TABS = [
  { value: "upcoming", label: "Upcoming" },
  { value: "feedback", label: "Assessment needed" },
  { value: "past", label: "Past" },
  { value: "all", label: "All" },
];

export default function PanelInterviews() {
  const { token, base } = usePanel();
  const router = useRouter();
  const params = useSearchParams();
  const initial = TABS.some((t) => t.value === params.get("tab")) ? params.get("tab") : "upcoming";
  const [tab, setTab] = useState(initial);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { interviews, loading, error } = usePanelInterviews(token);

  useEffect(() => {
    setPage(1);
  }, [tab]);

  const now = new Date();
  const lists = {
    upcoming: interviews
      .filter((iv) => isUpcoming(iv, now))
      .sort((a, b) => new Date(a.scheduledAt || 8.64e15) - new Date(b.scheduledAt || 8.64e15)),
    feedback: interviews.filter((iv) => needsFeedback(iv, now)),
    past: interviews.filter((iv) => !isUpcoming(iv, now)),
    all: interviews,
  };
  const rows = lists[tab];
  const pageRows = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <Box>
      <Typography sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
        My interviews
      </Typography>
      <Typography sx={{ color: "#6b7280", fontSize: "0.92rem", mt: 0.5, mb: 2.5 }}>
        Interviews you&apos;re on the panel for. Open one to see the candidate&apos;s resume and share your assessment.
      </Typography>

      <Paper elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e8eaed", overflow: "hidden" }}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            router.replace(`${base}/interviews${v === "upcoming" ? "" : `?tab=${v}`}`, { scroll: false });
          }}
          variant="scrollable"
          allowScrollButtonsMobile
          sx={{
            px: 1,
            borderBottom: "1px solid #f1f2f4",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.86rem", minHeight: 46 },
            "& .Mui-selected": { color: `${BRAND.primary} !important` },
            "& .MuiTabs-indicator": { bgcolor: BRAND.primary, height: 3 },
          }}
        >
          {TABS.map((t) => (
            <Tab key={t.value} value={t.value} label={`${t.label} (${lists[t.value].length})`} />
          ))}
        </Tabs>

        {error ? <Alert severity="error" sx={{ m: 2 }}>{error}</Alert> : null}

        {loading ? (
          <Box sx={{ py: 6, textAlign: "center" }}>
            <CircularProgress size={26} sx={{ color: BRAND.primary }} />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ py: 6, px: 2, textAlign: "center" }}>
            <EventNoteOutlinedIcon sx={{ fontSize: 34, color: BRAND.primary, opacity: 0.6 }} />
            <Typography sx={{ mt: 1, fontWeight: 700, color: "#111" }}>
              {tab === "feedback" ? "No assessments pending" : tab === "upcoming" ? "No upcoming interviews" : "No interviews yet"}
            </Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#6b7280" }}>
              {tab === "feedback"
                ? "You're all caught up."
                : "Interviews the TriWinz team schedules with you will appear here."}
            </Typography>
          </Box>
        ) : (
          <>
            {pageRows.map((iv, i) => (
              <InterviewRow key={iv.id} iv={iv} base={base} last={i === pageRows.length - 1} />
            ))}
            <Box sx={{ px: 2, pb: 1.5 }}>
              <ListPagination
                count={rows.length}
                page={page}
                pageSize={pageSize}
                onPageChange={setPage}
                onPageSizeChange={(n) => {
                  setPageSize(n);
                  setPage(1);
                }}
              />
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
}
