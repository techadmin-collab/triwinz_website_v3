"use client";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import AdminPageHeader from "./AdminPageHeader";
import { brandButtonSx } from "../../../lib/brand";

export default function AdminFormShell({
  title,
  description,
  backHref,
  children,
  maxWidth = "100%",
  bare = false,
}) {
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth,
        mx: "auto",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
        <Button
          component={Link}
          href={backHref}
          startIcon={<ArrowBackIcon />}
          sx={{
            px: 0,
            textTransform: "none",
            fontWeight: 600,
            color: "#6b7280",
            "&:hover": { bgcolor: "transparent", color: "#111" },
          }}
        >
          Back
        </Button>
      </Box>

      <AdminPageHeader
        title={title}
        description={description}
        align="center"
      />

      {bare ? (
        children
      ) : (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2.5, md: 3 },
            borderRadius: 2,
            border: "1px solid #e8eaed",
            bgcolor: "#fff",
          }}
        >
          {children}
        </Paper>
      )}
    </Box>
  );
}

export function AdminFormActions({
  saving,
  onCancel,
  saveLabel = "Save",
  sticky = false,
}) {
  return (
    <Stack
      direction={{ xs: "column-reverse", sm: "row" }}
      spacing={1.25}
      justifyContent="center"
      sx={{
        pt: sticky ? 0 : 1,
        ...(sticky
          ? {
              position: "sticky",
              bottom: 0,
              mt: 2,
              py: 2,
              bgcolor: "rgba(250,248,255,0.95)",
              backdropFilter: "blur(8px)",
              borderTop: "1px solid rgba(80, 20, 210, 0.1)",
              zIndex: 2,
            }
          : {}),
      }}
    >
      <Button
        onClick={onCancel}
        disabled={saving}
        sx={{ textTransform: "none", fontWeight: 600, color: "#4b5563" }}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={saving}
        disableElevation
        sx={{
          ...brandButtonSx,
          fontWeight: 700,
          px: 2.75,
        }}
      >
        {saving ? "Saving..." : saveLabel}
      </Button>
    </Stack>
  );
}

export function AdminFormLoading() {
  return (
    <Typography color="text.secondary" sx={{ py: 4, textAlign: "center" }}>
      Loading...
    </Typography>
  );
}

export function FormSection({ title, description, children }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2.25, md: 3 },
        borderRadius: 2,
        border: "1px solid #e8eaed",
        bgcolor: "#fff",
        mb: 2,
      }}
    >
      <Box sx={{ mb: 2.25, textAlign: "center" }}>
        <Typography sx={{ fontWeight: 800, color: "#111", fontSize: "1rem" }}>
          {title}
        </Typography>
        {description ? (
              <Typography
            sx={{
              mt: 0.4,
              color: "#6b7280",
              fontSize: "0.85rem",
              maxWidth: 720,
              mx: "auto",
            }}
          >
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Paper>
  );
}
