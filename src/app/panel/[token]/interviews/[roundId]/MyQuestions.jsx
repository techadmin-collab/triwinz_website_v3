"use client";

import { useEffect, useState } from "react";
import { Box, Button, IconButton, Rating, TextField, Tooltip, Typography } from "@mui/material";
import QuizOutlinedIcon from "@mui/icons-material/QuizOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { toast } from "react-hot-toast";
import { BRAND } from "../../../../../lib/brand";

const RATING_LABELS = { 1: "Poor", 2: "Below expectations", 3: "Meets expectations", 4: "Good", 5: "Excellent" };

async function send(url, method, body) {
  const res = await fetch(url, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");
  return json;
}

function QuestionRow({ index, item, apiBase, locked, onSaved, onDeleted }) {
  const [remarks, setRemarks] = useState(item.remarks || "");
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.question);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedTick, setSavedTick] = useState(false);

  // keep in step when the same question is saved from the other view
  useEffect(() => {
    setRemarks(item.remarks || "");
  }, [item.remarks]);

  async function patch(body) {
    setBusy(true);
    try {
      const json = await send(`${apiBase}/${item.id}`, "PATCH", body);
      onSaved(json.item);
      setSavedTick(true);
      setTimeout(() => setSavedTick(false), 1500);
      return true;
    } catch (err) {
      toast.error(err.message);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function saveQuestion() {
    const value = draft.trim();
    if (!value) return;
    if (value === item.question) return setEditing(false);
    if (await patch({ question: value })) setEditing(false);
  }

  async function remove() {
    setBusy(true);
    try {
      await send(`${apiBase}/${item.id}`, "DELETE");
      onDeleted(item.id);
    } catch (err) {
      toast.error(err.message);
      setBusy(false);
    }
  }

  return (
    <Box sx={{ p: 1.5, borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff", minWidth: 0, "&:hover .q-actions": { opacity: 1 } }}>
      {editing ? (
        <Box>
          <TextField
            fullWidth
            multiline
            minRows={1}
            size="small"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            inputProps={{ maxLength: 500 }}
            autoFocus
          />
          <Box sx={{ display: "flex", gap: 1, mt: 1, justifyContent: "flex-end" }}>
            <Button
              size="small"
              onClick={() => {
                setEditing(false);
                setDraft(item.question);
              }}
              disabled={busy}
              sx={{ textTransform: "none", color: "#4b5563" }}
            >
              Cancel
            </Button>
            <Button
              size="small"
              variant="contained"
              disableElevation
              onClick={saveQuestion}
              disabled={busy || !draft.trim()}
              sx={{ textTransform: "none", fontWeight: 700, bgcolor: BRAND.primary, "&:hover": { bgcolor: BRAND.primaryDark } }}
            >
              Save
            </Button>
          </Box>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
          <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 700, fontSize: "0.88rem", color: "#111", wordBreak: "break-word", whiteSpace: "pre-line" }}>
            {index + 1}. {item.question}
          </Typography>
          {!locked ? (
            <Box className="q-actions" sx={{ display: "flex", flexShrink: 0, mt: -0.5, opacity: { xs: 1, md: 0.4 } }}>
              <Tooltip title="Edit question">
                <IconButton
                  size="small"
                  aria-label="Edit question"
                  onClick={() => {
                    setDraft(item.question);
                    setEditing(true);
                    setConfirmDelete(false);
                  }}
                  sx={{ color: "#6b7280" }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete question">
                <IconButton
                  size="small"
                  aria-label="Delete question"
                  onClick={() => setConfirmDelete(true)}
                  sx={{ color: "#6b7280", "&:hover": { color: "#dc2626" } }}
                >
                  <DeleteOutlineIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            </Box>
          ) : null}
        </Box>
      )}

      {confirmDelete ? (
        <Box sx={{ mt: 0.75, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
          <Typography sx={{ fontSize: "0.78rem", color: "#b91c1c", fontWeight: 600 }}>Delete this question and its rating?</Typography>
          <Button size="small" onClick={() => setConfirmDelete(false)} disabled={busy} sx={{ textTransform: "none", color: "#4b5563", minWidth: 0 }}>
            Cancel
          </Button>
          <Button size="small" onClick={remove} disabled={busy} sx={{ textTransform: "none", fontWeight: 700, color: "#b91c1c", minWidth: 0 }}>
            Delete
          </Button>
        </Box>
      ) : null}

      <Box sx={{ display: "flex", alignItems: "center", gap: 1.25, my: 1, flexWrap: "wrap" }}>
        <Rating
          value={item.rating || null}
          onChange={(_, v) => patch({ rating: v || null })}
          readOnly={locked}
          disabled={busy && !locked}
          sx={{ "& .MuiRating-iconFilled": { color: "#F59E0B" } }}
        />
        <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
          {RATING_LABELS[item.rating] || (locked ? "Not rated" : "Rate the answer 1–5")}
        </Typography>
        {savedTick ? <Typography sx={{ fontSize: "0.75rem", color: "#047857", fontWeight: 700 }}>Saved</Typography> : null}
      </Box>

      <TextField
        label="Remarks"
        size="small"
        fullWidth
        multiline
        minRows={1}
        value={remarks}
        onChange={(e) => setRemarks(e.target.value)}
        onBlur={() => {
          if (!locked && remarks.trim() !== (item.remarks || "").trim()) patch({ remarks });
        }}
        InputProps={{ readOnly: locked }}
        inputProps={{ maxLength: 4000 }}
        helperText={!locked && remarks.trim() !== (item.remarks || "").trim() ? "Saves when you click outside the box" : undefined}
        FormHelperTextProps={{ sx: { mx: 0 } }}
      />
    </Box>
  );
}

/**
 * The panel member's own interview questions for this level: rating + remarks per answer.
 * Private: only this panel member sees them. Controlled: `items` / `onItemsChange` live in the
 * parent so the page and the assessment sheet show the same list.
 */
export default function MyQuestions({ apiBase, roundId, items, onItemsChange, locked = false }) {
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);

  async function add(e) {
    e?.preventDefault();
    const value = text.trim();
    if (!value) return;
    setAdding(true);
    try {
      const json = await send(apiBase, "POST", { roundId, question: value });
      onItemsChange((prev) => [...prev, json.item]);
      setText("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  const rated = items.filter((q) => q.rating).length;

  return (
    <Box sx={{ minWidth: 0 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, flexWrap: "wrap", mb: 0.5 }}>
        <QuizOutlinedIcon sx={{ fontSize: 18, color: BRAND.primary }} />
        <Typography sx={{ fontWeight: 800, fontSize: "0.9rem", color: "#111" }}>My questions</Typography>
        {items.length ? (
          <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
            · {rated} of {items.length} rated
          </Typography>
        ) : null}
        <Box
          sx={{
            ml: "auto",
            display: "inline-flex",
            alignItems: "center",
            gap: 0.4,
            px: 1,
            py: 0.25,
            borderRadius: 10,
            bgcolor: "#F3F4F6",
            color: "#4b5563",
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 13 }} />
          <Typography sx={{ fontSize: "0.7rem", fontWeight: 700 }}>Only you can see these</Typography>
        </Box>
      </Box>
      <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", mb: 1.25 }}>
        Your own questions for this interview. Rate each answer and add remarks. Everything saves as you go.
      </Typography>

      <Box sx={{ display: "grid", gap: 1.25 }}>
        {items.map((item, i) => (
          <QuestionRow
            key={item.id}
            index={i}
            item={item}
            apiBase={apiBase}
            locked={locked}
            onSaved={(saved) => onItemsChange((prev) => prev.map((q) => (q.id === saved.id ? saved : q)))}
            onDeleted={(id) => onItemsChange((prev) => prev.filter((q) => q.id !== id))}
          />
        ))}
      </Box>

      {!locked ? (
        <Box component="form" onSubmit={add} sx={{ display: "flex", gap: 1, mt: items.length ? 1.25 : 0.25, alignItems: "flex-start" }}>
          <TextField
            size="small"
            fullWidth
            multiline
            maxRows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) add(e);
            }}
            placeholder="e.g. Walk me through how you would design a REST API for orders"
            inputProps={{ maxLength: 500 }}
            sx={{ bgcolor: "#fff", "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
          />
          <Button
            type="submit"
            disabled={adding || !text.trim()}
            startIcon={<AddIcon />}
            sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary, flexShrink: 0, mt: 0.25 }}
          >
            Add
          </Button>
        </Box>
      ) : items.length === 0 ? (
        <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>You didn&apos;t add any questions for this interview.</Typography>
      ) : null}
    </Box>
  );
}
