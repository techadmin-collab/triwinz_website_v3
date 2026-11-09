"use client";

import { Box, Chip, Rating, Typography } from "@mui/material";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import { averageScore, recommendationMeta } from "../../../../lib/interviews";

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
        const scores = f.scores || [];
        const overall = (f.overall || []).filter((o) => o.details || o.remarks);
        const avg = averageScore(scores);
        return (
          <Box
            key={f.id}
            sx={{ pt: i ? 1.25 : 0, mt: i ? 1.25 : 0, borderTop: i ? "1px solid #eef1f1" : 0 }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography sx={{ fontWeight: 700, fontSize: "0.84rem", color: "#111" }}>{f.interviewerName}</Typography>
              {avg !== null ? (
                <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5 }}>
                  <Rating value={avg} precision={0.1} readOnly size="small" />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: "#374151" }}>{avg} / 5</Typography>
                </Box>
              ) : f.rating ? (
                <Rating value={f.rating} readOnly size="small" />
              ) : null}
              {rec ? (
                <Chip size="small" label={rec.label} sx={{ height: 22, fontSize: "0.7rem", fontWeight: 800, color: rec.color, bgcolor: rec.bg }} />
              ) : null}
              <Typography sx={{ fontSize: "0.72rem", color: "#9ca3af" }}>
                {new Date(f.updatedAt || f.submittedAt).toLocaleDateString()}
              </Typography>
            </Box>
            {compact ? (
              scores.length ? (
                <Typography sx={{ mt: 0.5, fontSize: "0.8rem", color: "#374151" }}>
                  {scores.map((sc) => `${sc.question}: ${sc.rating}/5`).join(" · ")}
                </Typography>
              ) : f.comments ? (
                <Typography sx={{ mt: 0.5, fontSize: "0.82rem", color: "#374151", whiteSpace: "pre-line" }}>{f.comments}</Typography>
              ) : null
            ) : (
              <>
                {scores.length ? (
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>
                      Assessment
                    </Typography>
                    <Box sx={{ display: "grid", gap: 0.75 }}>
                      {scores.map((sc) => (
                        <Box key={sc.question} sx={{ minWidth: 0 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                            <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#111" }}>{sc.question}</Typography>
                            <Rating value={sc.rating} readOnly size="small" />
                          </Box>
                          {sc.remarks ? (
                            <Typography sx={{ fontSize: "0.8rem", color: "#4b5563", whiteSpace: "pre-line" }}>{sc.remarks}</Typography>
                          ) : null}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : null}
                {overall.length ? (
                  <Box sx={{ mt: 1.25 }}>
                    <Typography sx={{ fontSize: "0.7rem", fontWeight: 700, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>
                      Overall assessment
                    </Typography>
                    <Box sx={{ display: "grid", gap: 0.75 }}>
                      {overall.map((o) => (
                        <Box key={o.question} sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: "0.83rem", fontWeight: 600, color: "#111" }}>{o.question}</Typography>
                          {o.details ? (
                            <Typography sx={{ fontSize: "0.8rem", color: "#111827", whiteSpace: "pre-line" }}>{o.details}</Typography>
                          ) : null}
                          {o.remarks ? (
                            <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", whiteSpace: "pre-line" }}>Remarks: {o.remarks}</Typography>
                          ) : null}
                        </Box>
                      ))}
                    </Box>
                  </Box>
                ) : null}
                {/* older assessments, or remarks when the job had no questions */}
                <Section label="Strengths" text={f.strengths} />
                <Section label="Concerns" text={f.concerns} />
                <Section label={scores.length || overall.length ? "Overall comments" : "Remarks"} text={f.comments} />
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
