"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  CircularProgress,
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
  TextField,
  Tooltip,
  Typography,
  Link as MuiLink,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-hot-toast";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import AdminPageHeader from "../../components/AdminPageHeader";
import ResumePreviewDialog from "../../components/ResumePreviewDialog";
import { BRAND } from "../../../../lib/brand";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "enrolled", label: "Enrolled" },
  { value: "rejected", label: "Rejected" },
];

const headCellSx = { fontWeight: 700, color: "#4b5563" };

export default function AdminTrainingPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [resume, setResume] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newCount, setNewCount] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  // Debounce search input.
  useEffect(() => {
    const t = setTimeout(() => {
      setQuery(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(
    async (pageToLoad = page, size = pageSize) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pageToLoad),
        pageSize: String(size),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (query) params.set("q", query);

      const res = await fetch(`/api/admin/training-applications?${params}`);
      if (!res.ok) {
        toast.error("Failed to load training applications");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setNewCount(data.newCount || 0);
      setFrom(data.from || 0);
      setTo(data.to || 0);
      setLoading(false);
    },
    [page, pageSize, statusFilter, query],
  );

  useEffect(() => {
    load(page, pageSize);
  }, [page, pageSize, load]);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/admin/training-applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Failed to update status");
      return;
    }
    toast.success("Status updated");
    await load(page, pageSize);
  }

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const res = await fetch(
      `/api/admin/training-applications/${pendingDelete.id}`,
      { method: "DELETE" },
    );
    setDeleting(false);
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Application deleted");
    setPendingDelete(null);
    await load(page, pageSize);
  }

  return (
    <Box>
      <AdminPageHeader
        title="Training applications"
        description={`${total} total · ${newCount} new`}
      />

      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search name, email, phone, college"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 280, bgcolor: "#fff" }}
        />
        <Select
          size="small"
          displayEmpty
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 160, bgcolor: "#fff" }}
        >
          <MenuItem value="">All statuses</MenuItem>
          {STATUS_OPTIONS.map((item) => (
            <MenuItem key={item.value} value={item.value}>
              {item.label}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Paper
        elevation={0}
        sx={{ borderRadius: 2, border: "1px solid #e8eaed", bgcolor: "#fff" }}
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
              <SchoolOutlinedIcon />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#111" }}>
              No training applications yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ minWidth: 1000 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={headCellSx}>Name</TableCell>
                  <TableCell sx={headCellSx}>Contact</TableCell>
                  <TableCell sx={headCellSx}>Qualification</TableCell>
                  <TableCell sx={headCellSx}>College</TableCell>
                  <TableCell sx={headCellSx}>Year</TableCell>
                  <TableCell sx={headCellSx}>Status</TableCell>
                  <TableCell sx={headCellSx}>Date</TableCell>
                  <TableCell align="right" sx={headCellSx}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id} hover>
                    <TableCell sx={{ fontWeight: 700, color: "#111" }}>
                      {row.fullName}
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        <MuiLink href={`mailto:${row.email}`}>{row.email}</MuiLink>
                      </Typography>
                      <Typography sx={{ fontSize: "0.8rem", color: "#6b7280" }}>
                        {row.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>{row.qualification}</TableCell>
                    <TableCell>{row.college}</TableCell>
                    <TableCell>{row.yearOfPassing}</TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={row.status || "new"}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        sx={{ minWidth: 130 }}
                      >
                        {STATUS_OPTIONS.map((item) => (
                          <MenuItem key={item.value} value={item.value}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ color: "#6b7280", whiteSpace: "nowrap" }}>
                      {new Date(row.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title={row.resumeUrl ? "View resume" : "No resume"}>
                          <span>
                            <IconButton
                              size="small"
                              disabled={!row.resumeUrl}
                              onClick={() =>
                                setResume({
                                  url: row.resumeUrl,
                                  fileName: row.resumeFileName,
                                  fullName: row.fullName,
                                  jobTitle: "Training Program",
                                })
                              }
                              sx={{ border: "1px solid #e5e7eb", borderRadius: 1.5 }}
                            >
                              <DescriptionOutlinedIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            size="small"
                            onClick={() => setPendingDelete(row)}
                            sx={{
                              border: "1px solid #fecaca",
                              borderRadius: 1.5,
                              color: "#dc2626",
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
        )}

        {!loading && total > 0 ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              px: 2,
              py: 1.5,
              borderTop: "1px solid #eef0f3",
            }}
          >
            <Typography sx={{ color: "#6b7280", fontSize: "0.85rem" }}>
              Showing {from}-{to} of {total}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Select
                size="small"
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}/page
                  </MenuItem>
                ))}
              </Select>
              <IconButton
                size="small"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                <ChevronLeftIcon />
              </IconButton>
              <Typography sx={{ fontSize: "0.85rem" }}>
                {page}/{totalPages}
              </Typography>
              <IconButton
                size="small"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              >
                <ChevronRightIcon />
              </IconButton>
            </Stack>
          </Box>
        ) : null}
      </Paper>

      <ResumePreviewDialog
        open={Boolean(resume)}
        resume={resume}
        onClose={() => setResume(null)}
      />

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this application?"
        description={
          pendingDelete
            ? `Training application from “${pendingDelete.fullName}” will be permanently removed.`
            : "This action cannot be undone."
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
