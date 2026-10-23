"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
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
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { toast } from "react-hot-toast";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import AdminPageHeader from "../../components/AdminPageHeader";
import { BRAND } from "../../../../lib/brand";

const PAGE_SIZE_OPTIONS = [5, 10, 20];

const STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "archived", label: "Archived" },
];

export default function AdminContactsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [newCount, setNewCount] = useState(0);
  const [failedEmailCount, setFailedEmailCount] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(0);
  const [statusFilter, setStatusFilter] = useState("");
  const [emailFilter, setEmailFilter] = useState("");

  const load = useCallback(
    async (pageToLoad = page, size = pageSize) => {
      setLoading(true);
      const params = new URLSearchParams({
        page: String(pageToLoad),
        pageSize: String(size),
      });
      if (statusFilter) params.set("status", statusFilter);
      if (emailFilter) params.set("emailSent", emailFilter);

      const res = await fetch(`/api/admin/contacts?${params.toString()}`);
      if (!res.ok) {
        toast.error("Failed to load contact messages");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setRows(data.items || []);
      setTotal(data.total || 0);
      setTotalPages(data.totalPages || 1);
      setNewCount(data.newCount || 0);
      setFailedEmailCount(data.failedEmailCount || 0);
      setFrom(data.from || 0);
      setTo(data.to || 0);
      setPage(data.page || pageToLoad);
      setPageSize(data.pageSize || size);
      setLoading(false);
    },
    [page, pageSize, statusFilter, emailFilter],
  );

  useEffect(() => {
    load(page, pageSize);
  }, [page, pageSize, load]);

  async function updateStatus(id, status) {
    const res = await fetch(`/api/admin/contacts/${id}`, {
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
    const res = await fetch(`/api/admin/contacts/${pendingDelete.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Message deleted");
    setPendingDelete(null);
    await load(page, pageSize);
  }

  async function openView(row) {
    setViewItem(row);
    if (row.status === "new") {
      await updateStatus(row.id, "read");
      setViewItem((prev) => (prev ? { ...prev, status: "read" } : prev));
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title="Contact messages"
        description={`${newCount} new · ${failedEmailCount} email failed`}
      />

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.5}
        sx={{ mb: 2 }}
      >
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
        <Select
          size="small"
          displayEmpty
          value={emailFilter}
          onChange={(e) => {
            setEmailFilter(e.target.value);
            setPage(1);
          }}
          sx={{ minWidth: 180, bgcolor: "#fff" }}
        >
          <MenuItem value="">All email statuses</MenuItem>
          <MenuItem value="true">Email sent</MenuItem>
          <MenuItem value="false">Email failed</MenuItem>
        </Select>
      </Stack>

      <Paper
        elevation={0}
        sx={{
          borderRadius: 2,
          border: "1px solid #e8eaed",
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
            <Typography sx={{ fontWeight: 700, color: "#111" }}>
              No contact messages yet
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ minWidth: 900 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Company
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Contact
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Email status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Date
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ fontWeight: 700, color: "#4b5563" }}
                  >
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
                    <TableCell>{row.company}</TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: "0.85rem" }}>
                        <MuiLink href={`mailto:${row.email}`}>
                          {row.email}
                        </MuiLink>
                      </Typography>
                      <Typography
                        sx={{ fontSize: "0.8rem", color: "#6b7280" }}
                      >
                        {row.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.emailSent ? "Sent" : "Failed"}
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.emailSent ? "#ecfdf5" : "#fef2f2",
                          color: row.emailSent ? "#047857" : "#dc2626",
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={row.status || "new"}
                        onChange={(e) => updateStatus(row.id, e.target.value)}
                        sx={{ minWidth: 120 }}
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
                      <Stack
                        direction="row"
                        spacing={0.5}
                        justifyContent="flex-end"
                      >
                        <Tooltip title="View message">
                          <IconButton
                            size="small"
                            onClick={() => openView(row)}
                            sx={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 1.5,
                            }}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
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

      <Dialog
        open={Boolean(viewItem)}
        onClose={() => setViewItem(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Contact message</DialogTitle>
        <DialogContent dividers>
          {viewItem ? (
            <Stack spacing={1.5}>
              <Typography>
                <strong>Name:</strong> {viewItem.fullName}
              </Typography>
              <Typography>
                <strong>Company:</strong> {viewItem.company}
              </Typography>
              <Typography>
                <strong>Email:</strong> {viewItem.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {viewItem.phone}
              </Typography>
              <Typography>
                <strong>Email delivery:</strong>{" "}
                {viewItem.emailSent ? "Sent" : "Failed"}
              </Typography>
              {!viewItem.emailSent && viewItem.emailError ? (
                <Typography sx={{ color: "#dc2626", fontSize: "0.85rem" }}>
                  {viewItem.emailError}
                </Typography>
              ) : null}
              <Box
                sx={{
                  mt: 1,
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "#f9fafb",
                  border: "1px solid #e5e7eb",
                  whiteSpace: "pre-wrap",
                }}
              >
                {viewItem.message}
              </Box>
            </Stack>
          ) : null}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewItem(null)}>Close</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this message?"
        description={
          pendingDelete
            ? `Message from “${pendingDelete.fullName}” will be permanently removed.`
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
