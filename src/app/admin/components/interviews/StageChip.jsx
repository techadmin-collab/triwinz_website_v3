import { Box } from "@mui/material";

/** Small coloured pill for an interview stage or level status. */
export default function StageChip({ label, color, bg, size = "md" }) {
  return (
    <Box
      component="span"
      sx={{
        display: "inline-flex",
        alignItems: "center",
        whiteSpace: "nowrap",
        px: size === "sm" ? 0.9 : 1.1,
        py: size === "sm" ? 0.15 : 0.3,
        borderRadius: 999,
        fontSize: size === "sm" ? "0.68rem" : "0.74rem",
        fontWeight: 800,
        letterSpacing: "0.02em",
        color,
        bgcolor: bg,
      }}
    >
      {label}
    </Box>
  );
}
