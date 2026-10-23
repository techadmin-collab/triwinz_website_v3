"use client";

import { Box, Container, Typography, Card, CardContent } from "@mui/material";

import {
  TechnologyWithPurposeIcon,
  GlobalStandardsLocalAgilityIcon,
  AgileIcon,
} from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";

import LifecycleIcon from "../../evisa-suite/icons/LifecycleIcon";

const features = [
  {
    title: "Real-World Experience",
    description:
      "We’ve supported complex enterprise SAP environments - including mission-critical setups for a major media broadcaster and a leading logistics chain in India.",
    icon: <GlobalStandardsLocalAgilityIcon />,
  },
  {
    title: "Certified Professionals",
    description:
      "Our consultants carry SAP certifications and a proven track record across diverse industry verticals.",
    icon: <TechnologyWithPurposeIcon />,
  },
  {
    title: "End-to-End Capability",
    description:
      "From advisory and implementation to support and optimization - we deliver full lifecycle SAP related services.",
    icon: <LifecycleIcon />,
  },
  {
    title: "Client-Centric Approach",
    description:
      "We adapt to your systems, tools, and culture - delivering outcomes that fit seamlessly into your business operations.",
    icon: <GlobalStandardsLocalAgilityIcon />,
  },
  {
    title: "Agile, Transparent Delivery",
    description:
      "We bring the discipline of process with the speed of startup execution.",
    icon: <AgileIcon />,
  },
];

export default function WhyTriWinzSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#fff",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="xl">
        {/* Header */}
        <Box
          sx={{
            mb: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: "inline-block",
              mb: 2,
              px: 3,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "#EFE6FF",
              color: "#6A1BFF",
              fontSize: "0.85rem",
              fontWeight: 700,
            }}
          >
            We've a business-first mindset
          </Box>

          <Typography
            fontWeight={800}
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              lineHeight: 1.15,
              color: "#0F172A",
              textAlign: "center",
            }}
          >
            Why Choose TriWinz for SAP?
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {features.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 32px)",
                  md: "1 1 calc(33.333% - 32px)", // 👈 3 per row
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 32px)",
                  md: "calc(33.333% - 32px)",
                },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EEE",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 15px 40px rgba(0,0,0,0.08)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>

                  {/* Title */}
                  <Typography
                    fontWeight={700}
                    sx={{ mb: 1, fontSize: "1.05rem" }}
                  >
                    {item.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontSize: "0.95rem",
                      color: "#6B7280",
                      fontWeight: 500,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
