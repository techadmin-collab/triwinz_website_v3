"use client";

import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import BoltOutlinedIcon from "@mui/icons-material/BoltOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";

export default function VisaHero() {
  return (
    <Box
      sx={{
        position: "relative",
        minHeight: { xs: "100vh", xl: "80vh" },
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        py: { xs: 8, md: 4 },
        px: 2,
        overflow: "hidden",
        color: "#fff",
      }}
    >
      {/* Background Image with ALT */}
      <Box
        component="img"
        src="/evisa-suite/dhdh.webp"
        alt="EmiratiVisa"
        sx={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -2,
        }}
      />

      {/* Gradient Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%)",
          zIndex: -1,
        }}
      />
      {/* Background Image */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
        }}
      >
        {/* <Image
          src="/evisa-suite/dhdh.webp" // 👈 your background image path
          alt="Passport background"
          fill
          priority
          style={{ objectFit: "cover" }}
        /> */}

        {/* Gradient Overlay */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
          }}
        />
      </Box>

      {/* Content */}
      <Box
        sx={{
          width: "100%",
          mx: "auto",
          position: "relative",
          zIndex: 1,
          py: { xs: 8, md: 0 },
          px: { xs: 2, md: 0 },
          maxWidth: {
            xs: "1250px",
            xl: "xl",
          },
        }}
      >
        <Box sx={{ maxWidth: 720 }}>
          {/* Pill */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mt: { xs: 5, md: 10 },
              mb: 2,
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: { xs: "0.75rem", sm: "0.85rem" },
              fontWeight: 500,
              textAlign: "center",
            }}
          >
            <img
              src="/evisa-suite/shield.webp"
              className="w-4 h-4 mr-2"
              alt=""
            />
            Built by Experts. Designed for Governments. Trusted Globally.
          </Box>

          {/* Heading */}
          <Typography
            component={"h1"}
            fontWeight={800}
            sx={{
              fontSize: {
                xs: "2rem",
                sm: "2.6rem",
                md: "3.5rem",
              },
              lineHeight: 1.15,
              mb: 2,
            }}
          >
            SaaS Visa Platform for
            <br />
            Governments, Embassies & Partners
          </Typography>

          {/* Subtitle */}
          <Typography
            sx={{
              fontSize: { xs: "1rem", md: "1.1rem" },
              opacity: 0.95,
              mb: 3,
            }}
          >
            The Future of Visa Processing Is Here
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1rem" },
              lineHeight: 1.7,
              maxWidth: 600,
              opacity: 0.9,
              mb: 4,
            }}
          >
            eVisa Suite is a scalable, secure, and modular visa management
            platform tailored for governments, embassies, consulates, and
            authorized visa facilitation partners.
          </Typography>

          {/* Stats */}
          <Box
            sx={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "start",
              gap: { xs: 2, sm: 4 },
            }}
          >
            <Stat icon={<BoltOutlinedIcon />} text="26+ Consulates" />
            <Stat icon={<PublicOutlinedIcon />} text="16 Countries" />
            <Stat icon={<ShieldOutlinedIcon />} text="20+ Years Experience" />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Stat ---------- */

function Stat({ icon, text }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box
        sx={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(255,255,255,0.2)",
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: "1.2rem", fontWeight: 600 }}>
        {text}
      </Typography>
    </Box>
  );
}
