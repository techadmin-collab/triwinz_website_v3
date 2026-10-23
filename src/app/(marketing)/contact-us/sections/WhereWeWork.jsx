"use client";

import { Box, Card, CardContent, Container, Typography } from "@mui/material";

import {
  EmailIcon,
  CallIcon,
  BuildingIcon,
  GlobeIcon,
  LocationIcon,
} from "../icons/ContactUsIcons";

const items = [
  {
    title: "India",
    desc: "Our core delivery and innovation hub",
    icon: <LocationIcon />,
  },
  {
    title: "USA",
    desc: "Strategic consulting and client engagement",
    icon: <GlobeIcon />,
  },
  {
    title: "United Kingdom & Europe",
    desc: "Project implementation, digital transformation & offshore delivery collaboration",
    icon: <GlobeIcon />,
  },
  {
    title: "Business Enquiries & Partnerships",
    desc: "corpconnect@triwinz.com",
    icon: <EmailIcon />,
    bold: true,
  },
  {
    title: "Product & Customer Support",
    desc: "reachus@triwinz.com",
    icon: <EmailIcon />,
    bold: true,
  },
  {
    title: "Give us a call",
    desc: "+91 814 829 3231",
    icon: <CallIcon />,
    bold: true,
  },
];

const addresses = [
  {
    title: "Chennai (Corporate Headquarters)",
    desc: `No 192, Old No 03
Sakthi Nagar Main Road,
Arumbakkam, Chennai, Tamil Nadu,
India, 600106.`,
  },
  {
    title: "Trivandrum (Delivery & Innovation Hub)",
    desc: `P131, Sasthamangalam,
Trivandrum,
Kerala, India - 695010.`,
  },
];

export default function WhereWeWork() {
  return (
    <Box sx={{ py: 10, fontFamily: "montserrat, inter" }}>
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 2 }}>
        {/* Heading */}
        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Typography fontWeight={800} sx={{ fontSize: "2.2rem", mb: 1 }}>
            Where We Work
          </Typography>
          <Typography color="#6B7280">
            TriWinz Technologies serves clients across geographies
          </Typography>
        </Box>

        {/* Top cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            mb: 6,
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 32px)",
                  md: "1 1 calc(33.333% - 32px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 32px)",
                  md: "calc(33.333% - 32px)",
                },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EEE",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {item.icon}
                  </Box>

                  <Typography fontWeight={600} mb={1}>
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#6B7280",
                      fontWeight: item.bold ? 600 : 400,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Address cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
          }}
        >
          {addresses.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  md: "1 1 calc(50% - 32px)",
                },
                maxWidth: {
                  xs: "100%",
                  md: "calc(50% - 32px)",
                },
              }}
            >
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  border: "1px solid #EEE",
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <BuildingIcon />
                  </Box>

                  <Typography fontWeight={600} mb={1}>
                    {item.title}
                  </Typography>

                  <Typography
                    sx={{
                      color: "#6B7280",
                      whiteSpace: "pre-line",
                      lineHeight: 1.6,
                    }}
                  >
                    {item.desc}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
