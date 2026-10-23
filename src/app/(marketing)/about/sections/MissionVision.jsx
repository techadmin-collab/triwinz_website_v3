import { Box, Container, Typography } from "@mui/material";

export default function MissionVision() {
  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 12 },
        background: "linear-gradient(90deg, #3D74FF 0%, #FF4F81 100%)",
        fontFamily: "montserrat, inter",
        color: "#fff",
      }}
    >
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          px: { xs: 2, md: 0 },
          maxWidth: {
            xs: "1250px",
            xl: "xl",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, sm: 6, md: 8 },
            justifyContent: "center",
            alignItems: "stretch",
          }}
        >
          {/* Mission */}
          <GlassCard
            title="Our Mission"
            text="To empower businesses, governments, and people through practical, intelligent, and inclusive digital solutions that solve real problems."
          />

          {/* Vision */}
          <GlassCard
            title="Our Vision"
            text="To be a global force in purpose-driven technology – where every solution brings people closer to growth, dignity, and opportunity."
          />
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Reusable Glass Card ---------- */

function GlassCard({ title, text }) {
  return (
    <Box
      sx={{
        flex: 1,
        // maxWidth: { xs: "100%", sm: 520 },
        mx: "auto",
        textAlign: "center",
      }}
    >
      <Typography
        fontWeight={700}
        sx={{
          mb: { xs: 2.5, md: 4 },
          fontSize: {
            xs: "1.6rem",
            sm: "1.9rem",
            md: "2.125rem", // ~h4
          },
        }}
      >
        {title}
      </Typography>

      <Box
        sx={{
          px: { xs: 2.5, sm: 3, md: 14 },
          py: { xs: 3, sm: 4, md: 5 },
          borderRadius: "16px",
          backgroundColor: "rgba(255,255,255,0.15)",
          border: "1px solid rgba(255,255,255,0.3)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
            lineHeight: 1.7,
            fontWeight: 500,
            opacity: 0.95,
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
