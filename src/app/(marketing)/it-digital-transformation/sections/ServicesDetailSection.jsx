"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { PointIcon } from "../icons/RightConsultingPartnerIcon";

export default function ServicesDetailSection() {
  return (
    <>
      <Box
        sx={{ py: 8, backgroundColor: "#fff", fontFamily: "montserrat, inter" }}
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
                Digital Strategy & Transformation Road mapping
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                We help businesses define a clear, measurable, and agile digital
                strategy aligned with their goals. Through audits, assessments,
                and stakeholder workshops, we identify inefficiencies,
                opportunities, and the right technologies to drive ROI.
              </Typography>

              <Typography fontWeight={600} mb={1.5}>
                Our roadmap focus on:
              </Typography>

              <Box>
                {[
                  "Process digitization",
                  "Data unification",
                  "Omnichannel experiences",
                  "Cost-effective cloud transitions",
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
                      fontWeight: 600,
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
                src="/it-digital-transformation/2150461326-1.webp"
                alt="Digital Strategy & Transformation Road mapping"
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
                src="/it-digital-transformation/Gemini_Generated_Image_9xt7jy9xt7jy9xt7-1.webp"
                alt="Enterprise Software & Platform Development"
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
                Enterprise Software & Platform Development
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  mb: 3,
                  fontWeight: 600,
                }}
              >
                TriWinz develops bespoke, scalable software platforms to address
                unique business challenges. We specialize in:
              </Typography>

              <Box>
                {[
                  "Custom ERP & CRM solutions",
                  "Insurance broking platforms",
                  "HRMS and workforce management",
                  "Visa and document processing systems",
                  "Real-time dashboards and analytics",
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
                      fontWeight: 600,
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
                  fontWeight: 600,
                }}
              >
                We leverage modern stacks (Node.js, React, Python, .NET, Java),
                scalable cloud architecture (AWS, Azure, GCP), and follow
                DevSecOps principles for security-first development.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{ py: 8, backgroundColor: "#fff", fontFamily: "montserrat, inter" }}
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
                Cloud, Infrastructure & Security Consulting
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  mb: 3,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                Our experts guide you through your cloud transformation journey
                – from architecture and vendor selection to migration,
                optimization, and governance. We ensure high availability, fault
                tolerance, and secure access.
              </Typography>

              <Typography fontWeight={600} mb={1.5}>
                Our offerings include:
              </Typography>

              <Box>
                {[
                  "Cloud-native development",
                  "Infrastructure as Code (IaC)",
                  "Hybrid cloud and containerization",
                  "Identity & access management",
                  "Cloud cost optimization",
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
                      fontWeight: 600,
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
                src="/it-digital-transformation/167050-1.webp"
                alt="Cloud, Infrastructure & Security Consulting"
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
                src="/it-digital-transformation/129780-1.webp"
                alt="Process Automation & AI-Enabled Workflows"
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
                Process Automation & AI-Enabled Workflows
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  mb: 3,
                  fontSize: "0.95rem",
                  fontWeight: 600,
                }}
              >
                We modernize operations using robotic process automation (RPA),
                AI-based decision systems, and rule-driven engines. Whether it’s
                invoice processing, appointment scheduling, or customer
                onboarding, we help you:
              </Typography>

              <Box>
                {[
                  "Reduce manual effort and errors",
                  "Speed up execution and reduce costs",
                  "Improve employee and customer satisfaction",
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
                      fontWeight: 600,
                    }}
                  >
                    <PointIcon />
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
