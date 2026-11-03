"use client";

import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Switch,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import CloudDownloadOutlinedIcon from "@mui/icons-material/CloudDownloadOutlined";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import Link from "next/link";
import { toast } from "react-hot-toast";
import AdminPageHeader from "../../components/AdminPageHeader";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import { brandButtonSx, BRAND } from "../../../../lib/brand";

const iconBtnSx = { border: "1px solid #e5e7eb", borderRadius: 1.5 };

export default function AdminTeamPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/team");
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Failed to load team", { duration: 8000 });
      setLoading(false);
      return;
    }
    setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function importDefaults() {
    setImporting(true);
    const res = await fetch("/api/admin/team/import", { method: "POST" });
    setImporting(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || "Import failed");
      return;
    }
    const data = await res.json();
    toast.success(`Imported ${data.imported} team members`);
    load();
  }

  async function saveOrder(next) {
    setSavingOrder(true);
    const res = await fetch("/api/admin/team/reorder", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((m) => m.id) }),
    });
    setSavingOrder(false);
    if (!res.ok) {
      toast.error("Could not save the new order");
      load();
      return;
    }
    toast.success("Order saved");
  }

  async function move(index, delta) {
    const target = index + delta;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    [next[index], next[target]] = [next[target], next[index]];
    setRows(next); // move straight away, save in the background
    saveOrder(next);
  }

  /* ---------- Drag & drop (pointer events: works with mouse and touch) ---------- */
  const rowRefs = useRef(new Map());
  const dragRef = useRef(null); // { id, startOrder }
  const rowsRef = useRef(rows); // latest order, read when the drag ends
  rowsRef.current = rows;
  const [draggingId, setDraggingId] = useState(null);

  // Move/up are tracked on the window, not the handle: rows get re-ordered in the page
  // while dragging, and moving an element cancels its pointer capture.
  function onHandlePointerDown(e, member) {
    if (savingOrder || dragRef.current) return;
    if (e.pointerType === "mouse" && e.button !== 0) return;
    e.preventDefault();
    dragRef.current = {
      id: member.id,
      startOrder: rows.map((m) => m.id).join(","),
    };
    setDraggingId(member.id);

    const onMove = (ev) => handleDragMove(ev.clientY);
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      handleDragEnd();
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  }

  function handleDragMove(y) {
    const drag = dragRef.current;
    if (!drag) return;

    // keep scrolling while dragging near the top / bottom of the window
    if (y < 80) window.scrollBy(0, -12);
    else if (y > window.innerHeight - 80) window.scrollBy(0, 12);

    setRows((prev) => {
      const from = prev.findIndex((m) => m.id === drag.id);
      if (from === -1) return prev;
      // new position = how many other rows have their middle above the pointer
      let to = 0;
      prev.forEach((m) => {
        if (m.id === drag.id) return;
        const el = rowRefs.current.get(m.id);
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top + r.height / 2 < y) to += 1;
      });
      if (to === from) return prev;
      const next = [...prev];
      const [item] = next.splice(from, 1);
      next.splice(to, 0, item);
      return next;
    });
  }

  function handleDragEnd() {
    const drag = dragRef.current;
    if (!drag) return;
    dragRef.current = null;
    setDraggingId(null);
    // wait one frame so rowsRef has the final order
    requestAnimationFrame(() => {
      const current = rowsRef.current;
      if (current.map((m) => m.id).join(",") !== drag.startOrder) {
        saveOrder(current);
      }
    });
  }

  async function toggleVisible(member) {
    const published = !member.published;
    setRows((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, published } : m)),
    );
    const res = await fetch(`/api/admin/team/${member.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      load();
      return;
    }
    toast.success(published ? "Shown on the About page" : "Hidden from the About page");
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/team/${pendingDelete.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Team member deleted");
    setPendingDelete(null);
    load();
  }

  const visibleCount = rows.filter((m) => m.published).length;

  return (
    <Box>
      <AdminPageHeader
        title="Team"
        description="People shown in the Leadership & Core Delivery Team section of the About page. The first visible member is featured at the top."
        action={
          <Stack direction="row" spacing={1}>
            <Button
              component="a"
              href="/about"
              target="_blank"
              rel="noopener"
              endIcon={<OpenInNewIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: BRAND.primary,
                border: "1px solid rgba(29, 87, 88, 0.2)",
                px: 2,
              }}
            >
              View page
            </Button>
            <Button
              component={Link}
              href="/admin/team/new"
              startIcon={<AddIcon />}
              variant="contained"
              disableElevation
              sx={{ ...brandButtonSx, fontWeight: 700, px: 2 }}
            >
              Add member
            </Button>
          </Stack>
        }
      />

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff" }}
      >
        {loading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress size={28} sx={{ color: BRAND.primary }} />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ p: { xs: 4, md: 8 }, textAlign: "center" }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                bgcolor: "#E6F7F6",
                color: BRAND.primary,
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 2,
              }}
            >
              <GroupsOutlinedIcon />
            </Box>
            <Typography sx={{ fontWeight: 800, color: "#111", mb: 0.5 }}>
              No team members in the database yet
            </Typography>
            <Typography
              color="text.secondary"
              sx={{ mb: 3, maxWidth: 520, mx: "auto", fontSize: "0.92rem" }}
            >
              The About page is still showing the original built-in team. Import
              them here to start managing them, or add members one by one.
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.25}
              justifyContent="center"
            >
              <Button
                onClick={importDefaults}
                disabled={importing}
                startIcon={<CloudDownloadOutlinedIcon />}
                variant="contained"
                disableElevation
                sx={{ ...brandButtonSx, fontWeight: 700, px: 2.5 }}
              >
                {importing ? "Importing..." : "Import current team (10)"}
              </Button>
              <Button
                component={Link}
                href="/admin/team/new"
                startIcon={<AddIcon />}
                sx={{
                  textTransform: "none",
                  fontWeight: 700,
                  color: BRAND.primary,
                  border: "1px solid rgba(29, 87, 88, 0.2)",
                  px: 2.5,
                }}
              >
                Add member
              </Button>
            </Stack>
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                px: 2.5,
                py: 1.5,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                borderBottom: "1px solid #eef0f3",
                bgcolor: "#fafafa",
                borderRadius: "8px 8px 0 0",
              }}
            >
              <Typography sx={{ fontSize: "0.85rem", color: "#4b5563", fontWeight: 600 }}>
                {visibleCount} of {rows.length} shown on the About page · drag{" "}
                <DragIndicatorIcon sx={{ fontSize: 16, verticalAlign: "-3px", color: "#9ca3af" }} />{" "}
                to change the order
              </Typography>
              {savingOrder ? (
                <Typography sx={{ fontSize: "0.8rem", color: BRAND.primary }}>
                  Saving order...
                </Typography>
              ) : null}
            </Box>

            {rows.map((member, index) => (
              <Box
                key={member.id}
                ref={(el) => {
                  if (el) rowRefs.current.set(member.id, el);
                  else rowRefs.current.delete(member.id);
                }}
                sx={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  gap: { xs: 1.25, sm: 2 },
                  px: { xs: 1.5, sm: 2.5 },
                  py: 1.5,
                  borderBottom: index === rows.length - 1 ? 0 : "1px solid #f1f2f4",
                  opacity: member.published ? 1 : 0.6,
                  transition: "box-shadow 0.15s ease, background-color 0.15s ease",
                  "&:hover": { bgcolor: "#F5FCFB" },
                  ...(draggingId === member.id
                    ? {
                        zIndex: 2,
                        opacity: 1,
                        bgcolor: "#E6F7F6",
                        boxShadow: "0 12px 28px rgba(29, 87, 88, 0.22)",
                        outline: `2px solid ${BRAND.primary}`,
                        outlineOffset: -2,
                        borderRadius: 1.5,
                        "&:hover": { bgcolor: "#E6F7F6" },
                      }
                    : {}),
                }}
              >
                {/* Drag handle */}
                <Tooltip title={draggingId ? "" : "Drag to reorder"} placement="left">
                  <Box
                    role="button"
                    aria-label={`Drag to reorder ${member.name}`}
                    onPointerDown={(e) => onHandlePointerDown(e, member)}
                    sx={{
                      flexShrink: 0,
                      display: "grid",
                      placeItems: "center",
                      width: 30,
                      height: 44,
                      borderRadius: 1,
                      color: draggingId === member.id ? BRAND.primary : "#9ca3af",
                      cursor: draggingId ? "grabbing" : "grab",
                      touchAction: "none",
                      userSelect: "none",
                      "&:hover": { bgcolor: "rgba(29, 87, 88, 0.08)", color: BRAND.primary },
                    }}
                  >
                    <DragIndicatorIcon />
                  </Box>
                </Tooltip>

                {/* Order arrows (keyboard / fallback) */}
                <Stack spacing={0.25} sx={{ flexShrink: 0, display: { xs: "none", sm: "flex" } }}>
                  <IconButton
                    size="small"
                    aria-label="Move up"
                    disabled={index === 0 || savingOrder || Boolean(draggingId)}
                    onClick={() => move(index, -1)}
                    sx={{ p: 0.25 }}
                  >
                    <ArrowUpwardIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label="Move down"
                    disabled={index === rows.length - 1 || savingOrder || Boolean(draggingId)}
                    onClick={() => move(index, 1)}
                    sx={{ p: 0.25 }}
                  >
                    <ArrowDownwardIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>

                <Typography
                  sx={{ width: 22, color: "#9ca3af", fontWeight: 700, fontSize: "0.85rem", flexShrink: 0 }}
                >
                  {index + 1}
                </Typography>

                <Avatar
                  src={member.photoUrl || undefined}
                  alt={member.name}
                  variant="rounded"
                  sx={{ width: 52, height: 64, borderRadius: 1.5, bgcolor: "#E6F7F6", color: BRAND.primary, flexShrink: 0 }}
                >
                  {member.name?.[0]}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                    <Typography sx={{ fontWeight: 700, color: "#111" }}>
                      {member.name}
                    </Typography>
                    {index === 0 && member.published ? (
                      <Box
                        component="span"
                        sx={{
                          px: 0.9,
                          py: 0.1,
                          borderRadius: 999,
                          fontSize: "0.68rem",
                          fontWeight: 800,
                          letterSpacing: "0.04em",
                          textTransform: "uppercase",
                          bgcolor: "#E6F7F6",
                          color: BRAND.primary,
                        }}
                      >
                        Featured
                      </Box>
                    ) : null}
                  </Box>
                  <Typography
                    sx={{
                      color: "#6b7280",
                      fontSize: "0.85rem",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {member.role}
                  </Typography>
                </Box>

                <Tooltip title={member.published ? "Shown on About page" : "Hidden"}>
                  <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                    <Typography
                      sx={{
                        display: { xs: "none", sm: "block" },
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        color: member.published ? "#047857" : "#9ca3af",
                      }}
                    >
                      {member.published ? "Visible" : "Hidden"}
                    </Typography>
                    <Switch
                      size="small"
                      checked={Boolean(member.published)}
                      onChange={() => toggleVisible(member)}
                      inputProps={{ "aria-label": "Show on About page" }}
                    />
                  </Box>
                </Tooltip>

                <Stack direction="row" spacing={0.5} sx={{ flexShrink: 0 }}>
                  <Tooltip title="Edit">
                    <IconButton
                      component={Link}
                      href={`/admin/team/${member.id}/edit`}
                      aria-label="Edit"
                      size="small"
                      sx={iconBtnSx}
                    >
                      <EditOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      aria-label="Delete"
                      size="small"
                      onClick={() => setPendingDelete(member)}
                      sx={{
                        ...iconBtnSx,
                        borderColor: "#fecaca",
                        color: "#dc2626",
                        "&:hover": { bgcolor: "#fef2f2" },
                      }}
                    >
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Box>
            ))}
          </Box>
        )}
      </Paper>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this team member?"
        description={
          pendingDelete
            ? `“${pendingDelete.name}” will be removed from the About page. To keep them for later, hide them instead.`
            : ""
        }
        loading={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </Box>
  );
}
