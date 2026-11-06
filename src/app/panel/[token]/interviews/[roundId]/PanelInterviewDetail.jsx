"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Rating,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { toast } from "react-hot-toast";
import ResumePreviewDialog from "../../../../admin/components/ResumePreviewDialog";
import { BRAND, brandButtonSx } from "../../../../../lib/brand";
import {
  FEEDBACK_RECOMMENDATIONS,
  formatIST,
  levelLabel,
  modeLabel,
  roundStatusMeta,
} from "../../../../../lib/interviews";
import { usePanel } from "../../PanelShell";

const EMPTY = { rating: 0, recommendation: "", strengths: "", concerns: "", comments: "" };

const RATING_LABELS = { 1: "Poor", 2: "Below expectations", 3: "Meets expectations", 4: "Good", 5: "Excellent" };

function Card({ title, icon: Icon, children, sx }) {
  return (
    <Paper elevation={0} sx={{ p: { xs: 1.75, sm: 2.25 }, borderRadius: 2.5, border: "1px solid #e8eaed", minWidth: 0, ...sx }}>
      {title ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
          {Icon ? <Icon sx={{ fontSize: 20, color: BRAND.primary }} /> : null}
          <Typography sx={{ fontWeight: 800, color: "#111" }}>{title}</Typography>
        </Box>
      ) : null}
      {children}
    </Paper>
  );
}

function Line({ icon: Icon, children }) {
  return (
    <Box sx={{ display: "flex", gap: 1.25, alignItems: "flex-start", fontSize: "0.88rem", color: "#374151", minWidth: 0 }}>
      <Icon sx={{ fontSize: 18, color: "#6b7280", mt: 0.15, flexShrink: 0 }} />
      <Box sx={{ minWidth: 0, wordBreak: "break-word" }}>{children}</Box>
    </Box>
  );
}

function modeIcon(mode) {
  if (mode === "online") return VideocamOutlinedIcon;
  if (mode === "phone") return PhoneOutlinedIcon;
  return PlaceOutlinedIcon;
}

export default function PanelInterviewDetail({ roundId }) {
  const { token, base, refresh } = usePanel();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [showCover, setShowCover] = useState(false);

  const api = `/api/panel/${encodeURIComponent(token)}/interviews/${roundId}`;

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(api, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not load this interview");
      setData(json);
      setForm(
        json.feedback
          ? {
              rating: json.feedback.rating,
              recommendation: json.feedback.recommendation,
              strengths: json.feedback.strengths || "",
              concerns: json.feedback.concerns || "",
              comments: json.feedback.comments || "",
            }
          : EMPTY,
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    if (!form.rating) return toast.error("Please give a star rating");
    if (!form.recommendation) return toast.error("Please choose a recommendation");
    if (!form.comments.trim()) return toast.error("Please add your overall comments");
    setSaving(true);
    try {
      const res = await fetch(api, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save your feedback");
      const first = !data.feedback;
      setData((d) => ({ ...d, feedback: json.feedback }));
      toast.success(first ? "Feedback submitted. Thank you!" : "Feedback updated");
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  const back = (
    <Button
      component={Link}
      href={`${base}/interviews`}
      startIcon={<ArrowBackIcon />}
      sx={{ px: 0, mb: 2, textTransform: "none", fontWeight: 600, color: "#6b7280", "&:hover": { bgcolor: "transparent", color: "#111" } }}
    >
      My interviews
    </Button>
  );

  if (loading && !data) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress size={28} sx={{ color: BRAND.primary }} />
      </Box>
    );
  }
  if (error && !data) {
    return (
      <Box>
        {back}
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const { interview, candidate, feedback, canEditFeedback } = data;
  const status = roundStatusMeta(interview.status);
  const ModeIcon = modeIcon(interview.mode);
  const isLink = interview.location && /^https?:\/\//i.test(interview.location);
  const upcoming = interview.scheduledAt && new Date(interview.scheduledAt) > new Date();
  const savedSame =
    feedback &&
    form.rating === feedback.rating &&
    form.recommendation === feedback.recommendation &&
    form.strengths === (feedback.strengths || "") &&
    form.concerns === (feedback.concerns || "") &&
    form.comments === (feedback.comments || "");
  const cover = candidate.coverLetter || "";

  return (
    <Box>
      {back}

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: { xs: "flex-start", sm: "center" }, gap: 1.5, flexWrap: "wrap", mb: 2.5 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography sx={{ fontSize: { xs: "1.35rem", md: "1.6rem" }, fontWeight: 800, color: "#111", letterSpacing: "-0.02em" }}>
            {candidate.fullName}
          </Typography>
          <Typography sx={{ color: "#4b5563", fontSize: "0.92rem" }}>
            {candidate.jobTitle} · {levelLabel(interview)}
          </Typography>
        </Box>
        <Chip label={status.label} sx={{ fontWeight: 800, bgcolor: status.bg, color: status.color }} />
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) minmax(0, 1.25fr)" },
          alignItems: "start",
        }}
      >
        {/* Left: interview + candidate */}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Card title="Interview details" icon={EventOutlinedIcon}>
            <Stack spacing={1.25}>
              <Line icon={EventOutlinedIcon}>
                {interview.scheduledAt ? formatIST(interview.scheduledAt) : "Date and time to be confirmed"}
              </Line>
              {interview.mode || interview.location ? (
                <Line icon={ModeIcon}>
                  {interview.mode ? <strong>{modeLabel(interview.mode)}</strong> : null}
                  {interview.mode && interview.location ? " · " : null}
                  {isLink ? (
                    <a href={interview.location} target="_blank" rel="noopener noreferrer" style={{ color: BRAND.primary, fontWeight: 700 }}>
                      Join meeting
                    </a>
                  ) : (
                    interview.location
                  )}
                </Line>
              ) : null}
              {interview.panel.length ? (
                <Line icon={PeopleAltOutlinedIcon}>Panel: {interview.panel.join(", ")}</Line>
              ) : null}
            </Stack>
            {interview.notes ? (
              <Box sx={{ mt: 1.75, p: 1.5, borderRadius: 1.5, bgcolor: "#F5FCFB", border: "1px solid #dcefed" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                  <StickyNote2OutlinedIcon sx={{ fontSize: 16, color: BRAND.primary }} />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: BRAND.primary }}>Notes from the TriWinz team</Typography>
                </Box>
                <Typography sx={{ fontSize: "0.86rem", color: "#374151", whiteSpace: "pre-line" }}>{interview.notes}</Typography>
              </Box>
            ) : null}
          </Card>

          <Card title="Candidate" icon={DescriptionOutlinedIcon}>
            <Typography sx={{ fontWeight: 700, color: "#111" }}>{candidate.fullName}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#6b7280", mb: 1.5 }}>Applied for {candidate.jobTitle}</Typography>
            {candidate.resumeUrl ? (
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                <Button
                  variant="contained"
                  disableElevation
                  startIcon={<DescriptionOutlinedIcon />}
                  onClick={() => setResumeOpen(true)}
                  sx={{ ...brandButtonSx, fontWeight: 700 }}
                >
                  View resume
                </Button>
                <Button
                  href={candidate.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  startIcon={<OpenInNewIcon />}
                  sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary, border: "1px solid rgba(29, 87, 88, 0.25)", px: 2 }}
                >
                  Open file
                </Button>
              </Stack>
            ) : (
              <Typography sx={{ fontSize: "0.85rem", color: "#9ca3af" }}>No resume attached.</Typography>
            )}
            {cover ? (
              <Box sx={{ mt: 2 }}>
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.04em", mb: 0.5 }}>
                  Cover letter
                </Typography>
                <Typography sx={{ fontSize: "0.86rem", color: "#374151", whiteSpace: "pre-line" }}>
                  {showCover || cover.length <= 400 ? cover : `${cover.slice(0, 400)}…`}
                </Typography>
                {cover.length > 400 ? (
                  <Button size="small" onClick={() => setShowCover((v) => !v)} sx={{ px: 0, textTransform: "none", fontWeight: 700, color: BRAND.primary }}>
                    {showCover ? "Show less" : "Read more"}
                  </Button>
                ) : null}
              </Box>
            ) : null}
          </Card>
        </Stack>

        {/* Right: feedback */}
        <Card sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
            <Typography sx={{ fontWeight: 800, color: "#111", fontSize: "1.05rem" }}>Your feedback</Typography>
            {feedback ? (
              <Chip
                size="small"
                icon={<CheckCircleIcon sx={{ fontSize: 16 }} />}
                label={`Submitted ${new Date(feedback.updatedAt || feedback.submittedAt).toLocaleDateString(undefined, { day: "numeric", month: "short" })}`}
                sx={{ height: 24, fontWeight: 700, bgcolor: "#D1FAE5", color: "#047857", "& .MuiChip-icon": { color: "#047857" } }}
              />
            ) : null}
          </Box>
          <Typography sx={{ fontSize: "0.84rem", color: "#6b7280", mb: 2 }}>
            Only the TriWinz hiring team sees this. The team makes the final decision.
          </Typography>

          {!canEditFeedback ? (
            <Alert icon={<LockOutlinedIcon fontSize="small" />} severity="info" sx={{ mb: 2 }}>
              {interview.status === "cancelled"
                ? "This interview was cancelled."
                : "This interview has been closed, so feedback can no longer be changed."}
            </Alert>
          ) : upcoming && !feedback ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              This interview hasn&apos;t happened yet. Come back after it to share your feedback.
            </Alert>
          ) : null}

          <Box component="form" onSubmit={submit}>
            <fieldset disabled={!canEditFeedback || saving} style={{ border: 0, padding: 0, margin: 0, minWidth: 0 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", mb: 0.5 }}>Overall rating *</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 2.25 }}>
                <Rating
                  value={form.rating || null}
                  onChange={(_, v) => set("rating", v || 0)}
                  size="large"
                  readOnly={!canEditFeedback}
                  sx={{ "& .MuiRating-iconFilled": { color: "#F59E0B" } }}
                />
                <Typography sx={{ fontSize: "0.82rem", color: "#6b7280" }}>{RATING_LABELS[form.rating] || "Choose 1–5 stars"}</Typography>
              </Box>

              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", mb: 0.75 }}>Would you recommend this candidate? *</Typography>
              <ToggleButtonGroup
                exclusive
                value={form.recommendation}
                onChange={(_, v) => v && set("recommendation", v)}
                disabled={!canEditFeedback}
                sx={{ mb: 2.5, display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1 }}
              >
                {FEEDBACK_RECOMMENDATIONS.map((r) => (
                  <ToggleButton
                    key={r.value}
                    value={r.value}
                    sx={{
                      textTransform: "none",
                      fontWeight: 700,
                      fontSize: "0.84rem",
                      borderRadius: "10px !important",
                      border: "1px solid #e5e7eb !important",
                      color: "#4b5563",
                      "&.Mui-selected, &.Mui-selected:hover": {
                        bgcolor: r.bg,
                        color: r.color,
                        borderColor: `${r.color} !important`,
                      },
                    }}
                  >
                    {r.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>

              <Stack spacing={2}>
                <TextField
                  label="Strengths"
                  multiline
                  minRows={2}
                  value={form.strengths}
                  onChange={(e) => set("strengths", e.target.value)}
                  placeholder="What did the candidate do well?"
                  inputProps={{ maxLength: 4000 }}
                />
                <TextField
                  label="Concerns"
                  multiline
                  minRows={2}
                  value={form.concerns}
                  onChange={(e) => set("concerns", e.target.value)}
                  placeholder="Gaps, risks or areas to probe in the next level"
                  inputProps={{ maxLength: 4000 }}
                />
                <TextField
                  label="Overall comments"
                  required
                  multiline
                  minRows={3}
                  value={form.comments}
                  onChange={(e) => set("comments", e.target.value)}
                  placeholder="Your summary of the interview"
                  inputProps={{ maxLength: 4000 }}
                />
              </Stack>

              {canEditFeedback ? (
                <Box sx={{ mt: 2.5, display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disableElevation
                    disabled={saving || savedSame}
                    sx={{ ...brandButtonSx, fontWeight: 800, px: 3, py: 1 }}
                  >
                    {saving ? "Saving..." : feedback ? "Update feedback" : "Submit feedback"}
                  </Button>
                  {feedback && !savedSame ? (
                    <Typography sx={{ fontSize: "0.75rem", color: "#b45309" }}>You have unsaved changes.</Typography>
                  ) : null}
                </Box>
              ) : null}
            </fieldset>
          </Box>
        </Card>
      </Box>

      <ResumePreviewDialog
        open={resumeOpen}
        resume={
          candidate.resumeUrl
            ? { url: candidate.resumeUrl, fileName: candidate.resumeFileName, fullName: candidate.fullName, jobTitle: candidate.jobTitle }
            : null
        }
        onClose={() => setResumeOpen(false)}
      />
    </Box>
  );
}
