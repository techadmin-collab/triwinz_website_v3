"use client";

import { useState } from "react";
import {
  Container,
  Box,
  Typography,
  Chip,
  Stack,
  Paper,
  Button,
} from "@mui/material";
import { useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

import { caseStudies } from "../sections/data";
import CTASection from "../sections/CTASection";

const CaseStudyPage = () => {
  const { slug } = useParams();

  const study = caseStudies.find((cs) => cs.slug === slug);

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          fontFamily: "montserrat, inter",
        }}
      >
        {/* Hero Header */}
        <Box
          sx={{
            color: "#fff",
            backgroundImage:
              "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
            py: { xs: 12, md: 12 },
            position: "relative",
            overflow: "hidden",
            "&:before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            },
          }}
        >
          <Container maxWidth="lg">
            <Link href="/case-studies">
              <Button
                startIcon={<ArrowBackIcon />}
                sx={{
                  color: "white",
                  mb: 4,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.1)" },
                }}
              >
                Back to Case Studies
              </Button>
            </Link>

            <Stack spacing={2} position="relative" zIndex={1}>
              <Chip
                label={study?.industry}
                sx={{
                  backgroundColor: "rgba(255,255,255,0.2)",
                  color: "white",
                  fontWeight: 600,
                  alignSelf: "flex-start",
                }}
              />

              <Typography
                variant="h1"
                fontWeight={900}
                sx={{ fontSize: { xs: "2.5rem", md: "3.5rem" } }}
              >
                {study?.title}
              </Typography>

              <Typography variant="h5" sx={{ opacity: 0.9, fontWeight: 300 }}>
                {study?.summary}
              </Typography>
            </Stack>
          </Container>
        </Box>

        <Container
          maxWidth="lg"
          sx={{ py: 4, fontFamily: "montserrat, inter" }}
        >
          <Box
            sx={{
              typography: "body1",
              "& h1": { fontSize: "2rem", fontWeight: 700 },
              "& h2": { fontSize: "1.5rem", fontWeight: 600, mt: 3 },
              "& p": { mt: 1.5, lineHeight: 1.7 },
            }}
            dangerouslySetInnerHTML={{ __html: study?.content ?? "" }}
          />
        </Container>
      </Box>
      {/* CTA Section */}
      <CTASection />
    </>
  );
};

export default CaseStudyPage;
