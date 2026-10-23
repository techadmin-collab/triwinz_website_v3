"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";
import { Box, CircularProgress, Typography } from "@mui/material";

export default function AdminLogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/admin/login" });
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        gap: 1.5,
        background: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
        color: "#fff",
        px: 2,
      }}
    >
      <CircularProgress size={28} sx={{ color: "#fff" }} />
      <Typography sx={{ fontSize: "0.95rem", opacity: 0.9 }}>
        Signing you out…
      </Typography>
    </Box>
  );
}
