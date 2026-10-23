"use client";

import { Box, Container, Typography } from "@mui/material";

export default function WhatWeOffer() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 8 },
        backgroundColor: "#F8F9F9",
        textAlign: "center",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="xl">
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
          What We Offer
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
          SAP Expertise Tailored to Your Needs
        </Typography>
      </Container>
    </Box>
  );
}
