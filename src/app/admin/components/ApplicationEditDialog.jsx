"use client";

import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BRAND } from "../../../lib/brand";

export default function ApplicationEditDialog({
  open,
  application,
  referralSource,
  status,
  statusOptions,
  saving,
  onReferralSourceChange,
  onStatusChange,
  onClose,
  onSave,
}) {
  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{ sx: { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
        Edit application
        {application ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 0.5, fontWeight: 500 }}
          >
            {application.fullName}
            {application.jobTitle ? ` · ${application.jobTitle}` : ""}
          </Typography>
        ) : null}
      </DialogTitle>
      <DialogContent sx={{ position: "relative" }}>
        {saving ? (
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              bgcolor: "rgba(255,255,255,0.75)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 1,
            }}
          >
            <Stack alignItems="center" spacing={1.5}>
              <CircularProgress size={32} sx={{ color: BRAND.primary }} />
              <Typography variant="body2" fontWeight={600} color="text.secondary">
                Saving changes...
              </Typography>
            </Stack>
          </Box>
        ) : null}

        <Stack spacing={2.25} sx={{ mt: 0.5 }}>
          <Box>
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
              Status
            </Typography>
            <Select
              fullWidth
              size="small"
              value={status}
              onChange={(e) => onStatusChange(e.target.value)}
              disabled={saving}
              sx={{
                bgcolor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#e5e7eb",
                },
              }}
            >
              {statusOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <TextField
            fullWidth
            label="Referral source"
            placeholder="e.g. LinkedIn, colleague name, company website"
            value={referralSource}
            onChange={(e) => onReferralSourceChange(e.target.value)}
            disabled={saving}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !saving) {
                e.preventDefault();
                onSave();
              }
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={onClose}
          disabled={saving}
          sx={{ textTransform: "none", fontWeight: 700 }}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          disabled={saving}
          variant="contained"
          sx={{
            textTransform: "none",
            fontWeight: 700,
            backgroundImage: BRAND.gradient,
            boxShadow: "none",
            "&:hover": { boxShadow: "none", opacity: 0.95 },
          }}
        >
          {saving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
