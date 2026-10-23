import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

import {
  DomainIcon,
  ProfessionalEmailIcon,
  VirtualMachinesAndServerDeploymentIcon,
  CloudHostingAndVPSSolutionsIcon,
  SSLCertificatesAndWebsiteSecurity,
  SaasApplicationHostingIcon,
} from "../icons/WhatWeOffer";
import CheckIcon from "../../evisa-suite/icons/CheckIcon";

const services = [
  {
    title: "Domain Registration",
    subtitle: "Secure your online identity with ease",
    icon: <DomainIcon />,
    items: [
      "Global and regional domain extensions (.com, .in, .co, .tech, etc.)",
      "Bulk registration and domain portfolio management",
      "DNS management and domain forwarding",
    ],
  },
  {
    title: "Professional Email Services",
    subtitle: "Build trust with branded business communication",
    icon: <ProfessionalEmailIcon />,
    items: [
      "Corporate email hosting (IMAP/POP3/Webmail)",
      "Email security and spam filtering",
      "Multi-user email admin panels",
      "Gsuite & Microsoft 365 setup and migration",
    ],
  },
  {
    title: "Virtual Machines & Server Deployment",
    subtitle: "On-demand computing made simple",
    icon: <VirtualMachinesAndServerDeploymentIcon />,
    items: [
      "Linux & Windows VMs with full root access",
      "Pre-configured server instances",
      "IP whitelisting, firewall setup, and monitoring",
    ],
  },
  {
    title: "Cloud Hosting & VPS Solutions",
    subtitle: "Fast, reliable, and scalable infrastructure",
    icon: <CloudHostingAndVPSSolutionsIcon />,
    items: [
      "Shared, VPS, and Dedicated Hosting",
      "Managed Cloud Hosting (AWS, Azure, GCP alternatives)",
      "Fully configured LAMP/LEMP stacks",
      "SSD storage, backups, and performance tuning",
    ],
  },
  {
    title: "SSL Certificates & Website Security",
    subtitle: "Keep your site and customer data safe",
    icon: <SSLCertificatesAndWebsiteSecurity />,
    items: [
      "Single, Multi-domain & Wildcard SSL certificates",
      "HTTPS-enabled site security",
      "Site seals, malware scans, and trust badges",
      "Fully managed installation and renewal",
    ],
  },
  {
    title: "SaaS & Application Hosting",
    subtitle: "Focus on your app, we manage the infra",
    icon: <SaasApplicationHostingIcon />,
    items: [
      "Dedicated SaaS hosting environments",
      "Load balancing, caching, and autoscaling",
      "CI/CD pipelines for modern DevOps-ready deployment",
    ],
  },
];

export default function WhatWeOfferSection() {
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
            variant="h4"
            fontWeight={700}
            gutterBottom
            fontSize={{ xs: "1.5rem", md: "3rem" }}
          >
            What We Offer
          </Typography>
          <Typography color="text.secondary" fontWeight={600} fontSize="1rem">
            Comprehensive web services to power your digital presence
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {services.map((service, index) => (
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
                display: "flex",
              }}
            >
              <Card
                sx={{
                  flexGrow: 1,
                  borderRadius: 3,
                  p: 3,
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 14px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                <CardContent>
                  {/* Icon */}
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      mb: 2,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#fff",
                      background: "linear-gradient(135deg, #6A6CF6, #FF4D94)",
                    }}
                  >
                    {service.icon}
                  </Box>

                  {/* Title */}
                  <Typography fontWeight={700} mb={0.5}>
                    {service.title}
                  </Typography>

                  {/* Subtitle */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    mb={2}
                    fontWeight={600}
                  >
                    {service.subtitle}
                  </Typography>

                  {/* Bullet points */}
                  <Box component="ul" sx={{ pl: 0, m: 0 }}>
                    {service.items.map((item, idx) => (
                      <Box
                        key={idx}
                        component="li"
                        sx={{
                          listStyle: "none",
                          display: "flex",
                          alignItems: "flex-start",
                          gap: 1,
                          mb: 1,
                          fontSize: "0.9rem",
                          color: "text.secondary",
                          fontWeight: 600,
                        }}
                      >
                        <Box>
                          <CheckIcon />
                        </Box>
                        {item}
                      </Box>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
