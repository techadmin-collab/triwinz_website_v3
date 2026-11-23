"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import { toast } from "react-hot-toast";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import ApplicationEditDialog from "../../components/ApplicationEditDialog";
import ResumePreviewDialog from "../../components/ResumePreviewDialog";
import RoundDialog from "../../components/interviews/RoundDialog";
import AdminPageHeader from "../../components/AdminPageHeader";
import { BRAND } from "../../../../lib/brand";
import { needsReason } from "../../../../lib/applicationStatus";
import { truncateText } from "../../../../lib/resumeFile";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const TABLE_SX = {
  minWidth: 960,
  "& .MuiTableCell-root": {
    fontSize: "0.8125rem",
    color: "#374151",
    py: 1.25,
  },
  "& .MuiTableCell-head": {
    fontSize: "0.75rem",
    fontWeight: 700,
    color: "#4b5563",
  },
};

const dataTextSx = {
  fontSize: "inherit",
  lineHeight: 1.45,
  fontWeight: 600,
  color: "#374151",
};

const APPLICATION_STATUSES = [
  { value: "new", label: "New" },
  { value: "reviewed", label: "Reviewed" },
  { value: "next_step", label: "Next step" },
  { value: "shortlisted", label: "Shortlisted" },
  { value: "on_hold", label: "On hold" },
  { value: "marked_for_rejection", label: "Marked for rejection" },
  { value: "rejected", label: "Rejected" },
  { value: "selected", label: "Selected" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "name_asc", label: "Name A–Z" },
  { value: "name_desc", label: "Name Z–A" },
  { value: "job_asc", label: "Job A–Z" },
  { value: "job_desc", label: "Job Z–A" },
  { value: "status_asc", label: "Status A–Z" },
  { value: "status_desc", label: "Status Z–A" },
];

// Tabs: the statuses, plus "In interview" (shortlisted with an interview level) and "All"
const TAB_ORDER = [
  "new",
  "interviewing",
  "shortlisted",
  "on_hold",
  "reviewed",
  "next_step",
  "marked_for_rejection",
  "rejected",
  "selected",
  "",
];
const STATUS_TABS = TAB_ORDER.map((value) =>
  value === "interviewing"
    ? { value, label: "In interview" }
    : value === ""
      ? { value, label: "All" }
      : APPLICATION_STATUSES.find((item) => item.value === value),
);

// Status tab from the URL: opens on "New" by default; ?status=all shows every status
function tabFromParam(value) {
  if (value === "all") return "";
  return STATUS_TABS.some((item) => item.value && item.value === value) ? value : "new";
}

function StatusReason({ row }) {
  if (!needsReason(row.status) || !row.statusReason) return null;
  const by = row.statusReasonBy ? ` (${row.statusReasonBy})` : "";
  return (
    <Tooltip title={`${row.statusReason}${by}`}>
      <Typography
        sx={{
          mt: 0.25,
          fontSize: "0.72rem",
          color: "#6b7280",
          maxWidth: 200,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {row.statusReason}
      </Typography>
    </Tooltip>
  );
}

function normalizeStatus(status) {
  if (status === "archived") return "rejected";
  return APPLICATION_STATUSES.some((item) => item.value === status)
    ? status
    : "new";
}

function getStatusLabel(status) {
  const normalized = normalizeStatus(status);
  return (
    APPLICATION_STATUSES.find((item) => item.value === normalized)?.label ||
    normalized
  );
}

export default function AdminApplicationsPage() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status") || "";
  const initialJobSlug = searchParams.get("jobSlug") || "";

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [coverLetterView, setCoverLetterView] = useState(null);
  const [resumeView, setResumeView] = useState(null);
  const [applicationEdit, setApplicationEdit] = useState(null);
  const [editReferralValue, setEditReferralValue] = useState("");
  const [editStatusValue, setEditStatusValue] = useState("new");
  const [savingApplication, setSavingApplication] = useState(false);
  const [editReasonValue, setEditReasonValue] = useState("");
  const [canReject, setCanReject] = useState(false); // admins only
  const [exporting, setExporting] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newCount, setNewCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [scheduleFor, setScheduleFor] = useState(null); // application to schedule Level 1 for
  const [interviewers, setInterviewers] = useState(null); // loaded the first time it's needed
  const [openingSchedule, setOpeningSchedule] = useState(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [jobOptions, setJobOptions] = useState([]);
  const [referralSourceOptions, setReferralSourceOptions] = useState([]);
  const [statusFilter, setStatusFilter] = useState(
    tabFromParam(initialStatus),
  );
  const [jobFilter, setJobFilter] = useState(initialJobSlug);
  const [referralSourceFilter, setReferralSourceFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [debouncedNameSearch, setDebouncedNameSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedNameSearch(nameSearch.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [nameSearch]);

  useEffect(() => {
    const nextStatus = searchParams.get("status") || "";
    const nextJobSlug = searchParams.get("jobSlug") || "";
    setStatusFilter(tabFromParam(nextStatus));
    setJobFilter(nextJobSlug);
    setPage(1);
  }, [searchParams]);

  // the status tabs are not counted as a filter
  const hasActiveFilters = Boolean(
    jobFilter ||
      referralSourceFilter ||
      debouncedNameSearch ||
      dateFrom ||
      dateTo,
  );

  const load = useCallback(async (pageToLoad = page, size = pageSize) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: String(pageToLoad),
      pageSize: String(size),
    });
    if (statusFilter) params.set("status", statusFilter);
    if (jobFilter) params.set("jobSlug", jobFilter);
    if (referralSourceFilter) {
      params.set("referralSource", referralSourceFilter);
    }
    if (debouncedNameSearch) params.set("name", debouncedNameSearch);
    if (sortBy) params.set("sort", sortBy);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);

    const res = await fetch(`/api/admin/applications?${params.toString()}`);
    if (!res.ok) {
      toast.error("Failed to load applications");
      setLoading(false);
      return;
    }
    const data = await res.json();
    setRows(data.items || []);
    setCanReject(Boolean(data.canReject));
    setTotal(data.total || 0);
    setTotalPages(data.totalPages || 1);
    setNewCount(data.newCount || 0);
    setStatusCounts(data.statusCounts || {});
    setFrom(data.from || 0);
    setTo(data.to || 0);
    setJobOptions(data.jobOptions || []);
    setReferralSourceOptions(data.referralSourceOptions || []);
    setPage(data.page || pageToLoad);
    setPageSize(data.pageSize || size);
    if (data.sort) setSortBy(data.sort);
    setLoading(false);
  }, [
    page,
    pageSize,
    statusFilter,
    jobFilter,
    referralSourceFilter,
    debouncedNameSearch,
    sortBy,
    dateFrom,
    dateTo,
  ]);

  useEffect(() => {
    load(page, pageSize);
  }, [page, pageSize, load]);

  function handlePageSizeChange(nextSize) {
    setPageSize(nextSize);
    setPage(1);
  }

  function handleFilterChange(setter, value) {
    setter(value);
    setPage(1);
  }

  function clearFilters() {
    setJobFilter("");
    setReferralSourceFilter("");
    setNameSearch("");
    setDebouncedNameSearch("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
  }

  const filterFieldSx = {
    minWidth: { xs: "100%", sm: 160 },
    bgcolor: "#fff",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#e5e7eb",
    },
  };

  // staff can't choose "Rejected" (only admins can reject)
  function statusOptionsFor(current) {
    if (canReject) return APPLICATION_STATUSES;
    return APPLICATION_STATUSES.flatMap((option) =>
      option.value !== "rejected"
        ? [option]
        : current === "rejected"
          ? [{ ...option, disabled: true }]
          : [],
    );
  }

  function openApplicationEdit(row) {
    setApplicationEdit({
      id: row.id,
      fullName: row.fullName,
      jobTitle: row.jobTitle,
      referralSource: row.referralSource || "",
      status: normalizeStatus(row.status),
      statusReason: row.statusReason || "",
    });
    setEditReferralValue(row.referralSource || "");
    setEditReasonValue(needsReason(row.status) ? row.statusReason || "" : "");
    setEditStatusValue(normalizeStatus(row.status));
  }

  async function saveApplicationEdit() {
    if (!applicationEdit) return;

    const nextReferral = String(editReferralValue || "").trim();
    const prevReferral = String(applicationEdit.referralSource || "").trim();
    const nextStatus = editStatusValue;
    const prevStatus = applicationEdit.status;
    const payload = {};

    if (nextReferral !== prevReferral) {
      payload.referralSource = nextReferral;
    }
    if (nextStatus !== prevStatus) {
      payload.status = nextStatus;
    }
    const reason = editReasonValue.trim();
    const reasonChanged = reason !== (applicationEdit.statusReason || "").trim();
    if (needsReason(nextStatus) && (nextStatus !== prevStatus || reasonChanged)) {
      if (!reason) {
        toast.error(
          nextStatus === "next_step"
            ? "Please write the next step for HR"
            : `Please give a reason for “${getStatusLabel(nextStatus)}”`,
        );
        return;
      }
      payload.statusReason = reason;
    }

    if (Object.keys(payload).length === 0) {
      setApplicationEdit(null);
      return;
    }

    setSavingApplication(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationEdit.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        toast.error(body.error || "Failed to update application", {
          duration: body.code ? 9000 : 4000,
        });
        return;
      }
      toast.success("Application updated");
      setApplicationEdit(null);
      await load(page, pageSize);
    } finally {
      setSavingApplication(false);
    }
  }

  async function saveResumeStatus(nextStatus, reason) {
    if (!resumeView?.id) return;
    const res = await fetch(`/api/admin/applications/${resumeView.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        needsReason(nextStatus) ? { status: nextStatus, statusReason: reason } : { status: nextStatus },
      ),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      toast.error(body.error || "Failed to update status", {
        duration: body.code ? 9000 : 4000,
      });
      throw new Error("Failed to update status");
    }
    toast.success(
      nextStatus === "rejected"
        ? "Status updated. Rejection email sent."
        : "Status updated",
    );
    await load(page, pageSize);
  }

  async function openSchedule(row) {
    if (interviewers) {
      setScheduleFor(row);
      return;
    }
    setOpeningSchedule(row.id);
    try {
      const res = await fetch("/api/admin/interviewers");
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        toast.error(
          body?.error ||
            (res.status === 403
              ? "You don't have access to Interviews, so you can't schedule interviews."
              : "Could not load the interview panel"),
          { duration: 7000 },
        );
        return;
      }
      setInterviewers(Array.isArray(body) ? body : []);
      setScheduleFor(row);
    } finally {
      setOpeningSchedule(null);
    }
  }

  // e.g. "Interview emails sent to the candidate and 2 panel members" / what didn't go out
  function showEmailSummary(emails) {
    if (!emails || emails.skipped) return;
    const panel = emails.panel || [];
    const sentPanel = panel.filter((p) => p.status === "sent").length;
    const parts = [];
    if (emails.candidate === "sent") parts.push("the candidate");
    if (sentPanel) parts.push(`${sentPanel} panel member${sentPanel === 1 ? "" : "s"}`);
    if (parts.length) toast.success(`Interview emails sent to ${parts.join(" and ")}`);
    const problems = [];
    if (emails.candidate === "failed") problems.push("the candidate (sending failed)");
    if (emails.candidate === "no_email") problems.push("the candidate (no email address)");
    panel.filter((p) => p.status === "failed").forEach((p) => problems.push(`${p.name} (sending failed)`));
    panel.filter((p) => p.status === "no_email").forEach((p) => problems.push(`${p.name} (no email address)`));
    if (problems.length) toast.error(`Not emailed: ${problems.join(", ")}`, { duration: 9000 });
  }

  async function submitSchedule(payload) {
    if (!scheduleFor) return false;
    const res = await fetch(`/api/admin/interviews/${scheduleFor.id}/rounds`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      toast.error(body.error || "Could not schedule the interview");
      return false;
    }
    toast.success(`Level 1 scheduled for ${scheduleFor.fullName}`);
    showEmailSummary(body.emails);
    await load(page, pageSize);
    return true;
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/applications/${pendingDelete.id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error || "Delete failed");
        return;
      }
      toast.success("Application deleted");
      setPendingDelete(null);
      await load(page, pageSize);
    } finally {
      setDeleting(false);
    }
  }

  function buildFilterParams() {
    const params = new URLSearchParams();
    if (statusFilter) params.set("status", statusFilter);
    if (jobFilter) params.set("jobSlug", jobFilter);
    if (referralSourceFilter) {
      params.set("referralSource", referralSourceFilter);
    }
    if (debouncedNameSearch) params.set("name", debouncedNameSearch);
    if (sortBy) params.set("sort", sortBy);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    return params;
  }

  async function downloadCsv() {
    setExporting(true);
    try {
      const params = buildFilterParams();
      const res = await fetch(
        `/api/admin/applications/export?${params.toString()}`,
      );
      if (!res.ok) {
        toast.error("Failed to download CSV");
        return;
      }

      const blob = await res.blob();
      const disposition = res.headers.get("Content-Disposition") || "";
      const match = disposition.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] || `applications-${Date.now()}.csv`;

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Failed to download CSV");
    } finally {
      setExporting(false);
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Applications"
        description="Review candidates who applied through the careers pages."
        action={
          <Stack direction="row" spacing={1.25} alignItems="center">
            <Chip
              label={`${total} total${newCount ? ` · ${newCount} new` : ""}`}
              sx={{ fontWeight: 700, bgcolor: "#f3f4f6" }}
            />
            <Button
              onClick={downloadCsv}
              disabled={exporting || loading || total === 0}
              startIcon={
                exporting ? (
                  <CircularProgress size={16} sx={{ color: "inherit" }} />
                ) : (
                  <FileDownloadOutlinedIcon />
                )
              }
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: "#fff",
                px: 2,
                backgroundImage: BRAND.gradient,
                boxShadow: "none",
                "&:hover": { boxShadow: "none", opacity: 0.95 },
                "&.Mui-disabled": {
                  color: "#fff",
                  opacity: 0.65,
                },
              }}
            >
              {exporting ? "Downloading..." : "Download CSV"}
            </Button>
          </Stack>
        }
      />

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          border: "1px solid #e8eaed",
          bgcolor: "#fff",
          mb: 2,
        }}
      >
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.5}
          alignItems={{ xs: "stretch", lg: "flex-end" }}
          sx={{
            p: 2,
            borderBottom: "1px solid #e8eaed",
            bgcolor: "#fafafa",
          }}
        >
          <Box sx={{ flex: 1.2 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6b7280",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Search
            </Typography>
            <TextField
              size="small"
              fullWidth
              placeholder="Search by name or email"
              value={nameSearch}
              onChange={(e) => setNameSearch(e.target.value)}
              sx={filterFieldSx}
            />
          </Box>

          <Box sx={{ flex: 1.4 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6b7280",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Job
            </Typography>
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={jobFilter}
              onChange={(e) => handleFilterChange(setJobFilter, e.target.value)}
              sx={filterFieldSx}
            >
              <MenuItem value="">All jobs</MenuItem>
              {jobOptions.map((job) => (
                <MenuItem key={job.jobSlug} value={job.jobSlug}>
                  {job.jobTitle}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ flex: 1.2 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6b7280",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Referral source
            </Typography>
            <Select
              size="small"
              fullWidth
              displayEmpty
              value={referralSourceFilter}
              onChange={(e) =>
                handleFilterChange(setReferralSourceFilter, e.target.value)
              }
              sx={filterFieldSx}
            >
              <MenuItem value="">All sources</MenuItem>
              <MenuItem value="__none__">Not specified</MenuItem>
              {referralSourceOptions.map((source) => (
                <MenuItem key={source} value={source}>
                  {source}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6b7280",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              From date
            </Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              value={dateFrom}
              onChange={(e) => handleFilterChange(setDateFrom, e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={filterFieldSx}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6b7280",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              To date
            </Typography>
            <TextField
              type="date"
              size="small"
              fullWidth
              value={dateTo}
              onChange={(e) => handleFilterChange(setDateTo, e.target.value)}
              InputLabelProps={{ shrink: true }}
              sx={filterFieldSx}
            />
          </Box>

          <Box sx={{ flex: 1.2 }}>
            <Typography
              sx={{
                fontSize: "0.75rem",
                fontWeight: 700,
                color: "#6b7280",
                mb: 0.75,
                textTransform: "uppercase",
                letterSpacing: "0.04em",
              }}
            >
              Order by
            </Typography>
            <Select
              size="small"
              fullWidth
              value={sortBy}
              onChange={(e) => handleFilterChange(setSortBy, e.target.value)}
              sx={filterFieldSx}
            >
              {SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {hasActiveFilters ? (
            <Button
              onClick={clearFilters}
              sx={{
                textTransform: "none",
                fontWeight: 700,
                color: "#111",
                border: "1px solid #e5e7eb",
                bgcolor: "#fff",
                px: 2,
                py: 1,
                alignSelf: { xs: "stretch", lg: "flex-end" },
              }}
            >
              Clear filters
            </Button>
          ) : null}
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          border: "1px solid #e8eaed",
          bgcolor: "#fff",
        }}
      >
        <Tabs
          value={statusFilter}
          onChange={(_, value) => handleFilterChange(setStatusFilter, value)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          aria-label="Application status"
          sx={{
            px: 1,
            minHeight: 48,
            borderBottom: "1px solid #e8eaed",
            "& .MuiTabs-indicator": { bgcolor: BRAND.primary, height: 3, borderRadius: "3px 3px 0 0" },
            "& .MuiTab-root": {
              minHeight: 48,
              px: 1.75,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.85rem",
              color: "#6b7280",
            },
            "& .MuiTab-root.Mui-selected": { color: BRAND.primary },
          }}
        >
          {STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.value || "all"] || 0;
            const selected = statusFilter === tab.value;
            return (
              <Tab
                key={tab.value || "all"}
                value={tab.value}
                label={
                  <Box component="span" sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
                    {tab.label}
                    <Box
                      component="span"
                      sx={{
                        minWidth: 22,
                        px: 0.75,
                        py: 0.1,
                        borderRadius: 10,
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        lineHeight: 1.6,
                        textAlign: "center",
                        bgcolor: selected ? BRAND.primary : "#f3f4f6",
                        color: selected ? "#fff" : "#4b5563",
                      }}
                    >
                      {count}
                    </Box>
                  </Box>
                }
              />
            );
          })}
        </Tabs>
        {loading ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <CircularProgress size={28} sx={{ color: BRAND.primary }} />
          </Box>
        ) : rows.length === 0 ? (
          <Box sx={{ p: 8, textAlign: "center" }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                bgcolor: "#f3f4f6",
                display: "grid",
                placeItems: "center",
                mx: "auto",
                mb: 2,
                color: "#9ca3af",
              }}
            >
              <InboxOutlinedIcon />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}>
              No applications yet
            </Typography>
            <Typography color="text.secondary">
              {hasActiveFilters
                ? "No applications match your filters."
                : statusFilter
                  ? statusFilter === "interviewing"
                    ? "No candidates are in the interview process right now."
                    : `No ${getStatusLabel(statusFilter).toLowerCase()} applications.`
                : "New submissions from careers will appear here."}
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ overflow: "auto" }}>
              <Table sx={TABLE_SX}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafafa" }}>
                    {[
                      "#",
                      "Candidate",
                      "Job",
                      "Contact",
                      "Referral source",
                      "Available",
                      "Resume",
                      "Applied",
                      "Status",
                      "Actions",
                    ].map((label) => (
                      <TableCell
                        key={label}
                        align={label === "Actions" ? "right" : "left"}
                      >
                        {label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="inherit" sx={dataTextSx}>
                          {from + index}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="inherit" sx={dataTextSx}>
                          {row.fullName}
                        </Typography>
                        {row.coverLetter ? (
                          <Typography
                            component="button"
                            type="button"
                            variant="inherit"
                            onClick={() =>
                              setCoverLetterView({
                                name: row.fullName,
                                jobTitle: row.jobTitle,
                                coverLetter: row.coverLetter,
                              })
                            }
                            sx={{
                              ...dataTextSx,
                              mt: 0.5,
                              maxWidth: 220,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textAlign: "left",
                              cursor: "pointer",
                              border: 0,
                              p: 0,
                              bgcolor: "transparent",
                              color: "#6b7280",
                              "&:hover": {
                                color: "#111",
                                textDecoration: "underline",
                              },
                            }}
                          >
                            {row.coverLetter}
                          </Typography>
                        ) : null}
                      </TableCell>
                      <TableCell>
                        <Typography variant="inherit" sx={dataTextSx}>
                          {row.jobTitle}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <MuiLink
                          href={`mailto:${row.email}`}
                          underline="hover"
                          sx={dataTextSx}
                        >
                          {row.email}
                        </MuiLink>
                        <Typography
                          variant="inherit"
                          sx={{ ...dataTextSx, color: "#6b7280" }}
                        >
                          {row.phone}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          variant="inherit"
                          title={row.referralSource || undefined}
                          sx={dataTextSx}
                        >
                          {truncateText(row.referralSource)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="inherit" sx={dataTextSx}>
                          {row.availableToJoinAndRelocate === true
                            ? "Yes"
                            : row.availableToJoinAndRelocate === false
                              ? "No"
                              : "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={row.resumeFileName || "View resume"}
                        >
                          <IconButton
                            aria-label="View resume"
                            size="small"
                            onClick={() =>
                              setResumeView({
                                id: row.id,
                                status: normalizeStatus(row.status),
                                statusReason: row.statusReason || "",
                                url: row.resumeUrl,
                                fileName: row.resumeFileName,
                                fullName: row.fullName,
                                jobTitle: row.jobTitle,
                              })
                            }
                            sx={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 1.5,
                              color: "#111",
                              "&:hover": { bgcolor: "#f9fafb" },
                            }}
                          >
                            <DescriptionOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Typography variant="inherit" sx={dataTextSx}>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </Typography>
                        <Typography
                          variant="inherit"
                          sx={{ ...dataTextSx, color: "#6b7280" }}
                        >
                          {new Date(row.createdAt).toLocaleTimeString()}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="inherit" sx={dataTextSx}>
                          {row.inInterview ? "In interview" : getStatusLabel(row.status)}
                        </Typography>
                        <StatusReason row={row} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.75}
                          justifyContent="flex-end"
                          alignItems="center"
                        >
                          {row.status === "shortlisted" && !row.inInterview ? (
                            <Button
                              size="small"
                              onClick={() => openSchedule(row)}
                              disabled={openingSchedule === row.id}
                              startIcon={
                                openingSchedule === row.id ? (
                                  <CircularProgress size={14} sx={{ color: "inherit" }} />
                                ) : (
                                  <EventAvailableOutlinedIcon fontSize="small" />
                                )
                              }
                              sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                whiteSpace: "nowrap",
                                color: "#fff",
                                px: 1.5,
                                backgroundImage: BRAND.gradient,
                                "&:hover": { opacity: 0.92 },
                                "&.Mui-disabled": { color: "#fff", opacity: 0.7 },
                              }}
                            >
                              Schedule interview
                            </Button>
                          ) : null}
                          <Tooltip title="Edit application">
                            <IconButton
                              aria-label="Edit application"
                              size="small"
                              onClick={() => openApplicationEdit(row)}
                              sx={{
                                border: "1px solid rgba(29, 87, 88, 0.2)",
                                borderRadius: 1.5,
                                color: BRAND.primary,
                                "&:hover": { bgcolor: "#E6F7F6" },
                              }}
                            >
                              <EditOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              aria-label="Delete"
                              size="small"
                              onClick={() => setPendingDelete(row)}
                              sx={{
                                border: "1px solid #fecaca",
                                borderRadius: 1.5,
                                color: "#dc2626",
                                "&:hover": { bgcolor: "#fef2f2" },
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
              alignItems="center"
              justifyContent="space-between"
              sx={{
                px: 2.5,
                py: 1.75,
                borderTop: "1px solid #e8eaed",
                bgcolor: "#fafafa",
              }}
            >
              <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
                <Typography sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  Showing {from}–{to} of {total}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
                    Rows per page
                  </Typography>
                  <Select
                    size="small"
                    value={pageSize}
                    onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                    disabled={loading}
                    sx={{
                      minWidth: 72,
                      bgcolor: "#fff",
                      fontSize: "0.875rem",
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#e5e7eb",
                      },
                    }}
                  >
                    {PAGE_SIZE_OPTIONS.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                </Stack>
              </Stack>

              <Stack direction="row" spacing={1} alignItems="center">
                <Button
                  size="small"
                  startIcon={<ChevronLeftIcon />}
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#111",
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fff",
                  }}
                >
                  Previous
                </Button>
                <Typography sx={{ fontWeight: 700, fontSize: "0.875rem", px: 1 }}>
                  Page {page} / {totalPages}
                </Typography>
                <Button
                  size="small"
                  endIcon={<ChevronRightIcon />}
                  disabled={page >= totalPages || loading}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  sx={{
                    textTransform: "none",
                    fontWeight: 700,
                    color: "#111",
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fff",
                  }}
                >
                  Next
                </Button>
              </Stack>
            </Stack>
          </>
        )}
      </Paper>

      <Dialog
        open={Boolean(coverLetterView)}
        onClose={() => setCoverLetterView(null)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          Cover letter
          {coverLetterView ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.5, fontWeight: 500 }}
            >
              {coverLetterView.name}
              {coverLetterView.jobTitle
                ? ` · ${coverLetterView.jobTitle}`
                : ""}
            </Typography>
          ) : null}
        </DialogTitle>
        <DialogContent>
          <Typography
            sx={{
              whiteSpace: "pre-wrap",
              color: "#374151",
              lineHeight: 1.7,
            }}
          >
            {coverLetterView?.coverLetter}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button
            onClick={() => setCoverLetterView(null)}
            sx={{ textTransform: "none", fontWeight: 700 }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <ApplicationEditDialog
        open={Boolean(applicationEdit)}
        application={applicationEdit}
        referralSource={editReferralValue}
        status={editStatusValue}
        statusOptions={statusOptionsFor(applicationEdit?.status)}
        reason={editReasonValue}
        onReasonChange={setEditReasonValue}
        saving={savingApplication}
        onReferralSourceChange={setEditReferralValue}
        onStatusChange={setEditStatusValue}
        onClose={() => {
          if (!savingApplication) setApplicationEdit(null);
        }}
        onSave={saveApplicationEdit}
      />

      <RoundDialog
        open={Boolean(scheduleFor)}
        level={1}
        candidateName={scheduleFor ? `${scheduleFor.fullName} · ${scheduleFor.jobTitle}` : ""}
        interviewers={interviewers || []}
        onInterviewerCreated={(created) => setInterviewers((prev) => [...(prev || []), created])}
        onClose={() => setScheduleFor(null)}
        onSubmit={submitSchedule}
      />

      <ResumePreviewDialog
        open={Boolean(resumeView)}
        resume={resumeView}
        onClose={() => setResumeView(null)}
        statusOptions={statusOptionsFor(resumeView?.status)}
        onStatusSave={saveResumeStatus}
      />

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this application?"
        description={
          pendingDelete
            ? `Application from “${pendingDelete.fullName}” for “${pendingDelete.jobTitle}” will be removed, including the resume file from Cloudinary.`
            : "This action cannot be undone."
        }
        loading={deleting}
        onClose={() => {
          if (!deleting) setPendingDelete(null);
        }}
        onConfirm={confirmDelete}
      />
    </Box>
  );
}
