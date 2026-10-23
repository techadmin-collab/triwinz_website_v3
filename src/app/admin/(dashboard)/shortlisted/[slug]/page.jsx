"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-hot-toast";
import ConfirmDeleteDialog from "../../../components/ConfirmDeleteDialog";
import ApplicationEditDialog from "../../../components/ApplicationEditDialog";
import ResumePreviewDialog from "../../../components/ResumePreviewDialog";
import AdminPageHeader from "../../../components/AdminPageHeader";
import { BRAND } from "../../../../../lib/brand";
import { truncateText } from "../../../../../lib/resumeFile";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const TABLE_SX = {
  minWidth: 860,
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
  { value: "shortlisted", label: "Shortlisted" },
  { value: "on_hold", label: "On hold" },
  { value: "rejected", label: "Rejected" },
  { value: "selected", label: "Selected" },
];

function normalizeStatus(status) {
  if (status === "reviewed") return "shortlisted";
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

export default function ShortlistedJobApplicationsPage() {
  const params = useParams();
  const jobSlug = params.slug;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [jobTitle, setJobTitle] = useState("");
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [coverLetterView, setCoverLetterView] = useState(null);
  const [resumeView, setResumeView] = useState(null);
  const [applicationEdit, setApplicationEdit] = useState(null);
  const [editReferralValue, setEditReferralValue] = useState("");
  const [editStatusValue, setEditStatusValue] = useState("shortlisted");
  const [savingApplication, setSavingApplication] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);

  const load = useCallback(
    async (pageToLoad = page, size = pageSize) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pageToLoad),
        pageSize: String(size),
        status: "shortlisted",
        jobSlug: String(jobSlug),
      });

      const res = await fetch(`/api/admin/applications?${params.toString()}`);
      if (!res.ok) {
        toast.error("Failed to load shortlisted applications");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setFrom(data.from || 0);
      setTo(data.to || 0);
      setPage(data.page || pageToLoad);
      setPageSize(data.pageSize || size);
      if (data.items?.[0]?.jobTitle) {
        setJobTitle(data.items[0].jobTitle);
      }
      setLoading(false);
    },
    [jobSlug, page, pageSize],
  );

  useEffect(() => {
    load(page, pageSize);
  }, [page, pageSize, load]);

  function handlePageSizeChange(nextSize) {
    setPageSize(nextSize);
    setPage(1);
  }

  function openApplicationEdit(row) {
    setApplicationEdit({
      id: row.id,
      fullName: row.fullName,
      jobTitle: row.jobTitle,
      referralSource: row.referralSource || "",
      status: normalizeStatus(row.status),
    });
    setEditReferralValue(row.referralSource || "");
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
        toast.error("Failed to update application");
        return;
      }
      toast.success("Application updated");
      setApplicationEdit(null);
      await load(page, pageSize);
    } finally {
      setSavingApplication(false);
    }
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

  return (
    <Box>
      <Button
        component={Link}
        href="/admin/shortlisted"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: 700,
          color: "#6b7280",
          "&:hover": { bgcolor: "#f3f4f6" },
        }}
      >
        Back to jobs
      </Button>

      <AdminPageHeader
        title={jobTitle || "Shortlisted applications"}
        description={`Review shortlisted candidates for this role.`}
        action={
          <Chip
            label={`${total} shortlisted`}
            sx={{ fontWeight: 700, bgcolor: "#f5f0ff", color: BRAND.primary }}
          />
        }
      />

      <Paper
        elevation={0}
        sx={{
          overflow: "hidden",
          borderRadius: 2,
          border: "1px solid rgba(80, 20, 210, 0.1)",
          bgcolor: "#fff",
        }}
      >
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
              No shortlisted applications
            </Typography>
            <Typography color="text.secondary">
              There are no shortlisted candidates for this job right now.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ overflow: "auto" }}>
              <Table sx={TABLE_SX}>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#fafafa" }}>
                    {[
                      "Candidate",
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
                  {rows.map((row) => (
                    <TableRow
                      key={row.id}
                      hover
                      sx={{ "&:last-child td": { borderBottom: 0 } }}
                    >
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
                          {getStatusLabel(row.status)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Stack
                          direction="row"
                          spacing={0.75}
                          justifyContent="flex-end"
                        >
                          <Tooltip title="Edit application">
                            <IconButton
                              aria-label="Edit application"
                              size="small"
                              onClick={() => openApplicationEdit(row)}
                              sx={{
                                border: "1px solid rgba(80, 20, 210, 0.2)",
                                borderRadius: 1.5,
                                color: BRAND.primary,
                                "&:hover": { bgcolor: "#f5f0ff" },
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
        statusOptions={APPLICATION_STATUSES}
        saving={savingApplication}
        onReferralSourceChange={setEditReferralValue}
        onStatusChange={setEditStatusValue}
        onClose={() => {
          if (!savingApplication) setApplicationEdit(null);
        }}
        onSave={saveApplicationEdit}
      />

      <ResumePreviewDialog
        open={Boolean(resumeView)}
        resume={resumeView}
        onClose={() => setResumeView(null)}
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
