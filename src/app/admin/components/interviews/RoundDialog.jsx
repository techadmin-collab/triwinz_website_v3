"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import InterviewerPicker from "./InterviewerPicker";
import {
  INTERVIEW_MODES,
  LEVEL_TITLE_SUGGESTIONS,
  fromLocalInput,
  toLocalInput,
} from "../../../../lib/interviews";
import { brandButtonSx, BRAND } from "../../../../lib/brand";

const empty = {
  title: "",
  interviewerIds: [],
  scheduledAt: "",
  mode: "online",
  location: "",
  notes: "",
};

/** Add a new level or edit an existing level's details. */
export default function RoundDialog({
  open,
  level,
  round, // existing round when editing
  interviewers,
  onInterviewerCreated,
  onClose,
  onSubmit, // async (payload) => boolean (true = saved)
}) {
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setError("");
    setForm(
      round
        ? {
            title: round.title || "",
            interviewerIds: round.interviewerIds || [],
            scheduledAt: toLocalInput(round.scheduledAt),
            mode: round.mode || "online",
            location: round.location || "",
            notes: round.notes || "",
          }
        : empty,
    );
  }, [open, round]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.interviewerIds.length === 0) {
      setError("Choose at least one interviewer");
      return;
    }
    setSaving(true);
    const ok = await onSubmit({ ...form, scheduledAt: fromLocalInput(form.scheduledAt) });
    setSaving(false);
    if (ok) onClose();
  }

  const locationLabel =
    form.mode === "in_person" ? "Address / room" : form.mode === "phone" ? "Phone number (optional)" : "Meeting link";

  return (
    <Dialog open={open} onClose={saving ? undefined : onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
      <Box component="form" onSubmit={handleSubmit}>
        <DialogTitle sx={{ fontWeight: 800 }}>
          {round ? `Edit Level ${level}` : `Schedule Level ${level}`}
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2.25} sx={{ pt: 1 }}>
            <Box>
              <TextField
                label="Level name (optional)"
                placeholder="e.g. Technical"
                fullWidth
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
              />
              <Stack direction="row" spacing={0.75} sx={{ mt: 1, flexWrap: "wrap", rowGap: 0.75 }}>
                {LEVEL_TITLE_SUGGESTIONS.map((t) => (
                  <Chip
                    key={t}
                    label={t}
                    size="small"
                    onClick={() => set("title", t)}
                    variant={form.title === t ? "filled" : "outlined"}
                    sx={
                      form.title === t
                        ? { bgcolor: BRAND.primary, color: "#fff" }
                        : { borderColor: "rgba(29, 87, 88, 0.3)", color: BRAND.primary }
                    }
                  />
                ))}
              </Stack>
            </Box>

            <InterviewerPicker
              interviewers={interviewers}
              value={form.interviewerIds}
              onChange={(ids) => {
                setError("");
                set("interviewerIds", ids);
              }}
              onCreated={onInterviewerCreated}
              error={error}
            />

            <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
              <TextField
                label="Date & time"
                type="datetime-local"
                fullWidth
                value={form.scheduledAt}
                onChange={(e) => set("scheduledAt", e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Optional. You can add it later."
              />
              <TextField
                select
                label="Mode"
                fullWidth
                value={form.mode}
                onChange={(e) => set("mode", e.target.value)}
              >
                {INTERVIEW_MODES.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </TextField>
            </Stack>

            <TextField
              label={locationLabel}
              fullWidth
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder={form.mode === "online" ? "https://meet.google.com/..." : ""}
            />

            <TextField
              label="Notes for this level (optional)"
              fullWidth
              multiline
              minRows={2}
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Topics to cover, things to check, etc."
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={onClose} disabled={saving} sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disableElevation disabled={saving} sx={{ ...brandButtonSx, fontWeight: 700, px: 2.5 }}>
            {saving ? "Saving..." : round ? "Save changes" : `Schedule Level ${level}`}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
