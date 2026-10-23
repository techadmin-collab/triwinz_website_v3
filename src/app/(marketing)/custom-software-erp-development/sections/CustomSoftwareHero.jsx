import React from "react";
import { Box, Container, Typography } from "@mui/material";

const CustomSoftwareHero = () => {
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
            Building Intelligent, scalable, and Intuitive solutions
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
            Tailored Digital Solutions to Power Your Business Efficiency
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              opacity: 0.95,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            Every business is unique – and so should be the software that runs
            it. At TriWinz Technologies, we specialize in Custom Software and
            ERP Development that aligns with your specific goals, workflows, and
            growth plans. Our focus is on building intelligent, scalable, and
            intuitive solutions that solve real-world business problems across
            industries.
          </Typography>

          <Typography
            sx={{
              opacity: 0.9,
              lineHeight: 1.7,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            From lightweight retail billing software to enterprise-grade ERP
            systems, our development process is designed to give you full
            control, seamless integrations, and long-term value.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CustomSoftwareHero;
