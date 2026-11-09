"use client";

import { useEffect, useState } from "react";
import { Box, Button, IconButton, TextField, Tooltip, Typography } from "@mui/material";
import StickyNote2OutlinedIcon from "@mui/icons-material/StickyNote2Outlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-hot-toast";
import { BRAND } from "../../../../lib/brand";

const NO_NOTES = [];

function when(value) {
  return new Date(value).toLocaleString(undefined, {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Running notes for one interview level, written by the admin team.
 * The level's panel members see them on their panel page.
 */
export default function InterviewNotes({ roundId, initialNotes = NO_NOTES }) {
  const [notes, setNotes] = useState(initialNotes);
  const [text, setText] = useState("");
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    setNotes(initialNotes);
  }, [initialNotes]);

  async function add() {
    const value = text.trim();
    if (!value) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/interview-notes", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ roundId, text: value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not add the note");
      setNotes((prev) => [...prev, json.note]);
      setText("");
      setOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit(note) {
    const value = editText.trim();
    if (!value) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/interview-notes/${note.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not save the note");
      setNotes((prev) => prev.map((n) => (n.id === note.id ? json.note : n)));
      setEditingId(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function remove(note) {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/interview-notes/${note.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not delete the note");
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      setConfirmId(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ mt: 1.75, p: 1.5, borderRadius: 1.5, border: "1px solid #e5eaea", bgcolor: "#fff" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: notes.length ? 1 : 0.5 }}>
        <StickyNote2OutlinedIcon sx={{ fontSize: 18, color: BRAND.primary }} />
        <Typography sx={{ fontWeight: 800, fontSize: "0.84rem", color: "#111" }}>Interview notes</Typography>
        <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>
          · {notes.length ? `${notes.length} · ` : ""}visible to the panel
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gap: 1 }}>
        {notes.map((note) => (
          <Box
            key={note.id}
            sx={{ p: 1.25, borderRadius: 1.5, bgcolor: "#F5FCFB", border: "1px solid #dcefed", minWidth: 0, "&:hover .note-actions": { opacity: 1 } }}
          >
            {editingId === note.id ? (
              <>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  size="small"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  inputProps={{ maxLength: 2000 }}
                  autoFocus
                  sx={{ bgcolor: "#fff", "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
                />
                <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
                  <Button size="small" onClick={() => setEditingId(null)} disabled={saving} sx={{ textTransform: "none", color: "#4b5563" }}>
                    Cancel
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    disableElevation
                    onClick={() => saveEdit(note)}
                    disabled={saving || !editText.trim()}
                    sx={{ textTransform: "none", fontWeight: 700, bgcolor: BRAND.primary, "&:hover": { bgcolor: BRAND.primaryDark } }}
                  >
                    Save
                  </Button>
                </Box>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: "0.86rem", color: "#111827", whiteSpace: "pre-line", wordBreak: "break-word", lineHeight: 1.5 }}>
                    {note.text}
                  </Typography>
                  <Typography sx={{ mt: 0.5, fontSize: "0.7rem", color: "#9ca3af" }}>
                    {note.authorName} · {when(note.createdAt)}
                    {note.updatedAt && new Date(note.updatedAt) - new Date(note.createdAt) > 60000 ? " · edited" : ""}
                  </Typography>
                  {confirmId === note.id ? (
                    <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                      <Typography sx={{ fontSize: "0.78rem", color: "#b91c1c", fontWeight: 600 }}>Delete this note?</Typography>
                      <Button size="small" onClick={() => setConfirmId(null)} disabled={saving} sx={{ textTransform: "none", color: "#4b5563", minWidth: 0 }}>
                        Cancel
                      </Button>
                      <Button size="small" onClick={() => remove(note)} disabled={saving} sx={{ textTransform: "none", fontWeight: 700, color: "#b91c1c", minWidth: 0 }}>
                        Delete
                      </Button>
                    </Box>
                  ) : null}
                </Box>
                <Box className="note-actions" sx={{ display: "flex", flexShrink: 0, opacity: { xs: 1, md: 0.4 } }}>
                  <Tooltip title="Edit">
                    <IconButton
                      size="small"
                      onClick={() => {
                        setEditingId(note.id);
                        setEditText(note.text);
                        setConfirmId(null);
                      }}
                      sx={{ color: "#6b7280" }}
                      aria-label="Edit note"
                    >
                      <EditOutlinedIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton size="small" onClick={() => setConfirmId(note.id)} sx={{ color: "#6b7280", "&:hover": { color: "#dc2626" } }} aria-label="Delete note">
                      <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </Box>

      {open ? (
        <Box sx={{ mt: notes.length ? 1.25 : 0.5 }}>
          <TextField
            fullWidth
            multiline
            minRows={2}
            size="small"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Candidate prefers mornings. Focus on system design in this level."
            inputProps={{ maxLength: 2000 }}
            autoFocus
            sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
          />
          <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
            <Button
              size="small"
              onClick={() => {
                setOpen(false);
                setText("");
              }}
              disabled={saving}
              sx={{ textTransform: "none", color: "#4b5563" }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={add}
              disabled={saving || !text.trim()}
              sx={{ textTransform: "none", fontWeight: 700, bgcolor: BRAND.primary, "&:hover": { bgcolor: BRAND.primaryDark } }}
            >
              {saving ? "Saving..." : "Add note"}
            </Button>
          </Box>
        </Box>
      ) : (
        <Button
          size="small"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{ mt: notes.length ? 0.75 : 0, textTransform: "none", fontWeight: 700, color: BRAND.primary, px: 0.75 }}
        >
          Add note
        </Button>
      )}
    </Box>
  );
}
