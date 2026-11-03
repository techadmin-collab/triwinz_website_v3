"use client";

import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Rating,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import PauseCircleOutlineIcon from "@mui/icons-material/PauseCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { roundStatusMeta, levelLabel } from "../../../../lib/interviews";
import { brandButtonSx } from "../../../../lib/brand";

const OUTCOMES = [
  { value: "passed", icon: CheckCircleOutlineIcon },
  { value: "on_hold", icon: PauseCircleOutlineIcon },
  { value: "rejected", icon: HighlightOffIcon },
];

/** Record the result of a level (on behalf of the interviewers). */
export default function ResultDialog({ open, round, candidateName, onClose, onSubmit }) {
  const [status, setStatus] = useState("passed");
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [sendEmail, setSendEmail] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open || !round) return;
    setStatus(["passed", "on_hold", "rejected"].includes(round.status) ? round.status : "passed");
    setRating(round.rating || null);
    setFeedback(round.feedback || "");
    setSendEmail(false);
  }, [open, round]);

  async function handleSave() {
    setSaving(true);
    const ok = await onSubmit({
      status,
      rating: rating || null,
      feedback,
      sendRejectionEmail: status === "rejected" && sendEmail,
    });
    setSaving(false);
    if (ok) onClose();
  }

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <DialogTitle sx={{ fontWeight: 800, pb: 0.5 }}>
        Result · {levelLabel(round)}
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ color: "#6b7280", fontSize: "0.88rem", mb: 2 }}>
          {candidateName}
          {round?.interviewerNames?.length ? ` · interviewed by ${round.interviewerNames.join(", ")}` : ""}
        </Typography>

        <ToggleButtonGroup
          exclusive
          fullWidth
          value={status}
          onChange={(_, v) => v && setStatus(v)}
          sx={{ mb: 2.5, flexWrap: { xs: "wrap", sm: "nowrap" } }}
        >
          {OUTCOMES.map(({ value, icon: Icon }) => {
            const meta = roundStatusMeta(value);
            return (
              <ToggleButton
                key={value}
                value={value}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  gap: 0.75,
                  py: 1.1,
                  "&.Mui-selected, &.Mui-selected:hover": {
                    bgcolor: meta.bg,
                    color: meta.color,
                    borderColor: meta.border,
                  },
                }}
              >
                <Icon fontSize="small" />
                {meta.label}
              </ToggleButton>
            );
          })}
        </ToggleButtonGroup>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Typography sx={{ fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>Rating</Typography>
          <Rating value={rating} onChange={(_, v) => setRating(v)} />
          <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>(optional)</Typography>
        </Box>

        <TextField
          label="Interviewer feedback"
          multiline
          minRows={4}
          fullWidth
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Strengths, concerns, recommendation..."
        />

        {status === "passed" ? (
          <Alert severity="success" sx={{ mt: 2 }}>
            You can then schedule the next level, or hire the candidate if this was the last level.
          </Alert>
        ) : null}
        {status === "rejected" ? (
          <Stack spacing={1} sx={{ mt: 2 }}>
            <Alert severity="warning">
              The application will be marked as <b>Rejected</b>.
            </Alert>
            <FormControlLabel
              control={<Checkbox checked={sendEmail} onChange={(e) => setSendEmail(e.target.checked)} />}
              label="Also send the candidate the rejection email"
            />
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}>
          Cancel
        </Button>
        <Button onClick={handleSave} variant="contained" disableElevation disabled={saving} sx={{ ...brandButtonSx, fontWeight: 700, px: 2.5 }}>
          {saving ? "Saving..." : "Save result"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
