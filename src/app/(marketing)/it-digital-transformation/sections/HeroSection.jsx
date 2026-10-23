"use client";

import { Box, Container, Typography } from "@mui/material";

export default function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        display: "flex",
        alignItems: "center",
        p: 2,
        color: "#fff",
        position: "relative",
        backgroundImage: `linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),url("/it-digital-transformation/gbdb.webp")`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
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
        <Box sx={{ maxWidth: 780, mt: 5 }}>
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mb: 3,
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              fontWeight: 500,
              mt: 10,
              textAlign: "center",
            }}
          >
            <Box
              component="img"
              src="/evisa-suite/shield.webp"
              alt="shield"
              sx={{ width: 16, height: 16, mr: 1 }}
            />{" "}
            IT & Digital Transformation Consulting for reshaping your business
          </Box>

          {/* Heading */}
          <Typography
            component={"h1"}
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.8rem" },
              lineHeight: 1.1,
            }}
          >
            Helping You Reimagine, Reinvent and Rise in a Digital World
          </Typography>

          {/* Paragraph 1 */}
          <Typography
            sx={{
              mt: 3,
              mb: 2.5,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              opacity: 0.95,
              lineHeight: 1.7,
            }}
          >
            We work with government bodies, enterprises, and SMEs to reimagine
            business models, streamline operations, enhance user experiences,
            and unlock sustainable growth — all powered by intelligent,
            integrated technology.
          </Typography>

          {/* Paragraph 2 */}
          <Typography
            sx={{
              fontSize: { xs: "0.9rem", md: "1rem" },
              opacity: 0.9,
              lineHeight: 1.7,
            }}
          >
            Whether you're exploring cloud adoption, automating workflows,
            launching a new digital product, or modernizing an outdated IT
            ecosystem, TriWinz delivers full spectrum deep technical expertise,
            cross-industry insights with a focus on impact which enables
            organizations to lead in their industries, not follow.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
