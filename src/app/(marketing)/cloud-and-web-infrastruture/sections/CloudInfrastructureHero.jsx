import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function CloudInfrastructureHero() {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        display: "flex",
        p: 2,
        alignItems: "center",
        color: "#fff",
        backgroundImage:
          "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%), url('/it-digital-transformation/gbdb.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "montserrat, inter",
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
            maxWidth: 760,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            py: 4,
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: "0.85rem",
              fontWeight: 500,
              mt: 10,
            }}
          >
            <Box
              component="img"
              src="/evisa-suite/shield.webp"
              alt=""
              sx={{ width: 16, height: 16, mr: 1 }}
            />{" "}
            Provide best Cloud & Web Infrastructure Services
          </Box>

          {/* Heading */}
          <Typography
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.3rem", md: "3.6rem" },
              lineHeight: 1.1,
            }}
          >
            Powering Your Digital Presence – Securely, Reliably and at Scale
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              opacity: 0.95,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            At <strong>TriWinz Technologies</strong>, we specialise in
            delivering complete Cloud & Web Infrastructure Services that enable
            you to launch, run, and grow your digital platforms effortlessly.
          </Typography>

          <Typography
            sx={{
              opacity: 0.9,
              lineHeight: 1.7,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            We deliver everything your business needs from lightweight retail
            billing software to enterprise-grade ERP systems, ensuring you get
            full control, seamless integrations, and long-term value. We also
            establish a robust online foundation with domain registration, SSL
            integration to cloud hosting, virtual machines, and enterprise-grade
            security.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
