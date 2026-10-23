import { Box, Container, Typography, Grid } from "@mui/material";
import React from "react";
import CaseStudyCard from "./sections/CaseStudyCard";
import { caseStudies } from "./sections/data";
import CTASection from "./sections/CTASection";

const page = () => {
  return (
    <>
      <Box
        sx={{
          minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "montserrat, inter",
          color: "#fff",
          py: { xs: 12, md: 18 },
        }}
      >
        {/* Wave overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),url('/about/bg-1-1.webp')", // optional
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
          {/* Tag */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2.5,
                py: 0.8,
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                fontWeight: 500,
              }}
            >
              Case Studies
            </Box>
          </Box>

          {/* Heading */}
          <Typography
            textAlign="center"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.15,
              mb: 3,
            }}
          >
            Real Results. Real Impact.
          </Typography>

          {/* Subheading */}
          <Typography
            textAlign="center"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 500,
              mb: 3,
              opacity: 0.95,
            }}
          >
            How We Help Businesses Build, Scale, and Succeed
          </Typography>

          {/* Description */}
          <Typography
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            Explore real-world case studies showcasing how we’ve partnered with
            startups and enterprises to design, build, and scale high-performing
            digital solutions. From modern web platforms to cloud-native systems
            and AI-powered products, see how our expertise drives measurable
            business outcomes.
          </Typography>
        </Container>
      </Box>
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, 1fr)",
            },
            gap: 4,
            alignItems: "stretch",
          }}
        >
          {caseStudies.map((item) => (
            <CaseStudyCard key={item.slug} {...item} />
          ))}
        </Box>
      </Container>

      <CTASection />
    </>
  );
};

export default page;
