"use client";

import { Button, Container, Paper, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

const CTASection = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 8, fontFamily: "montserrat, inter" }}>
      <Paper
        sx={{
          p: 6,
          textAlign: "center",
          backgroundColor: "primary.lightest",
          background: "linear-gradient(122deg, #1D5758ff 0%, #2BD1C7ff 100%)",
          color: "#fff",
          borderRadius: 4,
        }}
      >
        <Typography variant="h4" fontWeight={800} mb={2}>
          Ready to Transform Your Business?
        </Typography>
        <Typography variant="body1" mb={4} sx={{ maxWidth: 600, mx: "auto" }}>
          Let's discuss how we can help you achieve similar results for your
          organization.
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          justifyContent="center"
        >
          <Button
            component={Link}
            href="/contact-us"
            variant="contained"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "rgba(255,255,255,0.18)",
              backgroundImage: "none",
              backdropFilter: "blur(6px)",
              boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
              "&:hover": {
                backgroundColor: "rgba(255,255,255,0.28)",
                backgroundImage: "none",
                boxShadow: "0px 12px 32px rgba(0,0,0,0.25)",
              },
            }}
          >
            Schedule a Consultation
          </Button>
          <Button
            component={Link}
            href="/case-studies"
            variant="outlined"
            size="large"
            sx={{
              px: 4,
              py: 1.5,
              fontWeight: 600,
              borderColor: "#fff",
              color: "#fff",
            }}
          >
            View More Case Studies
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default CTASection;
