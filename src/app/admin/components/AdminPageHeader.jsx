import { Box, Typography } from "@mui/material";

export default function AdminPageHeader({
  title,
  description,
  action = null,
  align = "left",
}) {
  const centered = align === "center";

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: centered ? "column" : "row" },
        justifyContent: centered ? "center" : "space-between",
        alignItems: centered
          ? "center"
          : { xs: "stretch", sm: "flex-start" },
        textAlign: centered ? "center" : "left",
        gap: 2,
        mb: 3,
      }}
    >
      <Box sx={{ maxWidth: centered ? 560 : "none" }}>
        <Typography
          sx={{
            fontSize: { xs: "1.5rem", md: "1.75rem" },
            fontWeight: 800,
            color: "#111",
            letterSpacing: "-0.02em",
          }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography sx={{ mt: 0.5, color: "#6b7280", fontSize: "0.925rem" }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {action}
    </Box>
  );
}
