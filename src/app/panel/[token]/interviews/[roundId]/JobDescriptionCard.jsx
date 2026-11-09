"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { BRAND } from "../../../../../lib/brand";
import { formatJobTypes } from "../../../../../lib/jobTypes";
import { getWorkModeLabel } from "../../../../(marketing)/careers/sections/workMode";

const list = (items) => (Array.isArray(items) ? items.map((i) => String(i || "").trim()).filter(Boolean) : []);

function Facts({ job }) {
  const rows = [
    { icon: LocationOnOutlinedIcon, text: job.location },
    { icon: HomeWorkOutlinedIcon, text: getWorkModeLabel(job.workMode) },
    { icon: WorkOutlineIcon, text: job.experience },
    { icon: EventAvailableOutlinedIcon, text: job.joiningPeriod ? `Joining · ${job.joiningPeriod}` : "" },
  ].filter((r) => r.text);
  return (
    <Box sx={{ display: "flex", flexWrap: "wrap", columnGap: 2.5, rowGap: 0.75, color: "#4b5563" }}>
      {rows.map(({ icon: Icon, text }) => (
        <Box key={text} sx={{ display: "flex", alignItems: "center", gap: 0.75, minWidth: 0 }}>
          <Icon sx={{ fontSize: 17, color: "#6b7280" }} />
          <Typography sx={{ fontSize: "0.84rem", fontWeight: 500 }}>{text}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function Chips({ job }) {
  return (
    <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
      {job.department ? (
        <Chip label={job.department} size="small" sx={{ bgcolor: "#f3f4f6", color: "#1f2937", fontWeight: 600 }} />
      ) : null}
      <Chip label={formatJobTypes(job.type)} size="small" sx={{ bgcolor: "rgba(29, 87, 88, 0.08)", color: BRAND.primary, fontWeight: 600 }} />
      <Chip label={job.workMode || "Hybrid"} size="small" sx={{ bgcolor: "rgba(43, 209, 199, 0.1)", color: "#178C85", fontWeight: 600 }} />
    </Stack>
  );
}

function Bullets({ items }) {
  return (
    <Box sx={{ display: "grid", gap: 0.9 }}>
      {items.map((item, i) => (
        <Box key={`${i}-${item}`} sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 18, color: BRAND.accentDark, mt: 0.2, flexShrink: 0 }} />
          <Typography sx={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.65 }}>{item}</Typography>
        </Box>
      ))}
    </Box>
  );
}

function FullSection({ title, children }) {
  return (
    <Box sx={{ py: 2.25, borderTop: "1px solid #eef1f1" }}>
      <Typography sx={{ fontWeight: 800, color: "#111", mb: 1.25, fontSize: "1rem" }}>{title}</Typography>
      {children}
    </Box>
  );
}

/** Short job description (like the careers listing card) with a button for the full one. */
export default function JobDescriptionCard({ job }) {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const qualifications = list(job.qualifications);
  const about = String(job.about || "")
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
  const sections = [
    { title: "Responsibilities", items: list(job.responsibilities) },
    { title: "Requirements", items: list(job.requirements) },
    { title: "Qualifications and certifications", items: qualifications },
    { title: "Nice to have", items: list(job.niceToHave) },
  ].filter((s) => s.items.length);
  const hasMore = about.length > 0 || sections.length > 0;

  return (
    <>
      <Paper elevation={0} sx={{ borderRadius: 2.5, border: "1px solid #e8eaed", overflow: "hidden", minWidth: 0 }}>
        <Box sx={{ height: 6, background: BRAND.gradientWide }} />
        <Box sx={{ p: { xs: 1.75, sm: 2.25 } }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            <ArticleOutlinedIcon sx={{ fontSize: 20, color: BRAND.primary }} />
            <Typography sx={{ fontWeight: 800, color: "#111" }}>Job description</Typography>
          </Box>

          <Chips job={job} />

          <Typography sx={{ mt: 1.5, fontWeight: 800, fontSize: "1.05rem", color: "#111" }}>{job.title}</Typography>

          {job.summary ? (
            <Typography sx={{ mt: 0.75, fontSize: "0.88rem", color: "#4b5563", lineHeight: 1.65, whiteSpace: "pre-line" }}>
              {job.summary}
            </Typography>
          ) : null}

          {qualifications.length ? (
            <Box sx={{ mt: 1.5 }}>
              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: "#374151", mb: 0.5 }}>
                Qualifications and Certifications
              </Typography>
              <Stack spacing={0.4}>
                {qualifications.map((q, i) => (
                  <Typography key={`${i}-${q}`} sx={{ fontSize: "0.85rem", color: "#4b5563", lineHeight: 1.6 }}>
                    • {q}
                  </Typography>
                ))}
              </Stack>
            </Box>
          ) : null}

          <Box sx={{ mt: 1.75 }}>
            <Facts job={job} />
          </Box>

          {hasMore ? (
            <Button
              onClick={() => setOpen(true)}
              startIcon={<ArticleOutlinedIcon />}
              sx={{
                mt: 2,
                textTransform: "none",
                fontWeight: 700,
                color: BRAND.primary,
                border: "1px solid rgba(29, 87, 88, 0.25)",
                px: 2,
                "&:hover": { bgcolor: "#E6F7F6" },
              }}
            >
              View full job description
            </Button>
          ) : null}
        </Box>
      </Paper>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullScreen={fullScreen}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: fullScreen ? 0 : 3 } }}
      >
        <DialogTitle component="div" sx={{ pb: 1.5, pr: 7 }}>
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em", color: BRAND.primary, mb: 0.5 }}>
            JOB DESCRIPTION
          </Typography>
          <Typography sx={{ fontWeight: 800, fontSize: { xs: "1.2rem", sm: "1.4rem" }, color: "#111", lineHeight: 1.3 }}>
            {job.title}
          </Typography>
          <Box sx={{ mt: 1.25 }}>
            <Chips job={job} />
          </Box>
          <Box sx={{ mt: 1.25 }}>
            <Facts job={job} />
          </Box>
          <IconButton onClick={() => setOpen(false)} aria-label="Close" sx={{ position: "absolute", top: 12, right: 12 }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ pt: 0 }}>
          {job.summary ? (
            <Typography sx={{ py: 2.25, fontSize: "0.95rem", color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>
              {job.summary}
            </Typography>
          ) : null}
          {about.length ? (
            <FullSection title="About the role">
              <Box sx={{ display: "grid", gap: 1.5 }}>
                {about.map((p, i) => (
                  <Typography key={i} sx={{ fontSize: "0.9rem", color: "#374151", lineHeight: 1.75 }}>
                    {p}
                  </Typography>
                ))}
              </Box>
            </FullSection>
          ) : null}
          {sections.map((s) => (
            <FullSection key={s.title} title={s.title}>
              <Bullets items={s.items} />
            </FullSection>
          ))}
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 1.5 }}>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
