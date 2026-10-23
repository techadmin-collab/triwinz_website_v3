"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { PointIcon } from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";

export default function ServicesDetailSection() {
  return (
    <>
      <Box
        sx={{
          py: 8,
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
          {/* ===== Section 1 ===== */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 4, md: 6 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 2 }}
              >
                SAP Technical & BASIS Audit
              </Typography>

              <Typography fontWeight={600} mb={1.5} sx={{ color: "#6B7280" }}>
                Proactive SAP management starts with clarity.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Our in-depth system audits and technical reviews identify
                configuration weaknesses, security vulnerabilities, performance
                issues, and outdated patches that can hinder yo ur operations.
                We assess your entire SAP landscape and deliver an actionable
                improvement plan, whether you’re on ECC, S/4HANA, or
                transitioning between the two.
              </Typography>

              <Typography fontWeight={600} mb={1.5}>
                Audit Deliverables Include:
              </Typography>

              <Box>
                {[
                  "Full system health check and performance benchmarks",
                  "Database tuning and workload optimization",
                  "OS and application patch reviews",
                  "SAP EarlyWatch-style reporting with TriWinz insights",
                  "Recommendations for stability, security, and scalability",
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                      fontSize: "0.95rem",
                      color: "#4B5563",
                      fontWeight: 500,
                    }}
                  >
                    <PointIcon />
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/sap-consulting-support-services/technical.webp"
                alt="SAP Technical & BASIS Audit"
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          py: 8,
          backgroundColor: "#F8F9F9",
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
          {/* ===== Section 2 ===== */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 4, md: 6 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/sap-consulting-support-services/resource.webp"
                alt="SAP Resource Augmentation"
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
              />
            </Box>

            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 2 }}
              >
                SAP Resource Augmentation
              </Typography>

              <Typography fontWeight={600} mb={1.5} sx={{ color: "#6B7280" }}>
                Expand your capabilities – without expanding your overhead.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Our SAP staffing solutions offer immediate access to certified,
                experienced professionals across functional, technical, and
                basis domains. Whether you need project-based support or a
                long-term extension of your team, we help you scale
                intelligently.
              </Typography>

              <Typography fontWeight={600} mb={1.5}>
                Key Competencies:
              </Typography>

              <Box>
                {[
                  "SAP BASIS & System Administration",
                  "S/4HANA Landscape Management & Administration",
                  "SAP Fiori Launchpad & App Administration",
                  "System Refresh Planning & Execution",
                  "SAP Cloud Connector, SSO & SSL Configuration",
                  "SAP Patch Management & Maintenance Activities",
                  "RISE with SAP Advisory & Support",
                  "L2/L3 Issue Resolution and Firefighting Expertise",
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                      fontSize: "0.95rem",
                      color: "#4B5563",
                      fontWeight: 500,
                    }}
                  >
                    <PointIcon />
                    {item}
                  </Box>
                ))}
              </Box>

              <Typography
                sx={{
                  mt: 3,
                  color: "#6B7280",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                }}
              >
                Each TriWinz consultant brings real-world project experience,
                deep technical acumen, and a mindset for proactive service –
                delivering outcomes, not just hours.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          py: 8,
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 4, md: 6 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 2 }}
              >
                SAP Incident Management & Firefighting
              </Typography>

              <Typography fontWeight={600} mb={1.5} sx={{ color: "#6B7280" }}>
                When things go wrong, we help you recover fast.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                SAP downtime is expensive and disruptive. Our team is trained to
                quickly assess, triage, and resolve critical issues – whether
                it’s a failed job, performance degradation, transport errors, or
                authorization problems. We combine sharp technical diagnosis
                with deep SAP domain knowledge to restore your operations
                without delay.
              </Typography>

              <Box>
                {[
                  "Full system health check and performance benchmarks",
                  "Database tuning and workload optimization",
                  "OS and application patch reviews",
                  "SAP EarlyWatch-style reporting with TriWinz insights",
                  "Recommendations for stability, security, and scalability",
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                      fontSize: "0.95rem",
                      color: "#4B5563",
                      fontWeight: 500,
                    }}
                  >
                    <PointIcon />
                    {item}
                  </Box>
                ))}
              </Box>

              <Typography sx={{ mb: 3, fontWeight: 500, color: "#6B7280" }}>
                We’ve supported mission-critical SAP systems for media, BFSI,
                public sector, and logistics firms where uptime is
                non-negotiable.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/sap-consulting-support-services/incidentmanagement.webp"
                alt="SAP Incident Management & Firefighting"
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
              />
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          py: 8,
          backgroundColor: "#F8F9F9",
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
          {/* ===== Section 4 ===== */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 4, md: 6 },
              flexDirection: { xs: "column", md: "row" },
            }}
          >
            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/sap-consulting-support-services/expert.webp"
                alt="Expert SAP Advisory & Consulting"
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
                }}
              />
            </Box>

            {/* Text */}
            <Box sx={{ flex: 1 }}>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 2 }}
              >
                Expert SAP Advisory & Consulting
              </Typography>

              <Typography fontWeight={600} mb={1.5} sx={{ color: "#6B7280" }}>
                Your SAP strategy should be aligned with your business strategy.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                From helping organizations assess S/4HANA readiness to designing
                efficient SAP Cloud or BTP architectures, TriWinz offers
                forward-looking consulting services that prepare you for what’s
                next.
              </Typography>

              <Typography sx={{ mb: 3, lineHeight: 1.7, fontWeight: 600 }}>
                Our Focus Areas Include:
              </Typography>

              <Box>
                {[
                  "S/4HANA Transition & Business Case Evaluation",
                  "SAP BTP Integration & Use Case Design",
                  "Cloud Hosting Strategies (AWS, Azure, GCP)",
                  "Licensing, Cost Optimization & Vendor Negotiation Support",
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                      fontSize: "0.95rem",
                      color: "#4B5563",
                      fontWeight: 500,
                    }}
                  >
                    <PointIcon />
                    {item}
                  </Box>
                ))}
              </Box>

              <Typography sx={{ mt: 3, fontWeight: 500, color: "#6B7280" }}>
                With a business-first mindset, our consultants ensure that your
                SAP roadmap is practical, scalable, and financially sound.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
