"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ServiceBox from "src/components/ui/ServiceBox";
import {
  BusinessProcessOptimizationIcon,
  ITAndDigitalSolutionsIcon,
  SAPConsultingServicesIcon,
} from "./SvgIcons";

const images = [
  "/Component-27.webp",
  "/home/image.webp",
  "/home/Triwinz-Hero-Section-images-_-1.webp",
  "/home/Triwinz-Hero-Section-images-_-3.webp",
];

export default function HeroSection() {
  const [index, setIndex] = useState(0);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        display: "flex",
        alignItems: "center",
        py: { xs: 6, md: 2 },
        color: "#fff",
        fontFamily: "montserrat, inter",
        overflow: "hidden",
      }}
    >
      {images?.map((img, index) => (
        <Box
          key={index}
          component="img"
          src={img}
          alt="Triwinz"
          sx={{
            position: "absolute",
            inset: 0,
            width: "100%",
            minHeight: "100%",
            objectFit: "cover",
            opacity: index === current ? 1 : 0,
            transition: "opacity 1s ease-in-out",
          }}
        />
      ))}

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(rgba(0,0,0,0.15), rgba(0,0,0,0.25))",
          zIndex: 1,
        }}
      />

      {/* Content */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* Pill */}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mt: { xs: 10, md: 10 },
              gap: 1.5,
              px: { xs: 2, md: 3 },
              py: { xs: 0.5, md: 1 },
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.6)",
              backdropFilter: "blur(6px)",
              backgroundColor: "rgba(255,255,255,0.05)",
            }}
          >
            <Box
              sx={{
                width: 28,
                height: 28,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
              >
                <path
                  d="M22.4602 10.5316L24.2283 10.8434C25.7177 11.106 26.7122 12.5263 26.4496 14.0158L24.7852 23.4548C24.5226 24.9442 23.1023 25.9388 21.6128 25.6761L6.78009 23.0607C5.29066 22.7981 4.29613 21.3778 4.55876 19.8883L4.72841 18.9262M4.63092 3.35083H19.6925C21.2049 3.35083 22.431 4.57688 22.431 6.0893V15.6739C22.431 17.1863 21.2049 18.4124 19.6925 18.4124H4.63092C3.11851 18.4124 1.89246 17.1863 1.89246 15.6739V6.0893C1.89246 4.57688 3.11851 3.35083 4.63092 3.35083Z"
                  stroke="white"
                  strokeWidth="2.05"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Box>

            <Typography
              variant="body2"
              sx={{
                fontWeight: 500,
                fontSize: { xs: "0.75rem", sm: "0.875rem" },
                whiteSpace: "nowrap",
              }}
            >
              Agile digital solutions from idea to enterprise
            </Typography>
          </Box>
        </Box>

        {/* Heading */}
        <Typography
          component="h1"
          fontWeight="bold"
          gutterBottom
          sx={{
            textAlign: "center",
            fontSize: { xs: "2rem", sm: "2.6rem", md: "4rem" },
            lineHeight: 1.2,
          }}
        >
          From Problem-Solving to Business Scaling – Smarter IT Solutions
        </Typography>

        {/* Subheading */}
        <Box sx={{ maxWidth: 720, mx: "auto" }}>
          <Typography
            component="h2"
            sx={{
              mb: 4,
              textAlign: "center",
              fontSize: { xs: "0.95rem", sm: "1.1rem" },
              fontWeight: 600,
            }}
          >
            Talk to us for Expert IT consulting, Digital Transformation, AI
            driven Solutions, Infrastructure Enhancements and SAP support to
            scale smarter.
          </Typography>
        </Box>

        {/* Services */}
        <Grid container spacing={3} justifyContent="center" sx={{ mt: 4 }}>
          <Grid item xs={12} md={4}>
            <ServiceBox
              title="SAP Consulting Services"
              icon={<SAPConsultingServicesIcon />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ServiceBox
              title="IT & Digital Solutions"
              icon={<ITAndDigitalSolutionsIcon />}
            />
          </Grid>

          <Grid item xs={12} md={4}>
            <ServiceBox
              title="Business Process Optimization"
              icon={<BusinessProcessOptimizationIcon />}
            />
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
