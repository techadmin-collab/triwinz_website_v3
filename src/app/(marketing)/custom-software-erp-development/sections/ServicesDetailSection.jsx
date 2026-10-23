"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { PointIcon } from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import TrustInfrastructureSection from "./TrustInfrastructureSection";
import KeyProjectHighlights from "./KeyProjectHighlights";

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
                Intelligent Software. Purpose - Built ERP.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Off-the-shelf software can limit your potential, but custom
                software lets you break through limitations and automate exactly
                what your business needs. Our ERP and software development
                offerings cover a wide spectrum – from modular tools to
                full-stack systems.
              </Typography>

              <Typography mb={1.5} sx={{ color: "#6B7280", fontWeight: 500 }}>
                Our expert team has delivered robust solutions for industries
                including retail, insurance, logistics, aviation, and public
                sector. Whether it’s inventory automation, financial
                reconciliation, field force management, or customer engagement –
                you envision, we build.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/cloud-and-web-infrastructure/104240-1.webp"
                alt="Intelligent Software. Purpose - Built ERP."
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
                src="/cloud-and-web-infrastructure/0ph3sv0p-1.webp"
                alt="Development Excellence: Process & People"
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
                Development Excellence: Process & People
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                At TriWinz, we follow an Agile development methodology supported
                by PMP-certified project managers, ensuring iterative delivery,
                adaptability to feedback, and clear communication at every
                stage.
              </Typography>

              <Typography
                sx={{
                  color: "#6B7280",
                  mb: 3,
                  fontWeight: 500,
                }}
              >
                Our team includes certified professionals in React.js, Node.js,
                Python, PHP, Java, .NET, and Flutter, with deep expertise in
                PostgreSQL, MySQL, MongoDB, Firebase, and MS SQL Server.
              </Typography>

              <Box>
                {[
                  "Business analysis and solution design",
                  "Wireframing and UI/UX prototyping",
                  "Integration with legacy and third-party systems",
                  "End-to-end manual and automated testing, including unit, regression, and UAT",
                  "Deployment on secure, scalable cloud environments",
                  "Ongoing monitoring and support with SLAs",
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1.2,
                      fontSize: "0.95rem",
                      fontWeight: 500,
                      color: "#4B5563",
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
                  fontWeight: 500,
                }}
              >
                Our quality assurance team ensures your application performs
                flawlessly, whether it’s a transactional ERP, a mobile-first
                app, or a browser-based dashboard for thousands of users.
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
                Seamless ERP Modules, Made for Growth
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Our ERP solutions are designed for modular implementation,
                giving you the freedom to add functionalities as your business
                evolves. Core modules include:
              </Typography>

              <Box>
                {[
                  "Sales, Purchase, and Inventory Management",
                  "Customer & Vendor Relationship Management",
                  "Finance, Billing & Automated GST Reports",
                  "Employee Engagement, Payroll & HRMS",
                  "After-Sales, Service, and Warranty Tracking",
                  "Custom Dashboards & Real-Time Reporting",
                  "Role-based Access, Workflow Automation, and Approvals",
                  "IoT, API, and Marketplace Integrations",
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

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                All components are built using latest technologies, supported by
                a centralized, optimized, and secure database layer that powers
                analytics, reporting, and compliance.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/cloud-and-web-infrastructure/8502-1.webp"
                alt="Seamless ERP Modules, Made for Growth"
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

      <KeyProjectHighlights />

      <TrustInfrastructureSection />

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
                src="/cloud-and-web-infrastructure/97922-1.webp"
                alt="Enterprise-Ready. Affordable for SMEs."
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
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" } }}
              >
                Enterprise-Ready.
              </Typography>
              <Typography
                fontWeight={700}
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 2 }}
              >
                Affordable for SMEs.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Unlike costly, rigid enterprise solutions, our systems are
                designed to be affordable, modular, and easy to use. We empower
                small and medium businesses with tools previously accessible
                only to large corporates. Your business deserves more than
                spreadsheets and legacy systems.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                With TriWinz, you build smart, scalable, and future-ready
                software that delivers measurable ROI.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
