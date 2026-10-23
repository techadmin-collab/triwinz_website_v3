"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "next/link";
import { formatJobTypes, normalizeJobTypes } from "../../../lib/jobTypes";
import AdminFormShell, { AdminFormLoading, FormSection } from "./AdminFormShell";
import { brandButtonSx } from "../../../lib/brand";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    bgcolor: "#f9fafb",
  },
  "& .MuiInputBase-input.Mui-disabled": {
    WebkitTextFillColor: "#111",
    color: "#111",
  },
};

const readOnlyFieldProps = {
  InputProps: { readOnly: true },
  disabled: true,
};

function linesToText(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

export default function JobView({ jobId }) {
  const router = useRouter();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/admin/jobs/${jobId}`);
      if (!res.ok) {
        toast.error("Failed to load job");
        router.push("/admin/jobs");
        return;
      }
      const data = await res.json();
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        department: data.department || "",
        location: data.location || "",
        type: normalizeJobTypes(data.type),
        workMode: data.workMode || "Hybrid",
        experience: data.experience || "",
        joiningPeriod: data.joiningPeriod || "",
        summary: data.summary || "",
        about: data.about || "",
        responsibilities: linesToText(data.responsibilities),
        requirements: linesToText(data.requirements),
        qualifications: linesToText(data.qualifications),
        niceToHave: linesToText(data.niceToHave),
        published: Boolean(data.published),
      });
      setLoading(false);
    })();
  }, [jobId, router]);

  if (loading) return <AdminFormLoading />;
  if (!form) return null;

  return (
    <AdminFormShell
      bare
      maxWidth="100%"
      title="View job"
      description="Read-only preview of this role as stored in the admin."
      backHref="/admin/jobs"
    >
      <FormSection
        title="Basic information"
        description="Core details shown on the careers listing and job page hero."
      >
        <Stack spacing={2}>
          <TextField
            label="Job title"
            fullWidth
            size="small"
            value={form.title}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 2,
            }}
          >
            <TextField
              label="URL slug"
              fullWidth
              size="small"
              helperText="Used in /careers/your-slug"
              value={form.slug}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
            <TextField
              label="Department"
              fullWidth
              size="small"
              value={form.department}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "1fr 1fr",
                xl: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <TextField
              label="Location"
              fullWidth
              size="small"
              value={form.location}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
            <TextField
              label="Experience"
              fullWidth
              size="small"
              value={form.experience}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
            <TextField
              label="Joining period"
              fullWidth
              size="small"
              value={form.joiningPeriod || "—"}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
            <TextField
              label="Job type"
              fullWidth
              size="small"
              value={formatJobTypes(form.type)}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
            <TextField
              label="Work mode"
              fullWidth
              size="small"
              value={form.workMode}
              sx={fieldSx}
              {...readOnlyFieldProps}
            />
          </Box>
        </Stack>
      </FormSection>

      <FormSection
        title="Role description"
        description="Short summary for cards, plus a fuller about section for the JD page."
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Short summary"
            fullWidth
            size="small"
            multiline
            minRows={4}
            value={form.summary}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />
          <TextField
            label="About the role"
            fullWidth
            size="small"
            multiline
            minRows={4}
            value={form.about}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />
        </Box>
      </FormSection>

      <FormSection
        title="Responsibilities & requirements"
        description="One item per line — shown as checklists on the job page."
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 2,
          }}
        >
          <TextField
            label="Responsibilities"
            fullWidth
            size="small"
            multiline
            minRows={5}
            value={form.responsibilities}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />
          <TextField
            label="Requirements"
            fullWidth
            size="small"
            multiline
            minRows={5}
            value={form.requirements}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />
          <TextField
            label="Qualifications and certifications"
            fullWidth
            size="small"
            multiline
            minRows={5}
            value={form.qualifications}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />
          <TextField
            label="Nice to have"
            fullWidth
            size="small"
            multiline
            minRows={5}
            value={form.niceToHave}
            sx={fieldSx}
            {...readOnlyFieldProps}
          />
        </Box>
      </FormSection>

      <FormSection title="Publishing">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            p: 2,
            borderRadius: 2,
            bgcolor: form.published ? "#ecfdf5" : "#f9fafb",
            border: "1px solid",
            borderColor: form.published ? "#a7f3d0" : "#e5e7eb",
          }}
        >
          <Box>
            <Typography sx={{ fontWeight: 700, color: "#111" }}>
              {form.published ? "Published" : "Draft"}
            </Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "0.85rem", mt: 0.25 }}>
              {form.published
                ? "This job is visible on the public careers page."
                : "Saved as draft — not visible on the website yet."}
            </Typography>
          </Box>
          <Chip
            size="small"
            label={form.published ? "Published" : "Draft"}
            sx={{
              fontWeight: 700,
              bgcolor: form.published ? "#d1fae5" : "#e5e7eb",
              color: form.published ? "#047857" : "#4b5563",
            }}
          />
        </Box>
      </FormSection>

      <Stack
        direction={{ xs: "column-reverse", sm: "row" }}
        spacing={1.25}
        justifyContent="center"
        sx={{
          position: "sticky",
          bottom: 0,
          mt: 2,
          py: 2,
          bgcolor: "rgba(250,248,255,0.95)",
          backdropFilter: "blur(8px)",
          borderTop: "1px solid rgba(80, 20, 210, 0.1)",
          zIndex: 2,
        }}
      >
        <Button
          component={Link}
          href="/admin/jobs"
          sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}
        >
          Back to jobs
        </Button>
        {form.published ? (
          <Button
            component={Link}
            href={`/careers/${form.slug}`}
            target="_blank"
            startIcon={<OpenInNewIcon />}
            sx={{ textTransform: "none", fontWeight: 600, color: "#5014d2" }}
          >
            View on website
          </Button>
        ) : null}
        <Button
          component={Link}
          href={`/admin/jobs/${jobId}/edit`}
          variant="contained"
          disableElevation
          startIcon={<EditOutlinedIcon />}
          sx={{
            ...brandButtonSx,
            fontWeight: 700,
            px: 2.75,
          }}
        >
          Edit job
        </Button>
      </Stack>
    </AdminFormShell>
  );
}
