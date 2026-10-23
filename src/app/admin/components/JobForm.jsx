"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Divider,
  FormControlLabel,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { slugify } from "../../../lib/slugify";
import { JOB_TYPES, normalizeJobTypes } from "../../../lib/jobTypes";
import AdminFormShell, {
  AdminFormActions,
  AdminFormLoading,
  FormSection,
} from "./AdminFormShell";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    bgcolor: "#fff",
  },
};

const JOB_TYPE_OPTIONS = JOB_TYPES;

const empty = {
  title: "",
  slug: "",
  department: "",
  location: "",
  type: ["Employment"],
  workMode: "Hybrid",
  experience: "",
  joiningPeriod: "",
  summary: "",
  about: "",
  responsibilities: "",
  requirements: "",
  qualifications: "",
  niceToHave: "",
  published: false,
};

function linesToText(arr) {
  return Array.isArray(arr) ? arr.join("\n") : "";
}

export default function JobForm({ jobId }) {
  const router = useRouter();
  const isEdit = Boolean(jobId);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
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
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [jobId, isEdit, router]);

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !slugTouched) {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    const res = await fetch(
      isEdit ? `/api/admin/jobs/${jobId}` : "/api/admin/jobs",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    setSaving(false);
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success(isEdit ? "Job updated" : "Job created");
    router.push("/admin/jobs");
    router.refresh();
  }

  if (loading) return <AdminFormLoading />;

  return (
    <AdminFormShell
      bare
      maxWidth="100%"
      title={isEdit ? "Edit job" : "Add job"}
      description="Create a role for the careers page. Published jobs appear on the website."
      backHref="/admin/jobs"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <FormSection
          title="Basic information"
          description="Core details shown on the careers listing and job page hero."
        >
          <Stack spacing={2}>
            <TextField
              label="Job title"
              required
              fullWidth
              size="small"
              placeholder="e.g. Senior Full Stack Developer"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              sx={fieldSx}
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
                required
                fullWidth
                size="small"
                helperText="Used in /careers/your-slug"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  update("slug", slugify(e.target.value));
                }}
                sx={fieldSx}
              />
              <TextField
                label="Department"
                required
                fullWidth
                size="small"
                placeholder="e.g. Engineering"
                value={form.department}
                onChange={(e) => update("department", e.target.value)}
                sx={fieldSx}
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
                required
                fullWidth
                size="small"
                placeholder="e.g. Chennai, India"
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Experience"
                fullWidth
                size="small"
                placeholder="e.g. 3–5 years"
                value={form.experience}
                onChange={(e) => update("experience", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Joining period"
                fullWidth
                size="small"
                placeholder="e.g. Immediate, 15 days, 30 days, 60 days"
                helperText="Free text — enter whatever joining timeline you need"
                value={form.joiningPeriod}
                onChange={(e) => update("joiningPeriod", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                select
                label="Job type"
                fullWidth
                size="small"
                value={form.type}
                onChange={(e) =>
                  update(
                    "type",
                    typeof e.target.value === "string"
                      ? e.target.value.split(",")
                      : e.target.value,
                  )
                }
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) =>
                    normalizeJobTypes(selected).join(" / "),
                }}
                helperText="Select one or more job types"
                sx={fieldSx}
              >
                {JOB_TYPE_OPTIONS.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                required
                label="Work mode"
                fullWidth
                size="small"
                value={form.workMode}
                onChange={(e) => update("workMode", e.target.value)}
                sx={fieldSx}
              >
                <MenuItem value="WFH">WFH — Work from home</MenuItem>
                <MenuItem value="WFO">WFO — Work from office</MenuItem>
                <MenuItem value="Hybrid">Hybrid</MenuItem>
              </TextField>
            </Box>
          </Stack>
        </FormSection>

        <FormSection
          title="Role description"
          description="Short summary for cards, plus a fuller about section for the JD page."
        >
          <Stack spacing={2}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
                gap: 2,
              }}
            >
              <TextField
                label="Short summary"
                required
                fullWidth
                size="small"
                multiline
                minRows={4}
                placeholder="One or two sentences shown on the careers card"
                value={form.summary}
                onChange={(e) => update("summary", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="About the role"
                required
                fullWidth
                size="small"
                multiline
                minRows={4}
                placeholder="Describe the role, team, and impact"
                value={form.about}
                onChange={(e) => update("about", e.target.value)}
                sx={fieldSx}
              />
            </Box>
          </Stack>
        </FormSection>

        <FormSection
          title="Responsibilities & requirements"
          description="Enter one item per line. These appear as checklists on the job page."
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
                placeholder={
                  "Own feature delivery end-to-end\nCollaborate with design and product\n..."
                }
                helperText="One responsibility per line"
                value={form.responsibilities}
                onChange={(e) => update("responsibilities", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Requirements"
                fullWidth
                size="small"
                multiline
                minRows={5}
                placeholder={
                  "4+ years with React / Next.js\nStrong communication skills\n..."
                }
                helperText="One requirement per line"
                value={form.requirements}
                onChange={(e) => update("requirements", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Qualifications and certifications"
                fullWidth
                size="small"
                multiline
                minRows={5}
                placeholder={
                  "Bachelor’s degree in Computer Science or related field\nAWS Solutions Architect certification\n..."
                }
                helperText="One qualification or certification per line"
                value={form.qualifications}
                onChange={(e) => update("qualifications", e.target.value)}
                sx={fieldSx}
              />
              <TextField
                label="Nice to have"
                fullWidth
                size="small"
                multiline
                minRows={5}
                placeholder={"AWS experience\nPrior SaaS background\n..."}
                helperText="Optional — one item per line"
                value={form.niceToHave}
                onChange={(e) => update("niceToHave", e.target.value)}
                sx={fieldSx}
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
            <FormControlLabel
              control={
                <Switch
                  checked={form.published}
                  onChange={(e) => update("published", e.target.checked)}
                  color="success"
                />
              }
              label=""
              sx={{ m: 0 }}
            />
          </Box>
        </FormSection>

        <Divider sx={{ my: 1, borderColor: "transparent" }} />

        <AdminFormActions
          sticky
          saving={saving}
          saveLabel={isEdit ? "Update job" : "Create job"}
          onCancel={() => router.push("/admin/jobs")}
        />
      </Box>
    </AdminFormShell>
  );
}
