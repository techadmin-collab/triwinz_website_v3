"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Rating,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventOutlinedIcon from "@mui/icons-material/EventOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import EmojiEventsOutlinedIcon from "@mui/icons-material/EmojiEventsOutlined";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import { toast } from "react-hot-toast";
import ConfirmDeleteDialog from "../../../components/ConfirmDeleteDialog";
import ResumePreviewDialog from "../../../components/ResumePreviewDialog";
import RoundDialog from "../../../components/interviews/RoundDialog";
import ResultDialog from "../../../components/interviews/ResultDialog";
import StageChip from "../../../components/interviews/StageChip";
import {
  formatDateTime,
  levelLabel,
  modeLabel,
  roundStatusMeta,
} from "../../../../../lib/interviews";
import { brandButtonSx, BRAND } from "../../../../../lib/brand";

const outlineBtn = {
  textTransform: "none",
  fontWeight: 700,
  color: BRAND.primary,
  border: "1px solid rgba(29, 87, 88, 0.25)",
  "&:hover": { bgcolor: "#E6F7F6" },
};

function ModeIcon({ mode }) {
  if (mode === "in_person") return <PlaceOutlinedIcon sx={{ fontSize: 17 }} />;
  if (mode === "phone") return <PhoneOutlinedIcon sx={{ fontSize: 17 }} />;
  return <VideocamOutlinedIcon sx={{ fontSize: 17 }} />;
}

export default function CandidateInterviewsPage() {
  const { applicationId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [roundDialog, setRoundDialog] = useState(null); // { level, round? }
  const [resultRound, setResultRound] = useState(null);
  const [deleteRound, setDeleteRound] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [hiring, setHiring] = useState(false);
  const [resumeView, setResumeView] = useState(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/admin/interviews/${applicationId}`);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Failed to load candidate", { duration: 8000 });
      setLoading(false);
      return;
    }
    setData(await res.json());
    setLoading(false);
  }, [applicationId]);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <Box sx={{ py: 10, textAlign: "center" }}>
        <CircularProgress size={28} sx={{ color: BRAND.primary }} />
      </Box>
    );
  }
  if (!data) {
    return (
      <Box sx={{ py: 8, textAlign: "center" }}>
        <Typography sx={{ mb: 2 }}>Candidate not found.</Typography>
        <Button component={Link} href="/admin/interviews" sx={outlineBtn}>
          Back to interviews
        </Button>
      </Box>
    );
  }

  const { application, rounds, interviewers, stage } = data;
  const latest = rounds[rounds.length - 1] || null;
  const closed = application.status === "selected" || application.status === "rejected";
  const canAddLevel = !closed && (!latest || latest.status === "passed");
  const canHire = !closed && latest?.status === "passed";
  const nextLevel = (latest?.level || 0) + 1;

  function addInterviewer(created) {
    setData((prev) => ({ ...prev, interviewers: [...prev.interviewers, created] }));
  }

  async function submitRound(payload) {
    const editing = roundDialog?.round;
    const res = await fetch(
      editing ? `/api/admin/interviews/rounds/${editing.id}` : `/api/admin/interviews/${applicationId}/rounds`,
      {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Save failed");
      return false;
    }
    toast.success(editing ? "Level updated" : `Level ${roundDialog.level} scheduled`);
    load();
    return true;
  }

  async function submitResult(payload) {
    const res = await fetch(`/api/admin/interviews/rounds/${resultRound.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Save failed");
      return false;
    }
    toast.success("Result saved");
    load();
    return true;
  }

  async function hire() {
    setHiring(true);
    const res = await fetch(`/api/admin/interviews/${applicationId}/hire`, { method: "POST" });
    setHiring(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Could not hire");
      return;
    }
    toast.success(`${application.fullName} marked as hired`);
    load();
  }

  async function confirmDeleteRound() {
    setDeleting(true);
    const res = await fetch(`/api/admin/interviews/rounds/${deleteRound.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Delete failed");
      return;
    }
    toast.success("Level removed");
    setDeleteRound(null);
    load();
  }

  return (
    <Box sx={{ maxWidth: 980, mx: "auto" }}>
      <Button
        component={Link}
        href="/admin/interviews"
        startIcon={<ArrowBackIcon />}
        sx={{ px: 0, mb: 2, textTransform: "none", fontWeight: 600, color: "#6b7280", "&:hover": { bgcolor: "transparent", color: "#111" } }}
      >
        All interviews
      </Button>

      {/* Candidate header */}
      <Paper
        elevation={0}
        sx={{ p: { xs: 2, sm: 2.5 }, mb: 3, borderRadius: 3, border: "1px solid #e8eaed", bgcolor: "#fff" }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: { xs: "flex-start", sm: "center" }, flexDirection: { xs: "column", sm: "row" } }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flex: 1, minWidth: 0 }}>
            <Avatar sx={{ width: 52, height: 52, bgcolor: BRAND.primary, fontWeight: 800 }}>
              {application.fullName?.[0]?.toUpperCase()}
            </Avatar>
            <Box sx={{ minWidth: 0 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                <Typography sx={{ fontWeight: 800, fontSize: "1.25rem", color: "#111" }}>
                  {application.fullName}
                </Typography>
                <StageChip label={stage.label} color={stage.color} bg={stage.bg} />
              </Box>
              <Typography sx={{ color: "#4b5563", fontWeight: 600, fontSize: "0.9rem" }}>
                {application.jobTitle}
              </Typography>
              <Typography sx={{ color: "#6b7280", fontSize: "0.82rem", wordBreak: "break-word" }}>
                {application.email} · {application.phone}
              </Typography>
            </Box>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexShrink: 0 }}>
            {application.resumeUrl ? (
              <Button
                startIcon={<DescriptionOutlinedIcon />}
                onClick={() =>
                  setResumeView({
                    url: application.resumeUrl,
                    fileName: application.resumeFileName,
                    fullName: application.fullName,
                    jobTitle: application.jobTitle,
                  })
                }
                sx={outlineBtn}
              >
                Resume
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Paper>

      {/* Levels */}
      <Typography sx={{ fontWeight: 800, color: "#111", mb: 1.5 }}>Interview levels</Typography>

      {rounds.length === 0 ? (
        <Paper
          elevation={0}
          sx={{ p: { xs: 3, sm: 5 }, textAlign: "center", borderRadius: 3, border: "1px dashed rgba(29, 87, 88, 0.3)", bgcolor: "#F5FCFB", mb: 3 }}
        >
          <EventOutlinedIcon sx={{ color: BRAND.primary, fontSize: 32, mb: 1 }} />
          <Typography sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}>No interviews yet</Typography>
          <Typography sx={{ color: "#6b7280", fontSize: "0.9rem", mb: 2.5 }}>
            Schedule Level 1 and assign one or more interviewers.
          </Typography>
          {canAddLevel ? (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              disableElevation
              onClick={() => setRoundDialog({ level: 1 })}
              sx={{ ...brandButtonSx, fontWeight: 700, px: 2.5 }}
            >
              Schedule Level 1
            </Button>
          ) : null}
        </Paper>
      ) : (
        <Box sx={{ position: "relative", mb: 3 }}>
          {rounds.map((round, index) => {
            const meta = roundStatusMeta(round.status);
            const isLatest = index === rounds.length - 1;
            return (
              <Box key={round.id} sx={{ display: "flex", gap: { xs: 1.5, sm: 2 } }}>
                {/* timeline marker */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 34,
                      height: 34,
                      borderRadius: "50%",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 800,
                      fontSize: "0.85rem",
                      color: meta.color,
                      bgcolor: meta.bg,
                      border: `2px solid ${meta.border}`,
                    }}
                  >
                    L{round.level}
                  </Box>
                  {!isLatest || canAddLevel || canHire ? (
                    <Box sx={{ width: 2, flex: 1, minHeight: 16, bgcolor: "#e5e7eb", my: 0.5 }} />
                  ) : null}
                </Box>

                <Paper
                  elevation={0}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    mb: 2,
                    p: { xs: 1.75, sm: 2.25 },
                    borderRadius: 2.5,
                    border: "1px solid #e8eaed",
                    borderLeft: `4px solid ${meta.color}`,
                    bgcolor: "#fff",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography sx={{ fontWeight: 800, color: "#111" }}>{levelLabel(round)}</Typography>
                      <StageChip label={meta.label} color={meta.color} bg={meta.bg} size="sm" />
                    </Box>
                    <Stack direction="row" spacing={0.5}>
                      {!closed || isLatest ? (
                        <Tooltip title="Edit details">
                          <IconButton size="small" onClick={() => setRoundDialog({ level: round.level, round })}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      {isLatest ? (
                        <Tooltip title="Remove this level">
                          <IconButton size="small" onClick={() => setDeleteRound(round)} sx={{ color: "#dc2626" }}>
                            <DeleteOutlineIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                    </Stack>
                  </Box>

                  <Stack spacing={0.75} sx={{ mt: 1.25, color: "#4b5563", fontSize: "0.86rem" }}>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                      <PeopleAltOutlinedIcon sx={{ fontSize: 17, mt: "2px", color: "#9ca3af" }} />
                      <Typography sx={{ fontSize: "inherit", fontWeight: 600, color: "#111" }}>
                        {round.interviewerNames.join(", ")}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
                      <EventOutlinedIcon sx={{ fontSize: 17, color: "#9ca3af" }} />
                      <Typography sx={{ fontSize: "inherit" }}>
                        {round.scheduledAt ? formatDateTime(round.scheduledAt) : "Date not set"}
                      </Typography>
                      {round.mode ? (
                        <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.5, color: "#6b7280", ml: { sm: 1 } }}>
                          <ModeIcon mode={round.mode} />
                          {modeLabel(round.mode)}
                        </Box>
                      ) : null}
                    </Box>
                    {round.location ? (
                      <Typography sx={{ fontSize: "inherit", pl: 3.1, wordBreak: "break-all" }}>
                        {/^https?:\/\//.test(round.location) ? (
                          <a href={round.location} target="_blank" rel="noopener noreferrer" style={{ color: BRAND.primary, fontWeight: 600 }}>
                            {round.location}
                          </a>
                        ) : (
                          round.location
                        )}
                      </Typography>
                    ) : null}
                    {round.notes ? (
                      <Typography sx={{ fontSize: "0.82rem", color: "#6b7280", pl: 3.1, whiteSpace: "pre-line" }}>
                        {round.notes}
                      </Typography>
                    ) : null}
                  </Stack>

                  {/* Result */}
                  {round.status !== "scheduled" && round.status !== "cancelled" ? (
                    <Box sx={{ mt: 1.75, p: 1.5, borderRadius: 1.5, bgcolor: meta.bg }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap", mb: round.feedback ? 0.75 : 0 }}>
                        <Typography sx={{ fontWeight: 800, color: meta.color, fontSize: "0.85rem" }}>
                          {meta.label}
                        </Typography>
                        {round.rating ? <Rating value={round.rating} readOnly size="small" /> : null}
                        {round.decidedAt ? (
                          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
                            · {new Date(round.decidedAt).toLocaleDateString()}
                          </Typography>
                        ) : null}
                      </Box>
                      {round.feedback ? (
                        <Typography sx={{ fontSize: "0.86rem", color: "#374151", whiteSpace: "pre-line" }}>
                          {round.feedback}
                        </Typography>
                      ) : null}
                    </Box>
                  ) : null}

                  {isLatest && application.status !== "selected" ? (
                    <Button
                      startIcon={<FactCheckOutlinedIcon />}
                      onClick={() => setResultRound(round)}
                      sx={{ ...outlineBtn, mt: 1.75 }}
                    >
                      {round.status === "scheduled" ? "Record result" : "Change result"}
                    </Button>
                  ) : null}
                </Paper>
              </Box>
            );
          })}

          {/* Next step */}
          {canAddLevel || canHire ? (
            <Box sx={{ display: "flex", gap: { xs: 1.5, sm: 2 } }}>
              <Box sx={{ width: 34, flexShrink: 0, display: "flex", justifyContent: "center" }}>
                <Box sx={{ width: 34, height: 34, borderRadius: "50%", border: "2px dashed #cbd5e1", display: "grid", placeItems: "center", color: "#94a3b8" }}>
                  <AddIcon sx={{ fontSize: 18 }} />
                </Box>
              </Box>
              <Paper
                elevation={0}
                sx={{ flex: 1, p: { xs: 1.75, sm: 2.25 }, borderRadius: 2.5, border: "1px dashed rgba(29, 87, 88, 0.3)", bgcolor: "#F5FCFB" }}
              >
                <Typography sx={{ fontWeight: 800, color: "#111", mb: 0.5 }}>
                  Level {latest.level} passed. What’s next?
                </Typography>
                <Typography sx={{ color: "#6b7280", fontSize: "0.86rem", mb: 1.75 }}>
                  Move the candidate to Level {nextLevel}, or hire them if this was the final level.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                  <Button
                    startIcon={<AddIcon />}
                    variant="contained"
                    disableElevation
                    onClick={() => setRoundDialog({ level: nextLevel })}
                    sx={{ ...brandButtonSx, fontWeight: 700, px: 2.25 }}
                  >
                    Schedule Level {nextLevel}
                  </Button>
                  <Button
                    startIcon={<EmojiEventsOutlinedIcon />}
                    onClick={hire}
                    disabled={hiring}
                    sx={{ ...outlineBtn, color: "#047857", borderColor: "#6EE7B7", "&:hover": { bgcolor: "#ECFDF5" } }}
                  >
                    {hiring ? "Saving..." : "Hire candidate"}
                  </Button>
                </Stack>
              </Paper>
            </Box>
          ) : null}

          {application.status === "selected" ? (
            <Paper elevation={0} sx={{ p: 2, ml: { xs: 6, sm: 6.5 }, borderRadius: 2.5, bgcolor: "#ECFDF5", border: "1px solid #A7F3D0" }}>
              <Typography sx={{ fontWeight: 800, color: "#047857" }}>
                Hired after {rounds.length} level{rounds.length === 1 ? "" : "s"}.
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#065F46" }}>
                The application is marked as Selected. Remove the last level to reopen the process.
              </Typography>
            </Paper>
          ) : null}
        </Box>
      )}

      <RoundDialog
        open={Boolean(roundDialog)}
        level={roundDialog?.level}
        round={roundDialog?.round}
        interviewers={interviewers}
        onInterviewerCreated={addInterviewer}
        onClose={() => setRoundDialog(null)}
        onSubmit={submitRound}
      />
      <ResultDialog
        open={Boolean(resultRound)}
        round={resultRound}
        candidateName={application.fullName}
        onClose={() => setResultRound(null)}
        onSubmit={submitResult}
      />
      <ConfirmDeleteDialog
        open={Boolean(deleteRound)}
        title={`Remove Level ${deleteRound?.level}?`}
        description="This level and its result will be deleted. If it rejected or completed the candidate, they go back to Shortlisted."
        confirmLabel="Remove"
        loading={deleting}
        onClose={() => !deleting && setDeleteRound(null)}
        onConfirm={confirmDeleteRound}
      />
      <ResumePreviewDialog
        open={Boolean(resumeView)}
        resume={resumeView}
        onClose={() => setResumeView(null)}
      />
    </Box>
  );
}
