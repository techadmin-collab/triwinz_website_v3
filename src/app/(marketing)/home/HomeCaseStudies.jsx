"use client";

import { Box, Container, Typography } from "@mui/material";

const proofBlocks = [
  {
    title: "Aviation & Immigration Platforms",
    description:
      "Mission-critical visa, consular, and passenger processing platforms built for sovereign compliance, scale, and zero operational tolerance across border and embassy environments.",
    image: "home/Us_Embassy_India_Appointment_System.webp",
    link: "/case-studies/us-embassy-india-appointment-system-consular-digitization-case-study",
  },
  {
    title: "Government-Scale Crowd Intelligence",
    description:
      "Audit-grade crowd intelligence and participant validation systems delivered for high-risk, large-scale public events with real-time visibility and regulatory assurance.",
    image: "home/Dubai_Police_guinness_Record_Event.webp",
    link: "/case-studies/india-usa-visa-interview-appointment",
  },
  {
    title: "Airline-Led Visa Digitisation",
    description:
      "Airline-integrated visa digitisation platforms enabling secure, end-to-end digital visa processing, compliance-aligned workflows, and frictionless passenger journeys across global markets.",
    image: "home/Etihad_Airways_Model_Visa.webp",
    link: "/case-studies/etihad-airways-visa-digitisation-platform-uae",
  },
  {
    title: "Retail & Hyperlocal Commerce",
    description:
      "Hyperlocal commerce and retail digitisation frameworks empowering neighborhood businesses with micro-ERP, quick-commerce fulfillment, and retailer-first digital ecosystems.",
    image: "home/Bizbuddy_Quick_Commerce.webp",
    link: "/case-studies/bizbuddy-hyperlocal-retail-quick-commerce-framework",
  },
];

const HomeCaseStudies = () => {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#fff",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            textAlign="center"
            gutterBottom
            sx={{
              color: "#343434",
              fontSize: "36px",
              fontWeight: 600,
            }}
          >
            Recent Work at a Glance
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              lg: "repeat(2, 1fr)",
            },
            gap: 4,
          }}
        >
          {proofBlocks.map((item, index) => (
            <Box
              key={index}
              component="a"
              href={item.link}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                alignItems: "center",
                border: "1px solid #e0e0e0",
                borderRadius: 2,
                overflow: "hidden",
                backgroundColor: "#fff",
                transition: "all 0.25s ease",
                "&:hover": {
                  boxShadow: "0 8px 28px rgba(0,0,0,0.08)",
                  transform: "translateY(-4px)",
                  cursor: "pointer",
                },
              }}
            >
              {/* Image */}
              <Box
                component="img"
                src={item.image}
                alt={item.title}
                sx={{
                  width: 200,
                  minWidth: 200,
                  // height: 200,
                  borderRadius: 2,
                  objectFit: "cover",
                  m: 2,
                }}
              />

              {/* Content */}
              <Box sx={{ p: 2, textAlign: "center" }}>
                <Typography
                  fontWeight={700}
                  sx={{ fontSize: { xs: "0.8rem", md: "1.1rem" }, mb: 1 }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    fontSize: { xs: "0.7rem", md: "0.95rem" },
                    opacity: 0.8,
                    lineHeight: 1.6,
                  }}
                >
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HomeCaseStudies;
