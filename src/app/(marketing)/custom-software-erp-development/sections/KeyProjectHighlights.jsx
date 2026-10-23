"use client";

import { Box, Container, Typography, Card, CardContent } from "@mui/material";

const projects = [
  {
    title: "Biometric Visa System for a Global Visa Logistics Leader",
    description:
      "Visa ERP Suite for a global visa logistics pioneer – enabled biometric processing, document handling, and multi-country deployment.",
    image: "/it-digital-transformation/98528-1.webp", // replace with your real paths
  },
  {
    title: "Employee Gamification & Retention System for India’s Top Airline",
    description:
      "Gamified HR System for a top Indian airline – boosted employee retention and engagement through performance-linked rewards.",
    image:
      "/it-digital-transformation/pexels-maxim-kovalev-77351469-8647599-1.webp",
  },
  {
    title: "Guinness World Record Event Digital Partner",
    description:
      "Gamified HR System for a top Indian airline – boosted employee retention and engagement through performance-linked rewards.",
    image:
      "/it-digital-transformation/hal-gatewood-Nzb4LBsctyQ-unsplash-1.webp",
  },
  {
    title: "Enterprise Insurance Broking Software for a 100+ year old Firm",
    description:
      "Insurance Broking ERP built for one of India’s oldest insurance firms – managing policy issuance, commissions, renewals, and reporting.",
    image: "/it-digital-transformation/ghhjj.webp",
  },
];

export default function KeyProjectHighlights() {
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
        {/* Section Title */}
        <Typography
          fontWeight={800}
          sx={{
            mb: 2,
            fontSize: { xs: "1.8rem", md: "2.2rem" },
            color: "#0F172A",
          }}
        >
          Notable Projects & Experience
        </Typography>

        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            opacity: 0.95,
            maxWidth: 720,
            mb: 4,
            lineHeight: 1.7,
            color: "#6B7280",
            fontWeight: 500,
          }}
        >
          Our portfolio includes high-impact software and ERP solutions for
          diverse clients:
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
                  <Typography
                    sx={{
                      fontSize: "0.85rem",
                      color: "#6B7280",
                      lineHeight: 1.6,
                      fontWeight: 500,
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
