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
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import CloseIcon from "@mui/icons-material/Close";
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
import JobDescriptionCard from "./JobDescriptionCard";
import InterviewChecklist from "../../../../admin/components/interviews/InterviewChecklist";
import ChecklistIcon from "@mui/icons-material/Checklist";
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
  const [sheetOpen, setSheetOpen] = useState(false);
  const [liveChecklist, setLiveChecklist] = useState(null); // latest items from the sheet
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

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
      if (!res.ok) throw new Error(json.error || "Could not save your assessment");
      const first = !data.feedback;
      setData((d) => ({ ...d, feedback: json.feedback }));
      toast.success(first ? "Assessment submitted. Thank you!" : "Assessment updated");
      setSheetOpen(false);
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

  const { interview, candidate, job, checklist, teamNotes = [], feedback, canEditFeedback } = data;
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
  const checklistItems = liveChecklist || checklist || [];
  const checklistTotal = checklistItems.length;
  const checklistDone = checklistItems.filter((i) => i.done).length;
  const unsaved =
    canEditFeedback &&
    (feedback
      ? !savedSame
      : Boolean(form.rating || form.recommendation || form.comments.trim() || form.strengths.trim() || form.concerns.trim()));

  function closeSheet() {
    if (saving) return;
    if (unsaved && !window.confirm("Your assessment isn't submitted yet. Close the sheet anyway? What you typed stays until you leave this page.")) return;
    setSheetOpen(false);
  }

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

      {/* Assessment: opens the assessment sheet (checklist + assessment) */}
      <Paper
        elevation={0}
        sx={{
          mb: 2.5,
          p: { xs: 1.75, sm: 2.25 },
          borderRadius: 2.5,
          border: "1px solid",
          borderColor: feedback ? "#A7F3D0" : "rgba(29, 87, 88, 0.2)",
          bgcolor: feedback ? "#F0FDF7" : "#F5FCFB",
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box sx={{ display: "flex", gap: 1.5, alignItems: "flex-start", flex: 1, minWidth: 0 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              flexShrink: 0,
              display: "grid",
              placeItems: "center",
              bgcolor: feedback ? "#D1FAE5" : "#E6F7F6",
              color: feedback ? "#047857" : BRAND.primary,
            }}
          >
            {feedback ? <CheckCircleIcon /> : <AssignmentOutlinedIcon />}
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontWeight: 800, color: "#111" }}>
              {feedback ? "Assessment submitted" : "Assessment"}
            </Typography>
            <Typography sx={{ fontSize: "0.84rem", color: "#4b5563" }}>
              {feedback
                ? `Submitted ${new Date(feedback.updatedAt || feedback.submittedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}.${canEditFeedback ? " You can still update it until the team records the result." : ""}`
                : !canEditFeedback
                  ? interview.status === "cancelled"
                    ? "This interview was cancelled."
                    : "This interview has been closed."
                  : "Open the assessment sheet to use the interview checklist and record your rating, recommendation and comments."}
              {checklistTotal ? ` Checklist: ${checklistDone} of ${checklistTotal} done.` : ""}
            </Typography>
          </Box>
        </Box>
        <Button
          variant="contained"
          disableElevation
          startIcon={feedback || !canEditFeedback ? <AssignmentOutlinedIcon /> : <PlayArrowRoundedIcon />}
          onClick={() => setSheetOpen(true)}
          sx={{ ...brandButtonSx, fontWeight: 800, px: 3, py: 1.1, flexShrink: 0, width: { xs: "100%", sm: "auto" } }}
        >
          {!canEditFeedback ? "View assessment" : feedback ? "Edit assessment" : "Start assessment"}
        </Button>
      </Paper>

      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "minmax(0, 1fr)", lg: "minmax(0, 1fr) minmax(0, 1fr)" },
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
            {interview.notes || teamNotes.length ? (
              <Box sx={{ mt: 1.75, p: 1.5, borderRadius: 1.5, bgcolor: "#F5FCFB", border: "1px solid #dcefed" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.75 }}>
                  <StickyNote2OutlinedIcon sx={{ fontSize: 16, color: BRAND.primary }} />
                  <Typography sx={{ fontSize: "0.75rem", fontWeight: 800, color: BRAND.primary }}>Notes from the TriWinz team</Typography>
                </Box>
                <Stack spacing={1.25}>
                  {interview.notes ? (
                    <Typography sx={{ fontSize: "0.86rem", color: "#374151", whiteSpace: "pre-line" }}>{interview.notes}</Typography>
                  ) : null}
                  {teamNotes.map((note, i) => (
                    <Box
                      key={note.id}
                      sx={{ pt: interview.notes || i ? 1.25 : 0, borderTop: interview.notes || i ? "1px solid #dcefed" : 0 }}
                    >
                      <Typography sx={{ fontSize: "0.86rem", color: "#374151", whiteSpace: "pre-line", wordBreak: "break-word" }}>
                        {note.text}
                      </Typography>
                      <Typography sx={{ mt: 0.4, fontSize: "0.7rem", color: "#9ca3af" }}>
                        {note.authorName} ·{" "}
                        {new Date(note.createdAt).toLocaleString(undefined, { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" })}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
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

        {/* Right: job description */}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          {job ? (
            <JobDescriptionCard job={job} />
          ) : (
            <Card title="Job description" icon={DescriptionOutlinedIcon}>
              <Typography sx={{ fontSize: "0.86rem", color: "#6b7280" }}>
                The job description for {candidate.jobTitle} isn&apos;t available.
              </Typography>
            </Card>
          )}
        </Stack>
      </Box>

      {/* Assessment sheet */}
      <Dialog
        open={sheetOpen}
        onClose={closeSheet}
        fullScreen={fullScreen}
        maxWidth="lg"
        fullWidth
        keepMounted
        PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3, bgcolor: "#F7FBFB" } }}
      >
        <DialogTitle component="div" sx={{ pr: 7, py: 1.75, bgcolor: "#fff", borderBottom: "1px solid #e8eaed" }}>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.1rem", sm: "1.2rem" }, color: "#111" }}>
            Assessment sheet
          </Typography>
          <IconButton onClick={closeSheet} aria-label="Close" sx={{ position: "absolute", top: 10, right: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: { xs: 1.5, sm: 2.5 } }}>
          <Box
            sx={{
              pt: { xs: 1.5, sm: 2.5 },
              display: "grid",
              gap: 2,
              gridTemplateColumns: { xs: "minmax(0, 1fr)", md: "minmax(0, 0.9fr) minmax(0, 1.1fr)" },
              alignItems: "start",
            }}
          >
            <Card title="Interview checklist" icon={ChecklistIcon}>
            <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", mb: 1.25 }}>
              Optional points to cover. Tick them as you go, and add your own. Everyone on this interview&apos;s panel
              and the TriWinz team can see this list.
            </Typography>
            <InterviewChecklist
              apiBase={`/api/panel/${encodeURIComponent(token)}/interviews/${roundId}/checklist`}
              initialItems={checklist}
              locked={!canEditFeedback}
              bare
              onItemsChange={setLiveChecklist}
            />
            </Card>

            <Card sx={{ minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5, flexWrap: "wrap" }}>
            <Typography sx={{ fontWeight: 800, color: "#111", fontSize: "1.05rem" }}>Your assessment</Typography>
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
                : "This interview has been closed, so your assessment can no longer be changed."}
            </Alert>
          ) : upcoming && !feedback ? (
            <Alert severity="info" sx={{ mb: 2 }}>
              This interview hasn&apos;t happened yet. Come back after it to share your assessment.
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
                    {saving ? "Saving..." : feedback ? "Update assessment" : "Submit assessment"}
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
        </DialogContent>
      </Dialog>

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
