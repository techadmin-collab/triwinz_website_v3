"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  IconButton,
  Paper,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RefreshIcon from "@mui/icons-material/Refresh";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { toast } from "react-hot-toast";
import AdminPageHeader from "../../components/AdminPageHeader";
import ListPagination from "../../components/ListPagination";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import { BRAND, brandButtonSx } from "../../../../lib/brand";

const SOURCE_LABELS = {
  "job-application": "Job application form",
  "training-application": "Training application form",
  contact: "Contact form",
};

const FIELD_LABELS = {
  at: "When",
  message: "Details",
  applicantName: "Name",
  applicantEmail: "Email",
  company: "Company",
  jobTitle: "Job",
  fileName: "File",
  fileSize: "File size (bytes)",
  score: "Captcha score",
  googleErrorCodes: "Google error codes",
  page: "Page",
  browser: "Browser",
};

function formatWhen(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function timeAgo(value) {
  const ms = Date.now() - new Date(value).getTime();
  if (!Number.isFinite(ms)) return "";
  const min = Math.round(ms / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min} min ago`;
  const h = Math.round(min / 60);
  if (h < 24) return `${h} h ago`;
  const days = Math.round(h / 24);
  return `${days} day${days === 1 ? "" : "s"} ago`;
}

function SeverityChip({ severity }) {
  const isError = severity === "error";
  return (
    <Chip
      size="small"
      label={isError ? "Needs action" : "Warning"}
      sx={{
        height: 22,
        fontSize: "0.7rem",
        fontWeight: 700,
        bgcolor: isError ? "#fde8e8" : "#fff4e0",
        color: isError ? "#b42318" : "#9a5b00",
      }}
    />
  );
}

function IssueCard({ issue, onToggleResolved, onDelete, busy }) {
  const [open, setOpen] = useState(false);
  const recent = issue.recent || [];

  return (
    <Paper
      variant="outlined"
      sx={{
        p: { xs: 1.5, sm: 2 },
        borderRadius: 2,
        borderLeft: `4px solid ${issue.resolved ? "#9ca3af" : issue.severity === "error" ? "#d92d20" : "#f59e0b"}`,
        minWidth: 0,
      }}
    >
      <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start", minWidth: 0 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75, alignItems: "center", mb: 0.5 }}>
            {!issue.resolved ? <SeverityChip severity={issue.severity} /> : null}
            <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, color: BRAND.primary }}>
              {SOURCE_LABELS[issue.source] || issue.source}
            </Typography>
            <Typography sx={{ fontSize: "0.75rem", color: "#6b7280" }}>
              · {issue.count} time{issue.count === 1 ? "" : "s"} · last {timeAgo(issue.lastSeenAt)}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "0.9rem", fontWeight: 600, color: "#111827", lineHeight: 1.4 }}>
            {issue.title}
          </Typography>
          {issue.message ? (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: "0.78rem",
                color: "#4b5563",
                fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                wordBreak: "break-word",
              }}
            >
              {issue.message}
            </Typography>
          ) : null}
          <Typography sx={{ mt: 0.5, fontSize: "0.72rem", color: "#9ca3af" }}>
            First seen {formatWhen(issue.firstSeenAt)}
            {issue.resolved && issue.resolvedAt
              ? ` · Resolved ${formatWhen(issue.resolvedAt)}${issue.resolvedBy ? ` by ${issue.resolvedBy}` : ""}`
              : ""}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
          <Tooltip title={issue.resolved ? "Reopen" : "Mark resolved"}>
            <span>
              <IconButton
                size="small"
                disabled={busy}
                onClick={() => onToggleResolved(issue)}
                sx={{ color: issue.resolved ? "#6b7280" : BRAND.accentDark }}
              >
                {issue.resolved ? <ReplayIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Delete">
            <span>
              <IconButton size="small" disabled={busy} onClick={() => onDelete(issue)} sx={{ color: "#9ca3af" }}>
                <DeleteOutlineIcon fontSize="small" />
              </IconButton>
            </span>
          </Tooltip>
        </Box>
      </Box>

      {recent.length ? (
        <>
          <Button
            size="small"
            onClick={() => setOpen((v) => !v)}
            endIcon={
              <ExpandMoreIcon
                sx={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}
              />
            }
            sx={{ mt: 0.75, px: 0.5, textTransform: "none", fontSize: "0.78rem", fontWeight: 600, color: BRAND.primary }}
          >
            {open ? "Hide" : "Show"} recent occurrences ({recent.length})
          </Button>
          <Collapse in={open} unmountOnExit>
            <Box sx={{ mt: 1, display: "grid", gap: 1 }}>
              {recent.map((occ, idx) => (
                <Box
                  key={`${occ.at}-${idx}`}
                  sx={{ bgcolor: "#f8fafb", border: "1px solid #eef2f3", borderRadius: 1.5, p: 1.25, minWidth: 0 }}
                >
                  {Object.entries(occ).map(([k, v]) => (
                    <Box key={k} sx={{ display: "flex", gap: 1, fontSize: "0.75rem", minWidth: 0 }}>
                      <Box component="span" sx={{ color: "#6b7280", minWidth: 110, flexShrink: 0 }}>
                        {FIELD_LABELS[k] || k}
                      </Box>
                      <Box component="span" sx={{ color: "#111827", wordBreak: "break-word", minWidth: 0 }}>
                        {k === "at" ? formatWhen(v) : String(v)}
                      </Box>
                    </Box>
                  ))}
                </Box>
              ))}
            </Box>
          </Collapse>
        </>
      ) : null}
    </Paper>
  );
}

export default function SystemIssuesPage() {
  const [tab, setTab] = useState("open");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [data, setData] = useState({ items: [], total: 0, counts: { open: 0, openErrors: 0, resolved: 0 } });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [resolvingAll, setResolvingAll] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const res = await fetch(`/api/admin/system-issues?status=${tab}&page=${page}&pageSize=${pageSize}`, {
        cache: "no-store",
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Failed to load system issues");
      setData(json);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  }, [tab, page, pageSize]);

  useEffect(() => {
    load();
  }, [load]);

  function notifyShell() {
    window.dispatchEvent(new Event("system-issues-changed"));
  }

  async function toggleResolved(issue) {
    setBusyId(issue.id);
    try {
      const res = await fetch(`/api/admin/system-issues/${issue.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ resolved: !issue.resolved }),
      });
      if (!res.ok) throw new Error();
      toast.success(issue.resolved ? "Issue reopened" : "Marked as resolved");
      notifyShell();
      await load();
    } catch {
      toast.error("Could not update the issue");
    } finally {
      setBusyId(null);
    }
  }

  async function confirmDelete() {
    if (!toDelete) return;
    setBusyId(toDelete.id);
    try {
      const res = await fetch(`/api/admin/system-issues/${toDelete.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Issue deleted");
      setToDelete(null);
      notifyShell();
      if (data.items.length === 1 && page > 1) setPage(page - 1);
      else await load();
    } catch {
      toast.error("Could not delete the issue");
    } finally {
      setBusyId(null);
    }
  }

  async function resolveAll() {
    setResolvingAll(true);
    try {
      const res = await fetch("/api/admin/system-issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "resolve_all" }),
      });
      if (!res.ok) throw new Error();
      toast.success("All open issues marked as resolved");
      notifyShell();
      setPage(1);
      await load();
    } catch {
      toast.error("Could not resolve the issues");
    } finally {
      setResolvingAll(false);
    }
  }

  const { counts } = data;

  return (
    <Box sx={{ minWidth: 0 }}>
      <AdminPageHeader
        title="System issues"
        description="Problems visitors ran into on the website forms. Errors also email the team (at most once an hour each)."
        action={
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              onClick={load}
              startIcon={<RefreshIcon />}
              sx={{ textTransform: "none", fontWeight: 600, color: BRAND.primary }}
            >
              Refresh
            </Button>
            {tab === "open" && counts.open > 0 ? (
              <Button
                variant="contained"
                disableElevation
                startIcon={<DoneAllIcon />}
                disabled={resolvingAll}
                onClick={resolveAll}
                sx={{ ...brandButtonSx, fontWeight: 700 }}
              >
                Resolve all
              </Button>
            ) : null}
          </Box>
        }
      />

      <Paper variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
        <Tabs
          value={tab}
          onChange={(_, v) => {
            setTab(v);
            setPage(1);
          }}
          sx={{
            px: 1,
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: "0.88rem", minHeight: 46 },
            "& .Mui-selected": { color: `${BRAND.primary} !important` },
            "& .MuiTabs-indicator": { bgcolor: BRAND.primary },
          }}
        >
          <Tab value="open" label={`Open (${counts.open})`} />
          <Tab value="resolved" label={`Resolved (${counts.resolved})`} />
        </Tabs>
      </Paper>

      {loadError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {loadError}
        </Alert>
      ) : null}

      {loading ? (
        <Box sx={{ py: 6, display: "grid", placeItems: "center" }}>
          <CircularProgress size={28} sx={{ color: BRAND.primary }} />
        </Box>
      ) : !loadError && data.items.length === 0 ? (
        <Paper variant="outlined" sx={{ borderRadius: 2, p: 4, textAlign: "center" }}>
          <CheckCircleOutlineIcon sx={{ fontSize: 40, color: BRAND.accentDark }} />
          <Typography sx={{ mt: 1, fontWeight: 700 }}>
            {tab === "open" ? "No open issues" : "Nothing resolved yet"}
          </Typography>
          <Typography sx={{ mt: 0.5, fontSize: "0.85rem", color: "#6b7280" }}>
            {tab === "open"
              ? "The forms are working. New problems will show up here automatically."
              : "Issues you mark as resolved are kept here. They reopen by themselves if the problem comes back."}
          </Typography>
        </Paper>
      ) : (
        <Box sx={{ display: "grid", gap: 1.25 }}>
          {data.items.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              busy={busyId === issue.id}
              onToggleResolved={toggleResolved}
              onDelete={setToDelete}
            />
          ))}
        </Box>
      )}

      <Box sx={{ mt: 2 }}>
        <ListPagination
          count={data.total}
          page={page}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </Box>

      <ConfirmDeleteDialog
        open={Boolean(toDelete)}
        title="Delete this issue?"
        description="It will be removed from the list. If the problem happens again, it will be recorded as a new issue."
        loading={Boolean(toDelete) && busyId === toDelete?.id}
        onClose={() => setToDelete(null)}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
