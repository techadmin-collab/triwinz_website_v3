"use client";

import { useState } from "react";
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
  Typography,
  Tooltip,
} from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import AddIcon from "@mui/icons-material/Add";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import Link from "next/link";
import ConfirmDeleteDialog from "./ConfirmDeleteDialog";
import AdminPageHeader from "./AdminPageHeader";
import { brandButtonSx, BRAND } from "../../../lib/brand";

export default function AdminResourceList({
  title,
  description,
  createHref,
  createLabel,
  rows,
  loading,
  editHref,
  viewHref,
  onDelete,
  emptyText = "No items yet.",
  deleteTitle,
  getDeleteDescription,
}) {
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  async function handleConfirmDelete() {
    if (!pendingDelete) return;
    setDeleting(true);
    try {
      await onDelete(pendingDelete);
      setPendingDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Box>
      <AdminPageHeader
        title={title}
        description={description}
        action={
          <Button
            component={Link}
            href={createHref}
            startIcon={<AddIcon />}
            variant="contained"
            disableElevation
            sx={{
              ...brandButtonSx,
              fontWeight: 700,
              px: 2,
            }}
          >
            {createLabel}
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
              Nothing here yet
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2.5 }}>
              {emptyText}
            </Typography>
            <Button
              component={Link}
              href={createHref}
              startIcon={<AddIcon />}
              variant="contained"
              disableElevation
              sx={{
                ...brandButtonSx,
                fontWeight: 700,
              }}
            >
              {createLabel}
            </Button>
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              overflowX: "auto",
              WebkitOverflowScrolling: "touch",
              "&::-webkit-scrollbar": {
                height: 6,
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(80, 20, 210, 0.25)",
                borderRadius: 999,
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(80, 20, 210, 0.06)",
                borderRadius: 999,
              },
            }}
          >
            <Table sx={{ minWidth: 780 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                  Title
                </TableCell>
                <TableCell sx={{ fontWeight: 700, color: "#4b5563" }}>
                  Slug
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
                <TableRow
                  key={row.id}
                  hover
                  sx={{ "&:last-child td": { borderBottom: 0 } }}
                >
                  <TableCell sx={{ fontWeight: 700, color: "#111" }}>
                    {viewHref ? (
                      <Link
                        href={viewHref(row.id)}
                        style={{
                          color: "inherit",
                          textDecoration: "none",
                        }}
                      >
                        <Box
                          component="span"
                          sx={{
                            "&:hover": {
                              color: "#5014d2",
                              textDecoration: "underline",
                            },
                          }}
                        >
                          {row.title}
                        </Box>
                      </Link>
                    ) : (
                      row.title
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: "#6b7280",
                        fontFamily: "ui-monospace, monospace",
                        fontSize: "0.8rem",
                      }}
                    >
                      {row.slug}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={row.published ? "Published" : "Draft"}
                      sx={{
                        fontWeight: 700,
                        bgcolor: row.published ? "#ecfdf5" : "#f3f4f6",
                        color: row.published ? "#047857" : "#4b5563",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {viewHref ? (
                        <Tooltip title="View">
                          <IconButton
                            component={Link}
                            href={viewHref(row.id)}
                            aria-label="View"
                            size="small"
                            sx={{
                              border: "1px solid #e5e7eb",
                              borderRadius: 1.5,
                            }}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      ) : null}
                      <Tooltip title="Edit">
                        <IconButton
                          component={Link}
                          href={editHref(row.id)}
                          aria-label="Edit"
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
        )}
      </Paper>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title={
          deleteTitle ||
          `Delete ${pendingDelete?.title ? `"${pendingDelete.title}"` : "item"}?`
        }
        description={
          getDeleteDescription?.(pendingDelete) ||
          "This action cannot be undone."
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
