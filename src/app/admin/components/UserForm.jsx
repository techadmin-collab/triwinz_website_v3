"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import {
  Box,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { toast } from "react-hot-toast";
import AdminFormShell, {
  AdminFormActions,
  AdminFormLoading,
  FormSection,
} from "./AdminFormShell";
import { ADMIN_MODULES, ALL_MODULE_KEYS } from "../../../lib/permissions";

const fieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 1.5,
    bgcolor: "#fff",
  },
};

const empty = {
  name: "",
  email: "",
  role: "staff",
  permissions: ["dashboard"],
  active: true,
  password: "",
};

export default function UserForm({ userId, currentRole }) {
  const router = useRouter();
  const { data: session } = useSession();
  const isEdit = Boolean(userId);
  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      const res = await fetch(`/api/admin/users/${userId}`);
      if (!res.ok) {
        toast.error("Failed to load user");
        router.push("/admin/users");
        return;
      }
      const data = await res.json();
      setForm({
        name: data.name || "",
        email: data.email || "",
        role: data.role || "staff",
        permissions: data.permissions || [],
        active: data.active !== false,
        password: "",
      });
      setLoading(false);
    })();
  }, [isEdit, userId, router]);

  function update(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "role" && value === "admin") {
        next.permissions = [...ALL_MODULE_KEYS];
      }
      return next;
    });
  }

  function togglePermission(key) {
    setForm((prev) => {
      const has = prev.permissions.includes(key);
      return {
        ...prev,
        permissions: has
          ? prev.permissions.filter((item) => item !== key)
          : [...prev.permissions, key],
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      email: form.email,
      role: form.role,
      permissions: form.role === "admin" ? ALL_MODULE_KEYS : form.permissions,
      active: form.active,
    };
    if (form.password) payload.password = form.password;

    const res = await fetch(
      isEdit ? `/api/admin/users/${userId}` : "/api/admin/users",
      {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          isEdit
            ? payload
            : { ...payload, password: form.password },
        ),
      },
    );

    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      toast.error(err.error || "Save failed");
      return;
    }

    const passwordChanged = Boolean(form.password);
    const editingSelf = isEdit && session?.user?.id === userId;

    if (passwordChanged && editingSelf) {
      toast.success("Password updated. Please sign in again.");
      await signOut({ callbackUrl: "/admin/login?passwordChanged=1" });
      return;
    }

    toast.success(
      passwordChanged && isEdit
        ? "User updated. They must sign in again with the new password."
        : isEdit
          ? "User updated"
          : "User created",
    );
    router.push("/admin/users");
    router.refresh();
  }

  if (loading) return <AdminFormLoading />;

  const canAssignAdmin = currentRole === "superadmin";

  return (
    <AdminFormShell
      bare
      maxWidth="100%"
      title={isEdit ? "Edit user" : "Add user"}
      description="Create login access and choose which admin modules this user can open."
      backHref="/admin/users"
    >
      <Box component="form" onSubmit={handleSubmit}>
        <FormSection title="Account details">
          <Stack spacing={2}>
            <TextField
              label="Full name"
              required
              fullWidth
              size="small"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              sx={fieldSx}
            />
            <TextField
              label="Email"
              type="email"
              required
              fullWidth
              size="small"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              sx={fieldSx}
            />
            <TextField
              select
              label="Role"
              fullWidth
              size="small"
              value={form.role}
              onChange={(e) => update("role", e.target.value)}
              disabled={!canAssignAdmin && form.role === "admin"}
              sx={fieldSx}
            >
              {canAssignAdmin ? (
                <MenuItem value="admin">Admin (full access)</MenuItem>
              ) : null}
              <MenuItem value="staff">Staff (module permissions)</MenuItem>
            </TextField>
            <TextField
              label={isEdit ? "New password (optional)" : "Password"}
              type={showPassword ? "text" : "password"}
              required={!isEdit}
              fullWidth
              size="small"
              helperText="Minimum 8 characters"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              sx={fieldSx}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      size="small"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword((v) => !v)}
                      edge="end"
                    >
                      {showPassword ? (
                        <VisibilityOffOutlinedIcon fontSize="small" />
                      ) : (
                        <VisibilityOutlinedIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        </FormSection>

        <FormSection
          title="Module permissions"
          description={
            form.role === "admin"
              ? "Admin role always has access to every module."
              : "Select the modules this staff user can access."
          }
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
          >
            {ADMIN_MODULES.map((module) => (
              <FormControlLabel
                key={module.key}
                control={
                  <Checkbox
                    checked={
                      form.role === "admin" ||
                      form.permissions.includes(module.key)
                    }
                    disabled={form.role === "admin"}
                    onChange={() => togglePermission(module.key)}
                  />
                }
                label={module.label}
              />
            ))}
          </Box>
        </FormSection>

        <FormSection title="Status">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 2,
              p: 2,
              borderRadius: 2,
              bgcolor: form.active ? "#ecfdf5" : "#f9fafb",
              border: "1px solid",
              borderColor: form.active ? "#a7f3d0" : "#e5e7eb",
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 700, color: "#111" }}>
                {form.active ? "Active" : "Disabled"}
              </Typography>
              <Typography sx={{ color: "#6b7280", fontSize: "0.85rem", mt: 0.25 }}>
                {form.active
                  ? "User can sign in to the admin panel."
                  : "User cannot sign in until re-activated."}
              </Typography>
            </Box>
            <Switch
              checked={form.active}
              onChange={(e) => update("active", e.target.checked)}
              color="success"
            />
          </Box>
        </FormSection>

        <Divider sx={{ my: 1, borderColor: "transparent" }} />

        <AdminFormActions
          sticky
          saving={saving}
          saveLabel={isEdit ? "Update user" : "Create user"}
          onCancel={() => router.push("/admin/users")}
        />
      </Box>
    </AdminFormShell>
  );
}
