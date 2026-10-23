import { Box, Container, Typography } from "@mui/material";
import FeatureCard from "../components/FeatureCard";
import LifecycleIcon from "../icons/LifecycleIcon";
import { SecurityIcon } from "../icons/SecurityIcon";
import { UsersIcon } from "../icons/UsersIcon";
import { AnalyticsIcon } from "../icons/AnalyticsIcon";
import { LockIcon } from "../icons/LockIcon";
import { GlobeIcon } from "../icons/GlobeIcon";
import { MobileIcon } from "../icons/MobileIcon";

const features = [
  {
    title: "End-to-End Visa Lifecycle Management",
    text: "From online applications to final visa issuance, every step is fully automated,configurable, and traceable.",
    icon: <LifecycleIcon />,
  },
  {
    title: "Secure & Compliant by Design",
    text: "TLS 1.3, End-to-End Encryption, Role-Based Access, IP Whitelisting, GDPR-Ready & ISO 27001-Aligned.",
    icon: <SecurityIcon />,
  },
  {
    title: "Seamless User & Partner Experience",
    text: "Multilingual portals, mobile apps (Android + iOS), real-time notifications, and group application workflows.",
    icon: <UsersIcon />,
  },
  {
    title: "Modular & Customizable Architecture",
    text: "Adapt the platform to your policies, visa types, and workflows no need to reinvent the wheel.",
    icon: <LifecycleIcon />,
  },
  {
    title: "Smart Automation & Reporting",
    text: "Dynamic visa forms, integrated payments, biometric deduplication, OCR scanning, and real-time dashboards.",
    icon: <AnalyticsIcon />,
  },
  {
    title: "VPS-Based Client Isolation",
    text: "Each deployment runs on isolated infrastructure ensuring maximum security and data sovereignty.",
    icon: <LockIcon />,
  },
  {
    title: "Multi-Language Support",
    text: "Built-in support for multiple languages to serve diverse applicant populations globally.",
    icon: <GlobeIcon />,
  },
  {
    title: "Mobile-First Design",
    text: "Native mobile apps and responsive web design ensure seamless experience across all devices.",
    icon: <MobileIcon />,
  },
];

export default function WhyEVisa() {
  return (
    <Box sx={{ py: { xs: 8, md: 12 }, fontFamily: "montserrat, inter" }}>
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
        <Typography
          fontWeight={700}
          // variant="h3"
          textAlign="center"
          sx={{ mb: 1, fontSize: { xs: 24, md: 48 } }}
        >
          Why eVisa Suite?
        </Typography>

        <Typography
          textAlign="center"
          sx={{ color: "#6b7280", mb: 6, fontWeight: 600 }}
        >
          Built by Experts. Designed for Governments. Trusted Globally.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: 4,
          }}
        >
          {features.map((item, i) => (
            <FeatureCard key={i} {...item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
