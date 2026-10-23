import { Box, Container, Typography } from "@mui/material";
import React from "react";

const EGovernanceHero = () => {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        display: "flex",
        alignItems: "center",
        p: 2,
        alignContent: "center",
        color: "#fff",
        backgroundImage:
          "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%), url('/sap-consulting-support-services/gbdb.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
        <Box
          sx={{
            maxWidth: 720,
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            py: 5,
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: "0.85rem",
              fontWeight: 500,
              mt: 10,
            }}
          >
            <Box
              component="img"
              src="/evisa-suite/shield.webp"
              alt=""
              sx={{ width: 16, height: 16, mr: 1 }}
            />{" "}
            eGovernance & Visa Platform Solutions
          </Box>

          {/* Heading */}
          <Typography
            component={"h1"}
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.1,
            }}
          >
            Enabling Digital India, Empowering Global Access
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              opacity: 0.95,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 500,
            }}
          >
            TriWinz Technologies delivers robust and scalable digital governance
            platforms and visa automation solutions tailored for governments,
            embassies, public service institutions, and community-centric
            initiatives.
          </Typography>

          <Typography
            sx={{
              opacity: 0.9,
              lineHeight: 1.7,
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 500,
            }}
          >
            With deep expertise in building large-scale digital infrastructure
            and citizen-centric service portals, we are uniquely positioned to
            support national and international missions for digital
            transformation.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default EGovernanceHero;
