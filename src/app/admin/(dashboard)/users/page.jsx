"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import AdminPageHeader from "../../components/AdminPageHeader";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import { brandButtonSx, BRAND } from "../../../../lib/brand";

export default function AdminUsersPage() {
  const { data: session } = useSession();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    if (!res.ok) {
      toast.error("Failed to load users");
      setLoading(false);
      return;
    }
    setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    const res = await fetch(`/api/admin/users/${pendingDelete.id}`, {
      method: "DELETE",
    });
    setDeleting(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Delete failed");
      return;
    }
    toast.success("User deleted");
    setPendingDelete(null);
    await load();
  }

  return (
    <Box>
      <AdminPageHeader
        title="Users"
        description="Create admin and staff logins, and control module access."
        action={
          <Button
            component={Link}
            href="/admin/users/new"
            startIcon={<AddIcon />}
            variant="contained"
            disableElevation
            sx={{ ...brandButtonSx, fontWeight: 700, px: 2 }}
          >
            Add user
          </Button>
        }
      />

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
            <Typography sx={{ fontWeight: 700, color: "#111", mb: 0.5 }}>
              No users yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              Create an admin or staff account to share panel access.
            </Typography>
            <Button
              component={Link}
              href="/admin/users/new"
              startIcon={<AddIcon />}
              variant="contained"
              disableElevation
              sx={{ ...brandButtonSx, fontWeight: 700 }}
            >
              Add user
            </Button>
          </Box>
        ) : (
          <Box sx={{ width: "100%", overflowX: "auto" }}>
            <Table sx={{ minWidth: 820 }}>
              <TableHead>
                <TableRow sx={{ bgcolor: "#fafafa" }}>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Name
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Role
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Permissions
                  </TableCell>
                  <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                    Status
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
                    <TableCell sx={{ fontWeight: 700 }}>{row.name}</TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.role}
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                        {(row.permissions || []).map((perm) => (
                          <Chip
                            key={perm}
                            size="small"
                            label={perm}
                            sx={{ textTransform: "capitalize" }}
                          />
                        ))}
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Chip
                        size="small"
                        label={row.active ? "Active" : "Disabled"}
                        sx={{
                          fontWeight: 700,
                          bgcolor: row.active ? "#ecfdf5" : "#f3f4f6",
                          color: row.active ? "#047857" : "#4b5563",
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title="Edit">
                          <IconButton
                            component={Link}
                            href={`/admin/users/${row.id}/edit`}
                            size="small"
                            sx={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 1.5,
                            }}
                          >
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <span>
                            <IconButton
                              size="small"
                              disabled={session?.user?.id === row.id}
                              onClick={() => setPendingDelete(row)}
                              sx={{
                                border: "1px solid #fecaca",
                                borderRadius: 1.5,
                                color: "#dc2626",
                              }}
                            >
                              <DeleteOutlineIcon fontSize="small" />
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        )}
      </Paper>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title="Delete this user?"
        description={
          pendingDelete
            ? `“${pendingDelete.name}” will lose admin access immediately.`
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
