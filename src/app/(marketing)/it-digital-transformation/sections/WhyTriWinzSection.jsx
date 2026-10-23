"use client";

import { Box, Container, Typography, Card, CardContent } from "@mui/material";

import {
  IndustryCentricCustomizationIcon,
  TechnologyWithPurposeIcon,
  SpeedSecurityIcon,
  GlobalStandardsLocalAgilityIcon,
} from "../icons/RightConsultingPartnerIcon";

const features = [
  {
    title: "Industry-Centric Customisation",
    description:
      "We built a cloud-based biometric visa platform that streamlines everything — from registration to embassy processing. Now used globally, it ensures security, speed, and scalability.",
    icon: <IndustryCentricCustomizationIcon />,
  },
  {
    title: "Technology with Purpose",
    description:
      "We focus on tech that creates tangible business value. From cutting costs and improving accuracy to creating better user experiences, every solution is designed to do more.",
    icon: <TechnologyWithPurposeIcon />,
  },
  {
    title: "Speed + Security",
    description:
      "Whether it’s building an MVP or deploying a mission-critical system, we deliver quickly without compromising on compliance, performance, or security.",
    icon: <SpeedSecurityIcon />,
  },
  {
    title: "Global Standards, Local Agility",
    description:
      "We work with international frameworks (ISO, GDPR, OWASP) and understand India-specific needs from Aadhaar-based authentication to GST-ready reporting.",
    icon: <GlobalStandardsLocalAgilityIcon />,
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
        {/* Header */}
        <Box sx={{ mb: 6 }}>
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
              fontWeight: 800,
            }}
          >
            We’re Transformation Enablers
          </Box>

          <Typography
            fontWeight={800}
            sx={{
              fontSize: { xs: "2rem", md: "2.8rem" },
              lineHeight: 1.15,
              color: "#0F172A",
            }}
          >
            Why TriWinz is the Right Consulting Partner
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {features.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 32px)",
                  md: "1 1 calc(25% - 32px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 32px)",
                  md: "calc(25% - 32px)",
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
                      background: "linear-gradient(135deg, #6A6CF6, #FF4D94)",
                      color: "#fff",
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
                      lineHeight: 1.6,
                      fontWeight: 600,
                    }}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
