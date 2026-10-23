"use client";

import { Box, Container, Typography } from "@mui/material";

export default function GlobalOutlookSection() {
  return (
    <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
      <Box
        sx={{
          px: { xs: 2, md: 4 },
          py: { xs: 6, md: 8 },
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          fontFamily: "montserrat, inter",
        }}
      >
        {/* Card 1 */}
        <InfoCard
          title="Global Outlook, Local Expertise"
          description="At TriWinz, we pride ourselves on combining global best practices with local market understanding. Whether you are a startup in London, a government department in Kerala, or a logistics company in Dallas — we understand what it takes to power your vision with technology."
        />

        {/* Card 2 */}
        <InfoCard
          title="Let's Build Something Together"
          description="Have a business idea, a digital pain point, or a project in mind? We’re just one conversation away."
        />
      </Box>
    </Container>
  );
}

/* Reusable card */
function InfoCard({ title, description }) {
  return (
    <Box
      sx={{
        flex: {
          xs: "1 1 100%",
          md: "1 1 calc(50% - 32px)",
        },
        maxWidth: {
          xs: "100%",
          md: "calc(50% - 32px)",
        },
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        backgroundColor: "#FAF5FF",
        border: "1px solid #EEE",
      }}
    >
      <Typography
        fontWeight={700}
        sx={{
          fontSize: "1.25rem",
          mb: 1.5,
          color: "#111827",
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          color: "#374151",
          lineHeight: 1.7,
          fontSize: "0.95rem",
        }}
      >
        {description}
      </Typography>
    </Box>
  );
}
