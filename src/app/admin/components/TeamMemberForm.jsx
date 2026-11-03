"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import PhotoCameraOutlinedIcon from "@mui/icons-material/PhotoCameraOutlined";
import CropIcon from "@mui/icons-material/Crop";
import ImageCropDialog from "./ImageCropDialog";
import { toast } from "react-hot-toast";
import AdminFormShell, {
  AdminFormActions,
  AdminFormLoading,
} from "./AdminFormShell";
import { BRAND } from "../../../lib/brand";

const empty = {
  name: "",
  role: "",
  bio: "",
  linkedin: "",
  photoUrl: "",
  photoPublicId: "",
  published: true,
};

// The original can be large: only the cropped result (about 0.2MB) is uploaded
const MAX_PHOTO_MB = 15;
// Same portrait shape as the team cards on the About page (200 x 280)
const PHOTO_ASPECT = 5 / 7;
const PHOTO_WIDTH = 900; // saved at 900 x 1260 px

export default function TeamMemberForm({ memberId }) {
  const router = useRouter();
  const isEdit = Boolean(memberId);
  const fileRef = useRef(null);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [cropSrc, setCropSrc] = useState(null); // image being cropped

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await fetch(`/api/admin/team/${memberId}`);
      if (!res.ok) {
        toast.error("Failed to load team member");
        router.push("/admin/team");
        return;
      }
      const data = await res.json();
      setForm({
        name: data.name || "",
        role: data.role || "",
        // paragraphs are edited as text separated by a blank line
        bio: (data.bio || []).join("\n\n"),
        linkedin: data.linkedin || "",
        photoUrl: data.photoUrl || "",
        photoPublicId: data.photoPublicId || "",
        published: data.published !== false,
      });
      setLoading(false);
    })();
  }, [memberId, isEdit, router]);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  // 1) pick a file -> open the cropper
  function handlePhoto(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > MAX_PHOTO_MB * 1024 * 1024) {
      toast.error(`Image too large. Max size is ${MAX_PHOTO_MB}MB.`);
      return;
    }
    setCropSrc(URL.createObjectURL(file));
  }

  function closeCropper() {
    if (cropSrc?.startsWith("blob:")) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  }

  // 2) cropped -> upload to Cloudinary
  async function handleCropped(blob, err) {
    if (!blob) {
      toast.error(
        err?.name === "SecurityError"
          ? "This photo can't be re-cropped here. Please upload it again."
          : "Could not crop the photo.",
      );
      return;
    }
    closeCropper();
    setUploading(true);
    const body = new FormData();
    const slug = (form.name || "team-member").toLowerCase().replace(/[^a-z0-9]+/g, "-");
    body.append("file", new File([blob], `${slug}.jpg`, { type: "image/jpeg" }));
    const res = await fetch("/api/admin/team/upload", { method: "POST", body });
    setUploading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Upload failed");
      return;
    }
    const data = await res.json();
    setForm((prev) => ({ ...prev, photoUrl: data.url, photoPublicId: data.publicId }));
    toast.success("Photo cropped and uploaded");
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (uploading) return;
    setSaving(true);
    const res = await fetch(
      isEdit ? `/api/admin/team/${memberId}` : "/api/admin/team",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    setSaving(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Save failed");
      return;
    }
    toast.success(isEdit ? "Team member updated" : "Team member added");
    router.push("/admin/team");
    router.refresh();
  }

  if (loading) return <AdminFormLoading />;

  return (
    <AdminFormShell
      title={isEdit ? "Edit team member" : "New team member"}
      description="This is shown in the team section of the About page."
      backHref="/admin/team"
      maxWidth={880}
    >
      <Box component="form" onSubmit={handleSubmit}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "220px 1fr" },
            gap: 3,
          }}
        >
          {/* Photo */}
          <Box>
            <Box
              sx={{
                position: "relative",
                width: { xs: 200, md: "100%" },
                mx: { xs: "auto", md: 0 },
                aspectRatio: "5 / 7",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#E6F7F6",
                border: "1px dashed rgba(29, 87, 88, 0.35)",
                display: "grid",
                placeItems: "center",
              }}
            >
              {form.photoUrl ? (
                <Box
                  component="img"
                  src={form.photoUrl}
                  alt={form.name || "Team member photo"}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : (
                <Stack alignItems="center" spacing={1} sx={{ color: BRAND.primary, px: 2, textAlign: "center" }}>
                  <PhotoCameraOutlinedIcon />
                  <Typography sx={{ fontSize: "0.8rem", fontWeight: 600 }}>
                    No photo yet
                  </Typography>
                </Stack>
              )}
              {uploading ? (
                <Box
                  sx={{
                    position: "absolute",
                    inset: 0,
                    bgcolor: "rgba(255,255,255,0.7)",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <CircularProgress size={28} sx={{ color: BRAND.primary }} />
                </Box>
              ) : null}
            </Box>

            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={handlePhoto}
            />
            <Stack spacing={1} sx={{ mt: 1.5, width: { xs: 200, md: "100%" }, mx: { xs: "auto", md: 0 } }}>
              <Button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: BRAND.primary,
                  border: "1px solid rgba(29, 87, 88, 0.25)",
                }}
              >
                {form.photoUrl ? "Change photo" : "Upload photo"}
              </Button>
              {form.photoUrl ? (
                <Button
                  onClick={() => setCropSrc(form.photoUrl)}
                  disabled={uploading}
                  startIcon={<CropIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: BRAND.primary,
                    border: "1px solid rgba(29, 87, 88, 0.25)",
                  }}
                >
                  Adjust crop
                </Button>
              ) : null}
              {form.photoUrl ? (
                <Button
                  onClick={() => setForm((prev) => ({ ...prev, photoUrl: "", photoPublicId: "" }))}
                  disabled={uploading}
                  sx={{ textTransform: "none", fontWeight: 600, color: "#6b7280" }}
                >
                  Remove photo
                </Button>
              ) : null}
              <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>
                You can crop after choosing. Saved as a 5:7 portrait ({PHOTO_WIDTH} × {Math.round(PHOTO_WIDTH / PHOTO_ASPECT)} px). JPG, PNG or WebP, up to {MAX_PHOTO_MB}MB.
              </Typography>
            </Stack>
          </Box>

          {/* Details */}
          <Stack spacing={2}>
            <TextField
              label="Full name"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
            />
            <TextField
              label="Role / title"
              required
              placeholder="e.g. Senior Lead, Frontend Engineering"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
            />
            <TextField
              label="Bio"
              multiline
              minRows={8}
              value={form.bio}
              onChange={(e) => update("bio", e.target.value)}
              helperText="Leave an empty line between paragraphs."
            />
            <TextField
              label="LinkedIn URL (optional)"
              type="url"
              placeholder="https://www.linkedin.com/in/..."
              value={form.linkedin}
              onChange={(e) => update("linkedin", e.target.value)}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={form.published}
                  onChange={(e) => update("published", e.target.checked)}
                />
              }
              label="Show on the About page"
            />
          </Stack>
        </Box>

        <Box sx={{ mt: 3 }}>
          <AdminFormActions
            saving={saving || uploading}
            onCancel={() => router.push("/admin/team")}
          />
        </Box>
      </Box>

      <ImageCropDialog
        open={Boolean(cropSrc)}
        src={cropSrc}
        aspect={PHOTO_ASPECT}
        outputWidth={PHOTO_WIDTH}
        title="Crop team photo"
        hint="Drag to position the face in the frame. Zoom with the slider or mouse wheel."
        onCancel={closeCropper}
        onDone={handleCropped}
      />
    </AdminFormShell>
  );
}
