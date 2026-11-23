"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { BRAND } from "../../../lib/brand";
import { needsReason, reasonLabel, reasonPlaceholder } from "../../../lib/applicationStatus";

function fileKind(fileName = "", url = "") {
  const value = `${fileName} ${url}`.toLowerCase();
  if (value.includes(".pdf")) return "pdf";
  if (value.includes(".doc")) return "office";
  return "other";
}

function previewUrl(url, kind) {
  if (!url) return "";
  if (kind === "pdf") return url;
  if (kind === "office") {
    return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(url)}`;
  }
  return `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(url)}`;
}

/**
 * Optional status control: pass `statusOptions` ([{ value, label }]) and
 * `onStatusSave(nextStatus, reason)` (async, throws on failure); `resume.status` is the current
 * status and `resume.statusReason` its reason (Reviewed / On hold / Marked for rejection need one).
 */
export default function ResumePreviewDialog({ open, resume, onClose, statusOptions, onStatusSave }) {
  const kind = fileKind(resume?.fileName, resume?.url);
  const src = previewUrl(resume?.url, kind);
  const showStatus = Boolean(statusOptions?.length && onStatusSave && resume?.status);
  const [status, setStatus] = useState(resume?.status || "");
  const [savedStatus, setSavedStatus] = useState(resume?.status || "");
  const [saving, setSaving] = useState(false);
  const [reason, setReason] = useState(resume?.statusReason || "");
  const [savedReason, setSavedReason] = useState(resume?.statusReason || "");

  useEffect(() => {
    setStatus(resume?.status || "");
    setSavedStatus(resume?.status || "");
    setReason(resume?.statusReason || "");
    setSavedReason(resume?.statusReason || "");
  }, [resume]);

  const askReason = showStatus && needsReason(status);
  const changed =
    showStatus && (status !== savedStatus || (askReason && reason.trim() !== savedReason.trim()));
  const missingReason = askReason && !reason.trim();

  async function saveStatus() {
    setSaving(true);
    try {
      await onStatusSave(status, reason.trim());
      setSavedStatus(status);
      setSavedReason(reason.trim());
    } catch {
      // the page shows the error
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          width: "96vw",
          maxWidth: 1600,
          height: "96vh",
          maxHeight: "96vh",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        component="div"
        sx={{
          pb: 1,
          flexShrink: 0,
          display: "flex",
          alignItems: { xs: "flex-start", sm: "center" },
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography component="h2" sx={{ fontWeight: 700, fontSize: "1.25rem" }}>
            Resume
          </Typography>
          {resume ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontWeight: 500, wordBreak: "break-word" }}
            >
              {resume.fullName}
              {resume.jobTitle ? ` · ${resume.jobTitle}` : ""}
              {resume.fileName ? ` · ${resume.fileName}` : ""}
            </Typography>
          ) : null}
        </Box>
        {showStatus ? (
          <Box sx={{ flexShrink: 0, width: { xs: "100%", sm: "auto" } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <TextField
                select
                size="small"
                label="Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                disabled={saving}
                sx={{ minWidth: 170, flex: { xs: 1, sm: "none" } }}
              >
                {statusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                disableElevation
                onClick={saveStatus}
                disabled={!changed || saving || missingReason}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: BRAND.primary,
                  "&:hover": { bgcolor: BRAND.primaryDark },
                }}
              >
                {saving ? "Saving..." : "Update"}
              </Button>
            </Box>
            {askReason ? (
              <TextField
                size="small"
                required
                multiline
                maxRows={3}
                label={reasonLabel(status)}
                placeholder={reasonPlaceholder(status)}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={saving}
                inputProps={{ maxLength: 1000 }}
                sx={{ mt: 1, width: { xs: "100%", sm: 340 }, display: "block", "& .MuiInputBase-root": { width: "100%" } }}
              />
            ) : null}
            {changed && status === "rejected" ? (
              <Typography sx={{ mt: 0.5, fontSize: "0.75rem", color: "#b91c1c", fontWeight: 600 }}>
                The candidate will get a rejection email.
              </Typography>
            ) : null}
          </Box>
        ) : null}
      </DialogTitle>
      <DialogContent
        sx={{
          px: 2.5,
          pb: 0,
          display: "flex",
          flex: 1,
          minHeight: 0,
        }}
      >
        {src ? (
          <iframe
            title="Resume preview"
            src={src}
            style={{
              width: "100%",
              height: "100%",
              border: "1px solid #e5e7eb",
              borderRadius: 8,
              background: "#f9fafb",
            }}
          />
        ) : (
          <Typography color="text.secondary">No resume available.</Typography>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, flexShrink: 0 }}>
        {resume?.url ? (
          <Button
            href={resume.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{ textTransform: "none", fontWeight: 700, mr: "auto" }}
          >
            Open original
          </Button>
        ) : null}
        <Button
          onClick={onClose}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
