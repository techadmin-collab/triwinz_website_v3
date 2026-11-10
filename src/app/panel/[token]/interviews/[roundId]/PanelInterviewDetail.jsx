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
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
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

/** Form state for the job's assessment questions, filled with any saved answers */
function buildForm(json) {
  const criteria = json?.job?.assessmentCriteria || [];
  const questions = json?.job?.overallQuestions || [];
  const fb = json?.feedback;
  const savedScore = (q) => (fb?.scores || []).find((x) => x.question === q) || {};
  const savedOverall = (q) => (fb?.overall || []).find((x) => x.question === q) || {};
  return {
    scores: Object.fromEntries(
      criteria.map((q) => [q, { rating: savedScore(q).rating || 0, remarks: savedScore(q).remarks || "" }]),
    ),
    overall: Object.fromEntries(
      questions.map((q) => [q, { details: savedOverall(q).details || "", remarks: savedOverall(q).remarks || "" }]),
    ),
    recommendation: fb?.recommendation || "",
    comments: fb?.comments || "",
  };
}

const EMPTY = buildForm(null);

const RATING_LABELS = { 1: "Poor", 2: "Below expectations", 3: "Meets expectations", 4: "Good", 5: "Excellent" };

function SectionTitle({ children }) {
  return (
    <Typography
      sx={{
        fontSize: "0.75rem",
        fontWeight: 800,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        color: "#1D5758",
        mb: 1,
      }}
    >
      {children}
    </Typography>
  );
}

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
  if (mode === "hybrid") return GroupsOutlinedIcon;
  if (mode === "phone") return PhoneOutlinedIcon;
  return PlaceOutlinedIcon;
}

export default function PanelInterviewDetail({ roundId }) {
  const { token, base, refresh } = usePanel();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(EMPTY);
  const [baseline, setBaseline] = useState(EMPTY); // last saved answers
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
      const initial = buildForm(json);
      setForm(initial);
      setBaseline(initial);
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
  const setScore = (q, k, v) => setForm((f) => ({ ...f, scores: { ...f.scores, [q]: { ...f.scores[q], [k]: v } } }));
  const setOverall = (q, k, v) => setForm((f) => ({ ...f, overall: { ...f.overall, [q]: { ...f.overall[q], [k]: v } } }));

  async function submit(e) {
    e.preventDefault();
    const unrated = Object.entries(form.scores).find(([, v]) => !v.rating);
    if (unrated) return toast.error(`Please rate “${unrated[0]}”`);
    if (!form.recommendation) return toast.error("Please answer “Would you recommend this candidate?”");
    setSaving(true);
    try {
      const res = await fetch(api, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          scores: Object.entries(form.scores).map(([question, v]) => ({ question, rating: v.rating, remarks: v.remarks })),
          overall: Object.entries(form.overall).map(([question, v]) => ({ question, details: v.details, remarks: v.remarks })),
          recommendation: form.recommendation,
          comments: form.comments,
        }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save your assessment");
      const first = !data.feedback;
      setData((d) => ({ ...d, feedback: json.feedback }));
      setBaseline(form);
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
  const sameAsSaved = JSON.stringify(form) === JSON.stringify(baseline);
  const savedSame = Boolean(feedback) && sameAsSaved;
  const cover = candidate.coverLetter || "";
  const checklistItems = liveChecklist || checklist || [];
  const checklistTotal = checklistItems.length;
  const checklistDone = checklistItems.filter((i) => i.done).length;
  const unsaved = canEditFeedback && !sameAsSaved;
  const criteriaList = job?.assessmentCriteria || [];
  const overallList = job?.overallQuestions || [];

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
        {/* Left: interview details + checklist */}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
          <Card title="Interview details" icon={EventOutlinedIcon}>
            <Stack spacing={1.25}>
              <Line icon={EventOutlinedIcon}>
                {interview.scheduledAt ? formatIST(interview.scheduledAt) : "Date and time to be confirmed"}
              </Line>
              {interview.mode === "hybrid" ? (
                <>
                  <Line icon={ModeIcon}>
                    <strong>Hybrid</strong> · join online or attend in person
                  </Line>
                  {interview.meetingLink ? (
                    <Line icon={VideocamOutlinedIcon}>
                      Online:{" "}
                      {/^https?:\/\//i.test(interview.meetingLink) ? (
                        <a href={interview.meetingLink} target="_blank" rel="noopener noreferrer" style={{ color: BRAND.primary, fontWeight: 700 }}>
                          Join Google Meet
                        </a>
                      ) : (
                        interview.meetingLink
                      )}
                    </Line>
                  ) : null}
                  {interview.location ? <Line icon={PlaceOutlinedIcon}>In person: {interview.location}</Line> : null}
                </>
              ) : interview.mode || interview.location ? (
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

            {/* Interview checklist (optional points to cover) */}
            <Box sx={{ mt: 2, pt: 2, borderTop: "1px solid #eef1f1" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: 0.5 }}>
                <ChecklistIcon sx={{ fontSize: 18, color: BRAND.primary }} />
                <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#111" }}>Interview checklist</Typography>
              </Box>
              <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", mb: 1 }}>
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
            </Box>
          </Card>
        </Stack>

        {/* Right: candidate + job description */}
        <Stack spacing={2} sx={{ minWidth: 0 }}>
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
          <Box sx={{ pt: { xs: 1.5, sm: 2.5 } }}>

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
              {criteriaList.length || overallList.length ? (
                <Box
                  sx={{
                    mb: 3,
                    display: "grid",
                    gap: 2.5,
                    alignItems: "start",
                    gridTemplateColumns: {
                      xs: "minmax(0, 1fr)",
                      md: criteriaList.length && overallList.length ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
                    },
                  }}
                >
                {criteriaList.length ? (
                  <Box sx={{ minWidth: 0 }}>
                    <SectionTitle>Assessment</SectionTitle>
                    <Stack spacing={1.5}>
                      {criteriaList.map((q, i) => (
                        <Box key={q} sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#111", mb: 0.5 }}>
                            {i + 1}. {q} <Box component="span" sx={{ color: "#dc2626" }}>*</Box>
                          </Typography>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, mb: 1, flexWrap: "wrap" }}>
                            <Rating
                              value={form.scores[q]?.rating || null}
                              onChange={(_, v) => setScore(q, "rating", v || 0)}
                              readOnly={!canEditFeedback}
                              sx={{ "& .MuiRating-iconFilled": { color: "#F59E0B" } }}
                            />
                            <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
                              {RATING_LABELS[form.scores[q]?.rating] || "Rate 1–5"}
                            </Typography>
                          </Box>
                          <TextField
                            label="Remarks"
                            size="small"
                            fullWidth
                            multiline
                            minRows={1}
                            value={form.scores[q]?.remarks || ""}
                            onChange={(e) => setScore(q, "remarks", e.target.value)}
                            inputProps={{ maxLength: 4000 }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : null}

                {overallList.length ? (
                  <Box sx={{ minWidth: 0 }}>
                    <SectionTitle>Overall assessment</SectionTitle>
                    <Stack spacing={1.5}>
                      {overallList.map((q, i) => (
                        <Box key={q} sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff" }}>
                          <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#111", mb: 1 }}>
                            {i + 1}. {q}
                          </Typography>
                          <Stack spacing={1.25}>
                            <TextField
                              label="Details"
                              size="small"
                              fullWidth
                              multiline
                              minRows={1}
                              value={form.overall[q]?.details || ""}
                              onChange={(e) => setOverall(q, "details", e.target.value)}
                              inputProps={{ maxLength: 4000 }}
                            />
                            <TextField
                              label="Remarks"
                              size="small"
                              fullWidth
                              multiline
                              minRows={1}
                              value={form.overall[q]?.remarks || ""}
                              onChange={(e) => setOverall(q, "remarks", e.target.value)}
                              inputProps={{ maxLength: 4000 }}
                            />
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ) : null}
                </Box>
              ) : null}

              {!criteriaList.length && !overallList.length ? (
                <Box sx={{ mb: 3 }}>
                  <Alert severity="info" sx={{ mb: 1.5 }}>
                    No assessment questions have been set up for this role yet. Add your remarks below.
                  </Alert>
                  <TextField
                    label="Remarks"
                    fullWidth
                    multiline
                    minRows={3}
                    value={form.comments}
                    onChange={(e) => set("comments", e.target.value)}
                    inputProps={{ maxLength: 4000 }}
                  />
                </Box>
              ) : null}

              <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid rgba(29, 87, 88, 0.25)", bgcolor: "#F5FCFB" }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", mb: 0.75 }}>Would you recommend this candidate? *</Typography>
              <ToggleButtonGroup
                exclusive
                value={form.recommendation}
                onChange={(_, v) => v && set("recommendation", v)}
                disabled={!canEditFeedback}
                sx={{ mb: 0, display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", sm: "repeat(4, minmax(0, 1fr))" }, gap: 1 }}
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
              </Box>

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
