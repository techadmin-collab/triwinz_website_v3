"use client";

import { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";

export const HR_EMAIL = "joinus@triwinz.com";

/**
 * Shown when a job application can't be submitted:
 * the visitor can email their resume and details to HR instead.
 * Props: jobTitle, details { fullName, email, phone }
 */
export default function HrEmailFallback({ jobTitle, details = {} }) {
  const [copied, setCopied] = useState(false);

  const subject = `Job application: ${jobTitle || "Open position"}`;
  const body = [
    "Hello TriWinz HR team,",
    "",
    `I tried to apply for the ${jobTitle || ""} position on your website, but the form didn't go through. Please find my resume attached.`,
    "",
    `Full name: ${details.fullName || ""}`,
    `Email: ${details.email || ""}`,
    `Phone: ${details.phone || ""}`,
    `Position: ${jobTitle || ""}`,
    "",
    "Thank you",
  ].join("\n");
  const mailto = `mailto:${HR_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(HR_EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  }

  return (
    <Box
      role="alert"
      sx={{
        mb: 2.5,
        p: 2,
        borderRadius: 2.5,
        border: "1px solid #FCD34D",
        bgcolor: "#FFFBEB",
      }}
    >
      <Typography sx={{ fontWeight: 800, color: "#92400E", fontSize: "0.95rem", mb: 0.5 }}>
        Having trouble submitting your application?
      </Typography>
      <Typography sx={{ color: "#78350F", fontSize: "0.88rem", lineHeight: 1.6 }}>
        You can email your resume to our HR team at{" "}
        <Box component="a" href={mailto} sx={{ color: "#1D5758", fontWeight: 800, wordBreak: "break-all" }}>
          {HR_EMAIL}
        </Box>
        . Please include:
      </Typography>
      <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5, color: "#78350F", fontSize: "0.86rem", lineHeight: 1.7 }}>
        <li>Your full name</li>
        <li>Your email address and phone number</li>
        <li>
          The position: <strong>{jobTitle}</strong>
        </li>
        <li>Your resume as an attachment</li>
      </Box>
      <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1.5 }}>
        <Button
          href={mailto}
          startIcon={<MailOutlineIcon />}
          variant="contained"
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 700,
            borderRadius: 2,
            bgcolor: "#1D5758",
            "&:hover": { bgcolor: "#164546" },
          }}
        >
          Email your resume
        </Button>
        <Button
          onClick={copy}
          startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
          sx={{ textTransform: "none", fontWeight: 700, color: "#1D5758", borderRadius: 2, border: "1px solid rgba(29, 87, 88, 0.3)" }}
        >
          {copied ? "Copied" : "Copy email address"}
        </Button>
      </Box>
    </Box>
  );
}
