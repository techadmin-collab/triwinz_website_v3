"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import { toast } from "react-hot-toast";
import AdminPageHeader from "../../../components/AdminPageHeader";
import ConfirmDeleteDialog from "../../../components/ConfirmDeleteDialog";
import { brandButtonSx, BRAND } from "../../../../../lib/brand";

const empty = { name: "", designation: "", company: "", email: "", phone: "", notes: "", active: true };

export default function InterviewersPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null); // {} for new, row for edit
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    const res = await fetch("/api/admin/interviewers");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Failed to load interviewers", { duration: 8000 });
      setLoading(false);
      return;
    }
    setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  function openEditor(row) {
    setEditing(row || {});
    setForm(
      row
        ? {
            name: row.name || "",
            designation: row.designation || "",
            company: row.company || "",
            email: row.email || "",
            phone: row.phone || "",
            notes: row.notes || "",
            active: row.active !== false,
          }
        : empty,
    );
  }

  async function save(e) {
    e.preventDefault();
    setSaving(true);
    const isEdit = Boolean(editing?.id);
    const res = await fetch(isEdit ? `/api/admin/interviewers/${editing.id}` : "/api/admin/interviewers", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Save failed");
      return;
    }
    toast.success(isEdit ? "Interviewer updated" : "Interviewer added");
    setEditing(null);
    load();
  }

  async function confirmDelete() {
    setDeleting(true);
    const res = await fetch(`/api/admin/interviewers/${pendingDelete.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Delete failed", { duration: 6000 });
      return;
    }
    toast.success("Interviewer deleted");
    setPendingDelete(null);
    load();
  }

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Box>
      <Button
        component={Link}
        href="/admin/interviews"
        startIcon={<ArrowBackIcon />}
        sx={{ px: 0, mb: 2, textTransform: "none", fontWeight: 600, color: "#6b7280", "&:hover": { bgcolor: "transparent", color: "#111" } }}
      >
        Interviews
      </Button>
      <AdminPageHeader
        title="Interviewers"
        description="Outside interviewers you assign to interview levels. They don’t need an admin login."
        action={
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            disableElevation
            onClick={() => openEditor(null)}
            sx={{ ...brandButtonSx, fontWeight: 700, px: 2 }}
          >
            Add interviewer
          </Button>
        }
      />

      <Paper elevation={0} sx={{ borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress size={28} sx={{ color: BRAND.primary }} />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <BadgeOutlinedIcon sx={{ color: BRAND.primary, fontSize: 32, mb: 1 }} />
            <Typography sx={{ fontWeight: 700, color: "#111" }}>No interviewers yet</Typography>
            <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Add them here, or just type a new name while scheduling a level.
            </Typography>
          </Box>
        ) : (
          rows.map((row, index) => (
            <Box
              key={row.id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1.5, sm: 2 },
                px: { xs: 1.5, sm: 2.25 },
                py: 1.5,
                borderBottom: index === rows.length - 1 ? 0 : "1px solid #f1f2f4",
                opacity: row.active ? 1 : 0.55,
              }}
            >
              <Avatar sx={{ width: 40, height: 40, bgcolor: "#E6F7F6", color: BRAND.primary, fontWeight: 800 }}>
                {row.name?.[0]?.toUpperCase()}
              </Avatar>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                  <Typography sx={{ fontWeight: 700, color: "#111" }}>{row.name}</Typography>
                  {!row.active ? (
                    <Typography component="span" sx={{ fontSize: "0.7rem", fontWeight: 800, color: "#6b7280", bgcolor: "#f3f4f6", px: 0.8, borderRadius: 999 }}>
                      INACTIVE
                    </Typography>
                  ) : null}
                </Box>
                <Typography sx={{ fontSize: "0.8rem", color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {[row.designation, row.company].filter(Boolean).join(" · ") || "No details"}
                  {row.email ? ` · ${row.email}` : ""}
                  {row.phone ? ` · ${row.phone}` : ""}
                </Typography>
              </Box>
              <Typography sx={{ display: { xs: "none", sm: "block" }, fontSize: "0.8rem", color: "#6b7280", whiteSpace: "nowrap" }}>
                {row.interviewCount} level{row.interviewCount === 1 ? "" : "s"}
              </Typography>
              <Stack direction="row" spacing={0.5}>
                <Tooltip title="Edit">
                  <IconButton size="small" onClick={() => openEditor(row)} sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5 }}>
                    <EditOutlinedIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={() => setPendingDelete(row)}
                    sx={{ border: "1px solid #fecaca", borderRadius: 1.5, color: "#dc2626", "&:hover": { bgcolor: "#fef2f2" } }}
                  >
                    <DeleteOutlineIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Box>
          ))
        )}
      </Paper>

      <Dialog open={Boolean(editing)} onClose={saving ? undefined : () => setEditing(null)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <Box component="form" onSubmit={save}>
          <DialogTitle sx={{ fontWeight: 800 }}>{editing?.id ? "Edit interviewer" : "Add interviewer"}</DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="Full name" required value={form.name} onChange={(e) => set("name", e.target.value)} />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Designation" fullWidth value={form.designation} onChange={(e) => set("designation", e.target.value)} placeholder="e.g. Senior Architect" />
                <TextField label="Company" fullWidth value={form.company} onChange={(e) => set("company", e.target.value)} />
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField label="Email" type="email" fullWidth value={form.email} onChange={(e) => set("email", e.target.value)} />
                <TextField label="Phone" fullWidth value={form.phone} onChange={(e) => set("phone", e.target.value)} />
              </Stack>
              <TextField label="Notes" multiline minRows={2} value={form.notes} onChange={(e) => set("notes", e.target.value)} placeholder="Areas of expertise, availability..." />
              <FormControlLabel
                control={<Switch checked={form.active} onChange={(e) => set("active", e.target.checked)} />}
                label="Active (can be assigned to new levels)"
              />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2.5 }}>
            <Button onClick={() => setEditing(null)} disabled={saving} sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disableElevation disabled={saving} sx={{ ...brandButtonSx, fontWeight: 700, px: 2.5 }}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this interviewer?"
        description={
          pendingDelete?.interviewCount
            ? "They are part of interview history, so they can’t be deleted. Edit them and switch off Active instead."
            : `“${pendingDelete?.name}” will be removed.`
        }
        loading={deleting}
        onClose={() => !deleting && setPendingDelete(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
