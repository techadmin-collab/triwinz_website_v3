"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  LinearProgress,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import ChecklistIcon from "@mui/icons-material/Checklist";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { toast } from "react-hot-toast";
import { BRAND } from "../../../../lib/brand";

const NO_ITEMS = [];

/**
 * Checklist for one interview level (shared by the admin team and the panel).
 * Props:
 *  - apiBase: POST here to add; PATCH/DELETE `${apiBase}/${id}`
 *  - initialItems
 *  - isAdmin: admin can remove any item; panel members only their own (item.mine)
 *  - locked: read-only (interview closed)
 *  - bare: no outer border/title (when the parent already provides a card)
 *  - onItemsChange(items): optional, called whenever the list changes
 */
export default function InterviewChecklist({
  apiBase,
  initialItems = NO_ITEMS,
  isAdmin = false,
  locked = false,
  bare = false,
  onItemsChange,
}) {
  const [items, setItems] = useState(initialItems);
  const [text, setText] = useState("");
  const [adding, setAdding] = useState(false);
  const [showInput, setShowInput] = useState(false);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  useEffect(() => {
    onItemsChange?.(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const doneCount = items.filter((i) => i.done).length;

  async function add(e) {
    e?.preventDefault();
    const value = text.trim();
    if (!value) return;
    setAdding(true);
    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ text: value }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not add the item");
      setItems((prev) => [...prev, json.item]);
      setText("");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setAdding(false);
    }
  }

  async function toggle(item) {
    const next = !item.done;
    setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, done: next } : i)));
    try {
      const res = await fetch(`${apiBase}/${item.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ done: next }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not update the item");
      setItems((prev) => prev.map((i) => (i.id === item.id ? json.item : i)));
    } catch (err) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
      toast.error(err.message);
    }
  }

  async function remove(item) {
    const before = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));
    try {
      const res = await fetch(`${apiBase}/${item.id}`, { method: "DELETE" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not remove the item");
    } catch (err) {
      setItems(before);
      toast.error(err.message);
    }
  }

  const canRemove = (item) => !locked && (isAdmin || item.mine);

  const body = (
    <>
      {!bare ? (
        <Box sx={{ display: "flex", alignItems: "center", gap: 0.75, mb: items.length ? 1 : 0.5 }}>
          <ChecklistIcon sx={{ fontSize: 18, color: BRAND.primary }} />
          <Typography sx={{ fontWeight: 800, fontSize: "0.84rem", color: "#111" }}>Interview checklist</Typography>
          {items.length ? (
            <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
              · {doneCount} of {items.length} done
            </Typography>
          ) : (
            <Typography sx={{ fontSize: "0.75rem", color: "#9ca3af" }}>· optional</Typography>
          )}
        </Box>
      ) : items.length ? (
        <Typography sx={{ fontSize: "0.78rem", color: "#6b7280", mb: 1 }}>
          {doneCount} of {items.length} done
        </Typography>
      ) : null}

      {items.length ? (
        <LinearProgress
          variant="determinate"
          value={(doneCount / items.length) * 100}
          sx={{ height: 4, borderRadius: 2, mb: 1, bgcolor: "#e6efee", "& .MuiLinearProgress-bar": { bgcolor: BRAND.accentDark } }}
        />
      ) : null}

      <Box sx={{ display: "grid", gap: 0.25 }}>
        {items.map((item) => (
          <Box
            key={item.id}
            sx={{
              display: "flex",
              alignItems: "flex-start",
              gap: 0.5,
              minWidth: 0,
              borderRadius: 1.5,
              pr: 0.5,
              "&:hover .remove": { opacity: 1 },
              "&:hover": { bgcolor: "#f6f9f9" },
            }}
          >
            <Checkbox
              size="small"
              checked={item.done}
              disabled={locked}
              onChange={() => toggle(item)}
              sx={{ p: 0.75, color: "#9ca3af", "&.Mui-checked": { color: BRAND.primary } }}
              inputProps={{ "aria-label": item.text }}
            />
            <Box sx={{ flex: 1, minWidth: 0, pt: 0.6 }}>
              <Typography
                sx={{
                  fontSize: "0.86rem",
                  color: item.done ? "#9ca3af" : "#111827",
                  textDecoration: item.done ? "line-through" : "none",
                  wordBreak: "break-word",
                  lineHeight: 1.45,
                }}
              >
                {item.text}
              </Typography>
              <Typography sx={{ fontSize: "0.68rem", color: "#9ca3af", mt: 0.1 }}>
                {item.addedBy === "panel" ? `Added by ${item.mine ? "you" : item.addedByName} (panel)` : "Added by TriWinz team"}
                {item.done && item.doneByName ? ` · ticked by ${item.doneByName}` : ""}
              </Typography>
            </Box>
            {canRemove(item) ? (
              <Tooltip title="Remove">
                <IconButton
                  className="remove"
                  size="small"
                  onClick={() => remove(item)}
                  sx={{ mt: 0.25, opacity: { xs: 1, md: 0.35 }, color: "#9ca3af", "&:hover": { color: "#dc2626" } }}
                  aria-label="Remove item"
                >
                  <CloseIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            ) : null}
          </Box>
        ))}
      </Box>

      {!locked ? (
        showInput || items.length === 0 ? (
          <Box component="form" onSubmit={add} sx={{ display: "flex", gap: 1, mt: items.length ? 1 : 0.5, alignItems: "center" }}>
            <TextField
              size="small"
              fullWidth
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={isAdmin ? "e.g. Ask about their last project" : "Add a point to cover"}
              inputProps={{ maxLength: 300 }}
              sx={{ "& .MuiInputBase-input": { fontSize: "0.85rem" } }}
            />
            <Button
              type="submit"
              disabled={adding || !text.trim()}
              startIcon={<AddIcon />}
              sx={{ textTransform: "none", fontWeight: 700, color: BRAND.primary, flexShrink: 0 }}
            >
              Add
            </Button>
          </Box>
        ) : (
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={() => setShowInput(true)}
            sx={{ mt: 0.5, textTransform: "none", fontWeight: 700, color: BRAND.primary, px: 0.75 }}
          >
            Add item
          </Button>
        )
      ) : items.length === 0 ? (
        <Typography sx={{ fontSize: "0.8rem", color: "#9ca3af" }}>No checklist for this interview.</Typography>
      ) : null}
    </>
  );

  if (bare) return body;
  return <Box sx={{ mt: 1.75, p: 1.5, borderRadius: 1.5, border: "1px solid #e5eaea", bgcolor: "#fff" }}>{body}</Box>;
}
