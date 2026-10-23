import { Box, Container, Typography, Card } from "@mui/material";

import LifecycleIcon from "../../evisa-suite/icons/LifecycleIcon";
import { SecurityIcon } from "../../evisa-suite/icons/SecurityIcon";
import { UsersIcon } from "../../evisa-suite/icons/UsersIcon";
import { AnalyticsIcon } from "../../evisa-suite/icons/AnalyticsIcon";
import { LockIcon } from "../../evisa-suite/icons/LockIcon";
import { GlobeIcon } from "../../evisa-suite/icons/GlobeIcon";
import { MobileIcon } from "../../evisa-suite/icons/MobileIcon";

const features = [
  {
    title: "End-to-End Visa Lifecycle Management",
    description:
      "From online applications to final visa issuance, every step is fully automated, configurable, and traceable.",
    icon: <LifecycleIcon />,
  },
  {
    title: "Secure & Compliant by Design",
    description:
      "TLS 1.3, End-to-End Encryption, Role-Based Access, IP Whitelisting, GDPR-Ready & ISO 27001-Aligned.",
    icon: <SecurityIcon />,
  },
  {
    title: "Seamless User & Partner Experience",
    description:
      "Multilingual portals, mobile apps (Android + iOS), real-time notifications, and group application workflows.",
    icon: <UsersIcon />,
  },
  {
    title: "Modular & Customizable Architecture",
    description:
      "Adapt the platform to your policies, visa types, and workflows—no need to reinvent the wheel.",
    icon: <LifecycleIcon />,
  },
  {
    title: "Smart Automation & Reporting",
    description:
      "Dynamic visa forms, integrated payments, biometric deduplication, OCR scanning, and real-time dashboards.",
    icon: <AnalyticsIcon />,
  },
  {
    title: "VPS-Based Client Isolation",
    description:
      "Each deployment runs on isolated infrastructure ensuring maximum security and data sovereignty.",
    icon: <LockIcon />,
  },
  {
    title: "Multi-Language Support",
    description:
      "Built-in support for multiple languages to serve diverse applicant populations globally.",
    icon: <GlobeIcon />,
  },
  {
    title: "Mobile-First Design",
    description:
      "Native mobile apps and responsive web design ensure seamless experience across all devices.",
    icon: <MobileIcon />,
  },
];

export default function KeyFeaturesSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
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
        <Box textAlign="center" mb={6}>
          <Typography
            sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" } }}
            fontWeight={700}
            gutterBottom
          >
            Key Features at a Glance
          </Typography>

          <Typography
            color="text.secondary"
            fontWeight={600}
            sx={{ fontSize: "1rem" }}
          >
            The platform comes packed with modules designed for usability,
            flexibility, and security
          </Typography>
        </Box>

        {/* Feature Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {features.map((feature, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 32px)",
                  md: "1 1 calc(25% - 32px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 32px)",
                  md: "calc(25% - 32px)",
                },
                display: "flex",
              }}
            >
              <Card
                sx={{
                  flexGrow: 1,
                  p: 3,
                  borderRadius: 3,
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 14px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    mb: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {feature.icon}
                </Box>

                {/* Title */}
                <Typography fontWeight={700} mb={1}>
                  {feature.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.6}
                  fontWeight={600}
                >
                  {feature.description}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
