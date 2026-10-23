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
  excerpt: "",
  content: "",
  coverImage: "",
  seoTitle: "",
  seoDesc: "",
  published: false,
};

export default function BlogForm({ blogId }) {
  const router = useRouter();
  const isEdit = Boolean(blogId);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await fetch(`/api/admin/blogs/${blogId}`);
      if (!res.ok) {
        toast.error("Failed to load blog");
        router.push("/admin/blogs");
        return;
      }
      const data = await res.json();
      setForm({
        title: data.title || "",
        slug: data.slug || "",
        excerpt: data.excerpt || "",
        content: data.content || "",
        coverImage: data.coverImage || "",
        seoTitle: data.seoTitle || "",
        seoDesc: data.seoDesc || "",
        published: Boolean(data.published),
      });
      setSlugTouched(true);
      setLoading(false);
    })();
  }, [blogId, isEdit, router]);

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
      isEdit ? `/api/admin/blogs/${blogId}` : "/api/admin/blogs",
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
    toast.success(isEdit ? "Blog updated" : "Blog created");
    router.push("/admin/blogs");
    router.refresh();
  }

  if (loading) {
    return <AdminFormLoading />;
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit blog" : "New blog"}
      description="Write your post content and SEO details, then publish when ready."
      backHref="/admin/blogs"
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
            label="Excerpt"
            value={form.excerpt}
            onChange={(e) => update("excerpt", e.target.value)}
          />
          <TextField
            label="Cover image URL"
            value={form.coverImage}
            onChange={(e) => update("coverImage", e.target.value)}
          />
          <TextField
            label="Content"
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
            onCancel={() => router.push("/admin/blogs")}
          />
        </Stack>
      </Box>
    </AdminFormShell>
  );
}
