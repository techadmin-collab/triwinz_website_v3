"use client";

import { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast } from "react-hot-toast";
import AdminPageHeader from "../../components/AdminPageHeader";
import { brandButtonSx } from "../../../../lib/brand";

function PasswordVisibilityAdornment({ visible, onToggle }) {
  return (
    <InputAdornment position="end">
      <IconButton
        size="small"
        aria-label="Toggle password visibility"
        onClick={onToggle}
        edge="end"
      >
        {visible ? (
          <VisibilityOffOutlinedIcon fontSize="small" />
        ) : (
          <VisibilityOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </InputAdornment>
  );
}

export default function AdminAccountPage() {
  const { data: session } = useSession();
  const isSuperAdmin = session?.user?.role === "superadmin";
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setSaving(true);
    const res = await fetch("/api/admin/account/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    setSaving(false);

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Failed to update password");
      return;
    }

    toast.success("Password updated. Please sign in again.");
    await signOut({ callbackUrl: "/admin/login?passwordChanged=1" });
  }

  return (
    <Box>
      <AdminPageHeader
        title="Account"
        description="Manage your login password."
      />

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3 },
          borderRadius: 2,
          border: "1px solid #e8eaed",
          bgcolor: "#fff",
          maxWidth: 560,
        }}
      >
        <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
          {session?.user?.name || "User"}
        </Typography>
        <Typography sx={{ color: "#6b7280", mb: 2.5, fontSize: "0.9rem" }}>
          {session?.user?.email}
        </Typography>

        {isSuperAdmin ? (
          <Alert severity="info">
            Super admin password is managed in environment variables
            (`ADMIN_PASSWORD` in `.env`), not from this screen.
          </Alert>
        ) : (
          <Box component="form" onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="Current password"
                type={showCurrent ? "text" : "password"}
                required
                fullWidth
                size="small"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <PasswordVisibilityAdornment
                      visible={showCurrent}
                      onToggle={() => setShowCurrent((v) => !v)}
                    />
                  ),
                }}
              />
              <TextField
                label="New password"
                type={showNew ? "text" : "password"}
                required
                fullWidth
                size="small"
                helperText="Minimum 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <PasswordVisibilityAdornment
                      visible={showNew}
                      onToggle={() => setShowNew((v) => !v)}
                    />
                  ),
                }}
              />
              <TextField
                label="Confirm new password"
                type={showConfirm ? "text" : "password"}
                required
                fullWidth
                size="small"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <PasswordVisibilityAdornment
                      visible={showConfirm}
                      onToggle={() => setShowConfirm((v) => !v)}
                    />
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
                disableElevation
                sx={{ ...brandButtonSx, fontWeight: 700, alignSelf: "flex-start" }}
              >
                {saving ? "Saving..." : "Update password"}
              </Button>
            </Stack>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
