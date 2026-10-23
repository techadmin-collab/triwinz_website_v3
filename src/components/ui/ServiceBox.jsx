import { Box, Typography } from "@mui/material";
import Image from "next/image";

export default function ServiceBox({ title, icon }) {
  return (
    <Box
      sx={{
        backgroundColor: "#fff",
        borderRadius: "14px",
        px: 3,
        py: { xs: 1.5, md: 2 },
        display: "flex",
        alignItems: "center",
        gap: 2,
        cursor: "pointer",
        transition: "all 0.3s ease",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
        },
      }}
    >
      {/* Icon */}
      {icon}

      {/* Text */}
      <Typography
        sx={{
          fontWeight: 500,
          background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontSize: { xs: "0.7rem", md: "1rem" },
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </Typography>
    </Box>
  );
}
