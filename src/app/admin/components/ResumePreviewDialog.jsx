"use client";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";

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

export default function ResumePreviewDialog({ open, resume, onClose }) {
  const kind = fileKind(resume?.fileName, resume?.url);
  const src = previewUrl(resume?.url, kind);

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
      <DialogTitle sx={{ fontWeight: 700, pb: 1, flexShrink: 0 }}>
        Resume
        {resume ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontWeight: 500 }}
          >
            {resume.fullName}
            {resume.jobTitle ? ` · ${resume.jobTitle}` : ""}
            {resume.fileName ? ` · ${resume.fileName}` : ""}
          </Typography>
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
