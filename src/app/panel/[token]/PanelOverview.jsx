"use client";

import Link from "next/link";
import { Alert, Box, Button, CircularProgress, Paper, Typography } from "@mui/material";
import EventNoteOutlinedIcon from "@mui/icons-material/EventNoteOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { BRAND, brandButtonSx } from "../../../lib/brand";
import { usePanel } from "./PanelShell";
import usePanelInterviews from "./usePanelInterviews";
import InterviewRow, { isUpcoming, needsFeedback } from "./InterviewRow";

function Stat({ icon: Icon, label, value, hint, href, highlight }) {
  return (
    <Paper
      component={Link}
      href={href}
      elevation={0}
      sx={{
        p: { xs: 1.75, sm: 2.25 },
        borderRadius: 2.5,
        border: "1px solid",
        borderColor: highlight ? "rgba(180, 83, 9, 0.35)" : "#e8eaed",
        bgcolor: highlight ? "#FFFBEB" : "#fff",
        textDecoration: "none",
        color: "inherit",
        minWidth: 0,
        transition: "box-shadow .15s",
        "&:hover": { boxShadow: "0 6px 18px rgba(29, 87, 88, 0.08)" },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
        <Box sx={{ width: 34, height: 34, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: highlight ? "#FEF3C7" : "#E6F7F6" }}>
          <Icon sx={{ fontSize: 19, color: highlight ? "#B45309" : BRAND.primary }} />
        </Box>
        <Typography sx={{ fontSize: "0.8rem", fontWeight: 700, color: "#4b5563" }}>{label}</Typography>
      </Box>
      <Typography sx={{ fontSize: "1.9rem", fontWeight: 800, color: "#111", lineHeight: 1.1 }}>{value}</Typography>
      <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mt: 0.25 }}>{hint}</Typography>
    </Paper>
  );
}

function Section({ title, action, children }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e8eaed", overflow: "hidden", minWidth: 0 }}>
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f2f4" }}>
        <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#111" }}>{title}</Typography>
        {action}
      </Box>
      {children}
    </Paper>
  );
}

export default function PanelOverview() {
  const { token, base, me, counts } = usePanel();
  const { interviews, loading, error } = usePanelInterviews(token);

  const now = new Date();
  const upcoming = interviews
    .filter((iv) => isUpcoming(iv, now))
    .sort((a, b) => new Date(a.scheduledAt || 8.64e15) - new Date(b.scheduledAt || 8.64e15))
    .slice(0, 5);
  const waiting = interviews.filter((iv) => needsFeedback(iv, now));

  return (
    <Box>
      <Typography sx={{ fontSize: { xs: "1.4rem", md: "1.7rem" }, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
        Welcome, {me.name.split(" ")[0]}
      </Typography>
      <Typography sx={{ color: "#6b7280", fontSize: "0.92rem", mt: 0.5, mb: 3 }}>
        Your interviews with TriWinz, assessments to share and the times you&apos;re free.
      </Typography>

      <Box
        sx={{
          display: "grid",
          gap: { xs: 1.25, sm: 2 },
          gridTemplateColumns: { xs: "minmax(0, 1fr)", sm: "repeat(3, minmax(0, 1fr))" },
          mb: 3,
        }}
      >
        <Stat icon={EventNoteOutlinedIcon} label="Upcoming interviews" value={counts?.upcoming ?? 0} hint="Scheduled with you" href={`${base}/interviews`} />
        <Stat
          icon={RateReviewOutlinedIcon}
          label="Assessments to give"
          value={counts?.needsFeedback ?? 0}
          hint={counts?.needsFeedback ? "Interviews waiting for your review" : "You're all caught up"}
          href={`${base}/interviews?tab=feedback`}
          highlight={Boolean(counts?.needsFeedback)}
        />
        <Stat icon={CalendarMonthOutlinedIcon} label="Days available" value={counts?.availableDays ?? 0} hint="Upcoming days you've marked" href={`${base}/availability`} />
      </Box>

      {counts && counts.availableDays === 0 ? (
        <Alert
          severity="info"
          sx={{ mb: 3, borderRadius: 2, alignItems: "center" }}
          action={
            <Button component={Link} href={`${base}/availability`} size="small" sx={{ ...brandButtonSx, px: 1.5 }}>
              Add availability
            </Button>
          }
        >
          Let us know when you&apos;re free so we can schedule interviews around your time.
        </Alert>
      ) : null}

      {error ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ py: 6, textAlign: "center" }}>
          <CircularProgress size={26} sx={{ color: BRAND.primary }} />
        </Box>
      ) : (
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "repeat(2, minmax(0, 1fr))" } }}>
          <Section
            title="Waiting for your assessment"
            action={
              waiting.length ? (
                <Button component={Link} href={`${base}/interviews?tab=feedback`} endIcon={<ArrowForwardIcon />} size="small" sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary }}>
                  View all
                </Button>
              ) : null
            }
          >
            {waiting.length ? (
              waiting.slice(0, 5).map((iv, i, arr) => <InterviewRow key={iv.id} iv={iv} base={base} last={i === arr.length - 1} />)
            ) : (
              <Typography sx={{ p: 2, fontSize: "0.86rem", color: "#6b7280" }}>Nothing pending. Thank you!</Typography>
            )}
          </Section>
          <Section
            title="Next interviews"
            action={
              <Button component={Link} href={`${base}/interviews`} endIcon={<ArrowForwardIcon />} size="small" sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary }}>
                All interviews
              </Button>
            }
          >
            {upcoming.length ? (
              upcoming.map((iv, i, arr) => <InterviewRow key={iv.id} iv={iv} base={base} last={i === arr.length - 1} />)
            ) : (
              <Typography sx={{ p: 2, fontSize: "0.86rem", color: "#6b7280" }}>No upcoming interviews scheduled with you yet.</Typography>
            )}
          </Section>
        </Box>
      )}
    </Box>
  );
}
