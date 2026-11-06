"use client";

import Link from "next/link";
import { Box, Chip, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { formatIST, levelLabel, modeLabel, recommendationMeta, roundStatusMeta } from "../../../lib/interviews";
import { BRAND } from "../../../lib/brand";

/** Is this interview waiting for the panel member's feedback? */
export function needsFeedback(iv, now = new Date()) {
  return (
    ["scheduled", "on_hold"].includes(iv.status) &&
    iv.scheduledAt &&
    new Date(iv.scheduledAt) <= now &&
    !iv.myFeedback
  );
}

export function isUpcoming(iv, now = new Date()) {
  return iv.status === "scheduled" && (!iv.scheduledAt || new Date(iv.scheduledAt) >= now);
}

/** One interview in a list. Links to its detail page. */
export default function InterviewRow({ iv, base, last = false }) {
  const status = roundStatusMeta(iv.status);
  const rec = iv.myFeedback ? recommendationMeta(iv.myFeedback.recommendation) : null;
  const waiting = needsFeedback(iv);
  return (
    <Box
      component={Link}
      href={`${base}/interviews/${iv.id}`}
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1.25, sm: 2 },
        px: { xs: 1.5, sm: 2 },
        py: 1.25,
        textDecoration: "none",
        color: "inherit",
        borderBottom: last ? 0 : "1px solid #f1f2f4",
        "&:hover": { bgcolor: "#f7fbfb" },
        minWidth: 0,
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#111" }}>{iv.candidateName}</Typography>
          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
            {levelLabel(iv)}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: "0.78rem", color: "#4b5563", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {iv.jobTitle}
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mt: 0.25 }}>
          {iv.scheduledAt ? formatIST(iv.scheduledAt) : "Time to be confirmed"}
          {iv.mode ? ` · ${modeLabel(iv.mode)}` : ""}
        </Typography>
      </Box>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5, flexShrink: 0 }}>
        {waiting ? (
          <Chip size="small" label="Feedback needed" sx={{ height: 22, fontSize: "0.68rem", fontWeight: 800, bgcolor: "#FEF3C7", color: "#B45309" }} />
        ) : rec ? (
          <Chip size="small" label={`Your feedback: ${rec.label}`} sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: rec.bg, color: rec.color }} />
        ) : (
          <Chip
            size="small"
            label={status.label}
            sx={{ height: 22, fontSize: "0.68rem", fontWeight: 700, bgcolor: status.bg, color: status.color }}
          />
        )}
      </Box>
      <ChevronRightIcon sx={{ color: BRAND.primary, opacity: 0.6, flexShrink: 0 }} />
    </Box>
  );
}
