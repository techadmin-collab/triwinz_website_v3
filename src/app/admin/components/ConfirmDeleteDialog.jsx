"use client";

import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { brandButtonSx } from "../../../lib/brand";

export default function ConfirmDeleteDialog({
  open,
  title = "Delete item?",
  description = "This action cannot be undone.",
  confirmLabel = "Delete",
  confirmColor = "error",
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: "text.secondary" }}>
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={loading}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          disabled={loading}
          variant="contained"
          color={confirmColor}
          disableElevation
          sx={{
            textTransform: "none",
            fontWeight: 700,
            minWidth: 96,
            ...(confirmColor === "inherit" ? brandButtonSx : {}),
          }}
        >
          {loading ? (
            <CircularProgress size={18} sx={{ color: "#fff" }} />
          ) : (
            confirmLabel
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
