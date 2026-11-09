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
  IconButton,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import InterviewerPicker from "./InterviewerPicker";
import AvailabilityAssist from "./AvailabilityAssist";
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
  meetingLink: "",
  notes: "",
  checklist: [],
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
  const [checklistText, setChecklistText] = useState("");
  const [manualTime, setManualTime] = useState(false);
  const [sendEmails, setSendEmails] = useState(true);

  function addChecklistItem() {
    const text = checklistText.replace(/\s+/g, " ").trim();
    if (!text) return;
    setForm((prev) => ({ ...prev, checklist: [...prev.checklist, text].slice(0, 50) }));
    setChecklistText("");
  }

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
            meetingLink: round.meetingLink || "",
            notes: round.notes || "",
            checklist: [],
          }
        : empty,
    );
    setChecklistText("");
    setManualTime(false);
    // new level: email by default; editing: only if asked
    setSendEmails(!round);
  }, [open, round]);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.interviewerIds.length === 0) {
      setError("Choose at least one interviewer");
      return;
    }
    setSaving(true);
    const pending = checklistText.trim() ? [...form.checklist, checklistText.trim()] : form.checklist;
    const { checklist, ...rest } = form;
    const ok = await onSubmit({
      ...rest,
      scheduledAt: fromLocalInput(form.scheduledAt),
      // only sent for a new level; an existing level's checklist is edited on its card
      ...(round ? {} : { checklist: pending }),
      sendEmails: Boolean(sendEmails && form.scheduledAt),
    });
    setSaving(false);
    if (ok) onClose();
  }

  const locationLabel =
    form.mode === "in_person" || form.mode === "hybrid"
      ? "Location / address"
      : form.mode === "phone"
        ? "Phone number (optional)"
        : "Meeting link";

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


            {open ? (
              <AvailabilityAssist
                interviewers={interviewers}
                selectedIds={form.interviewerIds}
                scheduledAt={form.scheduledAt}
                onToggle={(id) => {
                  setError("");
                  set(
                    "interviewerIds",
                    form.interviewerIds.includes(id)
                      ? form.interviewerIds.filter((x) => x !== id)
                      : [...form.interviewerIds, id],
                  );
                }}
                onPickTime={(value) => set("scheduledAt", value)}
              />
            ) : null}

            {/* Fallback when nobody has shared a suitable slot */}
            {manualTime ? (
              <TextField
                label="Date & time (manual)"
                type="datetime-local"
                fullWidth
                size="small"
                value={form.scheduledAt}
                onChange={(e) => set("scheduledAt", e.target.value)}
                InputLabelProps={{ shrink: true }}
                helperText="Your computer's time. Leave empty to set the time later."
              />
            ) : (
              <Typography sx={{ mt: -1, fontSize: "0.78rem", color: "#6b7280" }}>
                No suitable slot?{" "}
                <Box
                  component="button"
                  type="button"
                  onClick={() => setManualTime(true)}
                  sx={{ p: 0, border: 0, bgcolor: "transparent", color: BRAND.primary, fontWeight: 700, cursor: "pointer", fontSize: "inherit", fontFamily: "inherit" }}
                >
                  Set a time manually
                </Box>{" "}
                or leave it and add the time later.
              </Typography>
            )}

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

            {form.mode === "hybrid" ? (
              <TextField
                label="Google Meet link"
                fullWidth
                value={form.meetingLink}
                onChange={(e) => set("meetingLink", e.target.value)}
                placeholder="https://meet.google.com/..."
                helperText="For anyone joining online"
              />
            ) : null}

            <TextField
              label={locationLabel}
              fullWidth
              value={form.location}
              onChange={(e) => set("location", e.target.value)}
              placeholder={
                form.mode === "online"
                  ? "https://meet.google.com/..."
                  : form.mode === "hybrid" || form.mode === "in_person"
                    ? "Office address, floor / meeting room"
                    : ""
              }
              helperText={form.mode === "hybrid" ? "For anyone attending in person" : undefined}
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

            {!round ? (
              <Box>
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: "#374151" }}>
                  Checklist (optional)
                </Typography>
                <Typography sx={{ fontSize: "0.75rem", color: "#6b7280", mb: 1 }}>
                  Points the panel should cover. They see it on their panel page, can tick items and add their own.
                </Typography>
                {form.checklist.length ? (
                  <Stack spacing={0.5} sx={{ mb: 1 }}>
                    {form.checklist.map((item, i) => (
                      <Box
                        key={`${i}-${item}`}
                        sx={{ display: "flex", alignItems: "center", gap: 1, px: 1.25, py: 0.5, borderRadius: 1.5, bgcolor: "#F5FCFB", border: "1px solid #dcefed" }}
                      >
                        <Typography sx={{ flex: 1, fontSize: "0.84rem", color: "#111", wordBreak: "break-word" }}>{item}</Typography>
                        <IconButton
                          size="small"
                          aria-label="Remove item"
                          onClick={() => set("checklist", form.checklist.filter((_, j) => j !== i))}
                          sx={{ color: "#9ca3af", "&:hover": { color: "#dc2626" } }}
                        >
                          <CloseIcon sx={{ fontSize: 16 }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                ) : null}
                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    value={checklistText}
                    onChange={(e) => setChecklistText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addChecklistItem();
                      }
                    }}
                    placeholder="e.g. Ask about their last project"
                    inputProps={{ maxLength: 300 }}
                  />
                  <Button
                    onClick={addChecklistItem}
                    disabled={!checklistText.trim()}
                    startIcon={<AddIcon />}
                    sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary, flexShrink: 0 }}
                  >
                    Add
                  </Button>
                </Stack>
              </Box>
            ) : null}

            {/* Interview emails */}
            <Box
              sx={{
                p: 1.5,
                borderRadius: 2,
                border: "1px solid",
                borderColor: sendEmails && form.scheduledAt ? "rgba(29, 87, 88, 0.3)" : "#e5e7eb",
                bgcolor: sendEmails && form.scheduledAt ? "#F5FCFB" : "#fafafa",
              }}
            >
              <FormControlLabel
                sx={{ m: 0, alignItems: "flex-start" }}
                control={
                  <Checkbox
                    checked={sendEmails}
                    disabled={!form.scheduledAt}
                    onChange={(e) => setSendEmails(e.target.checked)}
                    sx={{ p: 0.5, mr: 1, color: "#9ca3af", "&.Mui-checked": { color: BRAND.primary } }}
                  />
                }
                label={
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: "#111" }}>
                      {round ? "Email the updated details to the candidate and panel" : "Email the candidate and panel"}
                    </Typography>
                    <Typography sx={{ fontSize: "0.76rem", color: "#6b7280" }}>
                      {form.scheduledAt
                        ? "The candidate gets an invitation; each panel member gets the details and their panel page link (cc HR). Both include a calendar invite."
                        : "Book a slot first. Emails are sent only when the interview has a date and time."}
                    </Typography>
                  </Box>
                }
              />
            </Box>
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
