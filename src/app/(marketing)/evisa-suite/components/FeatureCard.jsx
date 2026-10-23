import { Box, Typography } from "@mui/material";

export default function FeatureCard({ icon, title, text }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: "12px",
        backgroundColor: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
        },
      }}
    >
      {icon}

      <Typography fontWeight={700} sx={{ mt: 2, mb: 1 }}>
        {title}
      </Typography>

      <Typography
        sx={{ fontSize: "0.95rem", color: "#4b5563", fontWeight: 600 }}
      >
        {text}
      </Typography>
    </Box>
  );
}
