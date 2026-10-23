"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { slugify } from "../../../lib/slugify";
import AdminFormShell, {
  AdminFormActions,
  AdminFormLoading,
} from "./AdminFormShell";

const empty = {
  title: "",
  slug: "",
  client: "",
  industry: "",
  summary: "",
  result: "",
  content: "",
  coverImage: "",
  seoTitle: "",
  seoDesc: "",
  published: false,
};

export default function CaseStudyForm({ caseStudyId }) {
  const router = useRouter();
  const isEdit = Boolean(caseStudyId);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await fetch(`/api/admin/case-studies/${caseStudyId}`);
      if (!res.ok) {
        toast.error("Failed to load case study");
        router.push("/admin/case-studies");
        return;
      }
      const data = await res.json();
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        client: data.client || "",
        industry: data.industry || "",
        summary: data.summary || "",
        result: data.result || "",
        content: data.content || "",
        coverImage: data.coverImage || "",
        seoTitle: data.seoTitle || "",
        seoDesc: data.seoDesc || "",
        published: Boolean(data.published),
      });
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [caseStudyId, isEdit, router]);

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
      isEdit
        ? `/api/admin/case-studies/${caseStudyId}`
        : "/api/admin/case-studies",
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
    toast.success(isEdit ? "Case study updated" : "Case study created");
    router.push("/admin/case-studies");
    router.refresh();
  }

  if (loading) return <AdminFormLoading />;

  return (
    <AdminFormShell
      title={isEdit ? "Edit case study" : "New case study"}
      description="Capture client outcomes and publish when ready for the website."
      backHref="/admin/case-studies"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
          />
          <TextField
            label="Slug"
            required
            value={form.slug}
            onChange={(e) => {
              setSlugTouched(true);
              update("slug", slugify(e.target.value));
            }}
          />
          <TextField
            label="Client"
            value={form.client}
            onChange={(e) => update("client", e.target.value)}
          />
          <TextField
            label="Industry"
            value={form.industry}
            onChange={(e) => update("industry", e.target.value)}
          />
          <TextField
            label="Summary"
            required
            multiline
            minRows={2}
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
          />
          <TextField
            label="Result / outcome"
            value={form.result}
            onChange={(e) => update("result", e.target.value)}
          />
          <TextField
            label="Cover image URL"
            value={form.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
          />
          <TextField
            label="Content (HTML or text)"
            required
            multiline
            minRows={8}
            value={form.content}
            onChange={(e) => update("content", e.target.value)}
          />
          <TextField
            label="SEO title"
            value={form.seoTitle}
            onChange={(e) => update("seoTitle", e.target.value)}
          />
          <TextField
            label="SEO description"
            value={form.seoDesc}
            onChange={(e) => update("seoDesc", e.target.value)}
          />
          <FormControlLabel
            control={
              <Switch
                checked={form.published}
                onChange={(e) => update("published", e.target.checked)}
              />
            }
            label="Published"
          />
          <AdminFormActions
            saving={saving}
            onCancel={() => router.push("/admin/case-studies")}
          />
        </Stack>
      </Box>
    </AdminFormShell>
  );
}
