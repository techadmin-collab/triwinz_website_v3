import { Box, Container, Typography, Stack } from "@mui/material";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

export default function AboutHero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "100vh", xl: "80vh" },
        color: "#fff",
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        overflow: "hidden",
        py: { xs: 8, md: 4 },
        backgroundImage: `
          linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),
          url("/about/bg-1-1.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 4,
          py: { xs: 4, md: 0 },
        }}
      >
        {/* Small pill */}
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            gap: 1,
            px: { xs: 2, sm: 2.5 },
            py: 1,
            my: { xs: 3, md: 4 },
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.35)",
            backgroundColor: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(6px)",
            fontSize: { xs: "0.8rem", sm: "0.95rem" },
            textAlign: "center",
          }}
        >
          <ShieldOutlinedIcon fontSize="small" />
          We believe success should always be shared
        </Box>

        {/* Main heading */}
        <Typography
          fontWeight={800}
          sx={{
            fontSize: {
              xs: "2rem",
              sm: "2.6rem",
              md: "4rem",
            },
            lineHeight: 1.15,
            mb: { xs: 4, md: 5 },
            width: { xs: "100%", md: "70%" },
          }}
        >
          Committed to Winning Together
        </Typography>

        {/* Stats */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2.5, sm: 4 }}
          justifyContent="center"
          alignItems="center"
        >
          <Stat icon={<ShieldOutlinedIcon />} text="20+ Years of Experience" />
          <Stat icon={<BoltOutlinedIcon />} text="100+ Projects Completed" />
          <Stat icon={<PublicOutlinedIcon />} text="Across 16 countries" />
        </Stack>
      </Container>
    </Box>
  );
}

/* ---------- Helper ---------- */

function Stat({ icon, text }) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.2,
        fontSize: { xs: "0.9rem", sm: "1rem" },
        opacity: 0.95,
      }}
    >
      {icon}
      <Typography fontWeight={500}>{text}</Typography>
    </Box>
  );
}
