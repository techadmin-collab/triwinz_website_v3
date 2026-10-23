"use client";

import { Box, Container, Typography } from "@mui/material";
import React from "react";

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
            backgroundImage: "url('/about/bg-1-1.webp')", // optional
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
              Meet Our Team
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
            The People Powering TriWinz
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
            Meet the Visionaries, Builders, and Innovators Behind TriWinz
            {/* Passionate professionals building scalable, future-ready digital
            solutions */}
          </Typography>

          {/* Description */}
          <Typography
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "1rem",
              opacity: 0.9,
            }}
          >
            Our team brings together experienced engineers, creative designers,
            and strategic thinkers who are passionate about building meaningful
            digital experiences. With deep expertise across web development,
            cloud solutions, AI, and enterprise platforms, we collaborate
            closely to deliver reliable, scalable, and impactful solutions for
            businesses worldwide.
          </Typography>

          <Typography
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              fontSize: "0.95rem",
              opacity: 0.7,
              mt: 2,
            }}
          >
            At TriWinz, our strength lies in our people. We are a close-knit
            team of engineers, designers, and innovators who thrive on solving
            complex challenges. By combining technical excellence with
            creativity and collaboration, we help businesses transform ideas
            into powerful digital products that scale with confidence.
          </Typography>
        </Container>
      </Box>

      {/* <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, py: 8 }}>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={700} gutterBottom>
              Leadership
            </Typography>
          </Box>
        </Box>
      </Container> */}

      {/* <TeamSection /> */}
    </>
  );
};

export default page;
