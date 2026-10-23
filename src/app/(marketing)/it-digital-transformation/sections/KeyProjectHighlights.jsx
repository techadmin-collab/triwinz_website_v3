"use client";

import { Box, Container, Typography, Card, CardContent } from "@mui/material";

const projects = [
  {
    title: "Biometric Visa System for a Global Visa Logistics Leader",
    description:
      "We built a biometric-enabled, cloud-based visa application and processing platform that streamlined every step—from applicant registration and payment to biometric enrolment and embassy backend. This solution is now operational across embassies and consulates worldwide, handling sensitive data with security, speed, and scalability.",
    image: "/it-digital-transformation/98528-1.webp", // replace with your real paths
  },
  {
    title: "Employee Gamification & Retention System for India’s Top Airline",
    description:
      "To tackle high attrition rates and low engagement, we designed a gamified employee rewards platform linked to performance milestones and peer recognition. This digital initiative led to a measurable drop in churn and helped improve internal culture and productivity.",
    image:
      "/it-digital-transformation/pexels-maxim-kovalev-77351469-8647599-1.webp",
  },
  {
    title: "Guinness World Record Event Digital Partner",
    description:
      "As the official tech partner of a mega event that broke a world record, TriWinz managed the digital enrolment, crowd control, and queue optimization of over 30,000 participants in a single day. Using our proprietary InQMate™ solution, we ensured seamless footfall management, real-time reporting, and zero service disruptions.",
    image:
      "/it-digital-transformation/hal-gatewood-Nzb4LBsctyQ-unsplash-1.webp",
  },
  {
    title: "Enterprise Insurance Broking Software for a 100+ year old Firm",
    description:
      "We created an end-to-end broking platform that digitized core operations including policy management, partner coordination, claim processing, compliance, and client servicing. Built with cloud-first architecture, the solution scaled across branches and embedded dashboards for real-time operational visibility.",
    image: "/it-digital-transformation/ghhjj.webp",
  },
];

export default function KeyProjectHighlights() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#F8F9F9",
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
        {/* Section Title */}
        <Typography
          fontWeight={800}
          sx={{
            mb: 4,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            color: "#0F172A",
          }}
        >
          Key Project Highlights
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
          }}
        >
          {projects.map((project, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 24px)",
                  md: "1 1 calc(25% - 24px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 24px)",
                  md: "calc(25% - 24px)",
                },
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EEE",
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 18px 45px rgba(0,0,0,0.08)",
                    transform: "translateY(-6px)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    p: 3,
                  }}
                >
                  <Box
                    component="img"
                    src={project.image}
                    alt={project.title}
                    sx={{
                      width: "100%",
                      objectFit: "cover",
                      borderRadius: 3,
                      display: "block",
                    }}
                  />
                </Box>

                <CardContent sx={{ p: 2 }}>
                  {/* Title */}
                  <Typography
                    fontWeight={700}
                    sx={{ mb: 1, fontSize: "0.95rem" }}
                  >
                    {project.title}
                  </Typography>

                  {/* Description */}
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#6B7280",
                      fontWeight: 600,
                    }}
                  >
                    {project.description}
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
