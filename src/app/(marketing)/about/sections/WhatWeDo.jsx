import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";

const items = [
  {
    title: "Secure Visa Processing Systems",
    text: `We helped one of India’s top airlines rethink employee engagement through gamified platforms. 
We’ve built secure visa processing systems like eVisa Suite, operated biometric enrollment across continents, 
and even managed a 30,000-person public event with real-time digital tracking.`,
  },
  {
    title: "ERP Platform tailored for Local Retailers",
    text: `We created DisBuddy, an ERP platform tailored for local retailers, helping them compete against 
eCommerce giants by giving them control over inventory, billing, and customer management — all through one 
simplified cloud platform.`,
  },
  {
    title: "Our Commitment that goes beyond Business",
    text: `We’ve developed a platform that ensures organic farmers in South India receive fair prices, 
directly connecting them to buyers and reducing dependency on middlemen. These aren’t just tech deployments — 
they’re tools of empowerment.`,
  },
];

export default function WhatWeDo() {
  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 12 },
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
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Box
            sx={{
              display: "inline-block",
              mb: 2,
              px: { xs: 2, sm: 2.5 },
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "#efe9ff",
              color: "#6d28d9",
              fontWeight: 800,
              fontSize: { xs: "0.7rem", sm: "0.9rem" },
            }}
          >
            Enterprise-Grade Technology For Everyone
          </Box>

          <Typography
            fontWeight={700}
            sx={{
              mb: 2,
              fontSize: { xs: "2rem", sm: "2.4rem", md: "3rem" },
            }}
          >
            What We Do
          </Typography>

          <Typography
            sx={{
              maxWidth: 950,
              mx: "auto",
              color: "#4b5563",
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1rem" },
              px: { xs: 1, sm: 0 },
              fontWeight: 600,
            }}
          >
            At the core of TriWinz is the drive to make enterprise-grade
            technology work for everyone. We are consultants, engineers,
            analysts, designers, and dreamers who develop solutions that cut
            across industries and sectors.
          </Typography>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 4, md: 6 },
            alignItems: "flex-start",
          }}
        >
          {/* Left – Text Cards */}
          <Box
            sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}
          >
            {items.map((item, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  gap: 2,
                  p: { xs: 2.5, md: 3 },
                  borderRadius: "8px",
                  borderLeft: "6px solid",
                  borderImage: "linear-gradient(#3D74FF, #FF4F81) 1",
                  backgroundColor: "#fff",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                }}
              >
                {/* Accent Bar */}
                <Box
                  sx={{
                    width: 4,
                    borderRadius: "4px",
                  }}
                />

                {/* Text */}
                <Box>
                  <Typography
                    component="div"
                    fontWeight={600}
                    sx={{
                      mb: 1,
                      color: "#111827",
                      fontSize: { xs: "1rem", md: "1.05rem" },
                      fontWeight: 700,
                    }}
                  >
                    {item.title}
                  </Typography>

                  <Typography
                    component="div"
                    sx={{
                      color: "#4b5563",
                      fontSize: { xs: "0.9rem", md: "0.95rem" },
                      fontWeight: 600,
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Right – Images */}
          <Box
            sx={{
              flex: 1,
              display: "flex",
              alignItems: "end",
              flexDirection: "column",
              gap: { xs: 2.5, md: 3 },
            }}
          >
            <Box
              sx={{
                borderRadius: { xs: "12px", md: "16px" },
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                // width: "100%",
              }}
            >
              <Image
                src="/about/2149241210-1.webp"
                alt="Team working together"
                width={500}
                height={400}
                style={{ borderRadius: "16px" }}
                // style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Box>

            <Box
              sx={{
                borderRadius: "16px",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="/about/3725-1.webp"
                alt="Business discussion"
                width={500}
                height={400}
                style={{ borderRadius: "16px" }}
                // style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
