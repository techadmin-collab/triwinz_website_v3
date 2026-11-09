"use client";

import { Box, Chip, Rating, Typography } from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { recommendationMeta } from "../../../../lib/interviews";

function Section({ label, text }) {
  if (!text) return null;
  return (
    <Box sx={{ mt: 0.75 }}>
      <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em" }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: "0.84rem", color: "#374151", whiteSpace: "pre-line" }}>{text}</Typography>
    </Box>
  );
}

/**
 * Feedback the panel members sent from their private link for one level.
 * Props: feedback[], interviewerNames[] (assigned panel), compact?
 */
export default function PanelFeedbackList({ feedback = [], interviewerNames = [], compact = false }) {
  const submitted = new Set(feedback.map((f) => f.interviewerName));
  const waiting = interviewerNames.filter((n) => n && !submitted.has(n));
  if (!feedback.length && !waiting.length) return null;

  return (
    <Box sx={{ mt: 1.75, p: 1.5, borderRadius: 1.5, border: "1px solid #e5eaea", bgcolor: "#fbfcfc" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: feedback.length ? 1 : 0 }}>
        <RateReviewOutlinedIcon sx={{ fontSize: 18, color: "#1D5758" }} />
        <Typography sx={{ fontWeight: 800, fontSize: "0.84rem", color: "#111" }}>
          Panel assessment
        </Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
          · {feedback.length} of {Math.max(interviewerNames.length, feedback.length)} submitted
        </Typography>
      </Box>

      {feedback.map((f, i) => {
        const rec = recommendationMeta(f.recommendation);
        return (
          <Box
            key={f.id}
            sx={{ pt: i ? 1.25 : 0, mt: i ? 1.25 : 0, borderTop: i ? "1px solid #eef1f1" : 0 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.84rem", color: "#111" }}>{f.interviewerName}</Typography>
              <Rating value={f.rating} readOnly size="small" />
              {rec ? (
                <Chip size="small" label={rec.label} sx={{ height: 22, fontSize: "0.7rem", fontWeight: 800, color: rec.color, bgcolor: rec.bg }} />
              ) : null}
              <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                {new Date(f.updatedAt || f.submittedAt).toLocaleDateString()}
              </Typography>
            </Box>
            {compact ? (
              <Typography sx={{ mt: 0.5, fontSize: "0.82rem", color: "#374151", whiteSpace: "pre-line" }}>{f.comments}</Typography>
            ) : (
              <>
                <Section label="Strengths" text={f.strengths} />
                <Section label="Concerns" text={f.concerns} />
                <Section label="Overall comments" text={f.comments} />
              </>
            )}
          </Box>
        );
      })}

      {waiting.length ? (
        <Typography sx={{ mt: feedback.length ? 1.25 : 0.5, fontSize: "0.75rem", color: "#9ca3af" }}>
          Waiting for: {waiting.join(", ")}
        </Typography>
      ) : null}
    </Box>
  );
}
