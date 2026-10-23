"use client";

import { Box, Container, Typography } from "@mui/material";

export default function WhatWeDoSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#F8F9F9",
        textAlign: "center",
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
        {/* Badge */}
        <Box
          sx={{
            display: "inline-block",
            mb: 3,
            px: 3,
            py: 0.8,
            borderRadius: "999px",
            backgroundColor: "#EFE6FF",
            color: "#6A1BFF",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          What We Do
        </Box>

        {/* Heading */}
        <Typography
          fontWeight={800}
          gutterBottom
          sx={{
            fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3rem" },
            lineHeight: 1.15,
            color: "#0F172A",
          }}
        >
          Complete Cloud & Web Infrastructure Services
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            mt: 3,
            color: "#6B7280",
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            lineHeight: 1.8,
            maxWidth: "80%",
            fontWeight: 500,
            mx: "auto",
          }}
        >
          We don’t just set up servers – we build resilient, optimized
          ecosystems that align with your business objectives and evolve with
          your needs.
        </Typography>
      </Box>
    </Box>
  );
}
