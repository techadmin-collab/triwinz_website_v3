"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { PointIcon } from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import KeyProjectHighlights from "./KeyProjectHighlights";
import Link from "next/link";
import OurDevelopmentApproach from "./OurDevelopmentApproach";
import EGovernanceCTA from "./EGovernanceCTA";

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
                Transforming Visa Management with eVisa Suite
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Our flagship product,{" "}
                <Box
                  component={Link}
                  href="/evisa-suite"
                  sx={{
                    color: "#5014d2ff",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  eVisa Suite
                </Box>
                , is a next-generation visa processing software that streamlines
                every stage of the visa lifecycle—from applicant registration,
                biometric enrolment, and document upload to automated status
                tracking and seamless immigration integration.
              </Typography>
              <Box>
                {[
                  "Designed for governments, embassies, and consulates",
                  "Highly secure with TLS 1.3, E2E encryption, role-based access",
                  "Supports multi-currency payments and country-specific taxes",
                  "Multilingual portal and mobile app for global accessibility",
                  "Scalable SaaS, private cloud, or on-premise deployment",
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
                src="/egovernance-visa-platform-solutions/stkzsdstkzsdstkz-1.webp"
                alt="Transforming Visa Management with eVisa Suite"
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
                src="/egovernance-visa-platform-solutions/v9xdsfv9xdsfv9xd-1.webp"
                alt="Real-World Impact"
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
                Real-World Impact
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                <Box
                  component={Link}
                  href="/evisa-suite"
                  sx={{
                    color: "#5014d2ff",
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  EmiratiVisa.com
                </Box>
                - A complete online visa application portal for UAE visitors
                from India, powered by TriWinz eVisa Suite. It showcases
                real-time visa status, secure payments, group applications, and
                seamless customer experience from start to finish.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          backgroundColor: "#fff",
          py: 8,
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
                Digital Governance Beyond Borders
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Our expertise in eGovernance software development goes beyond
                visa systems. TriWinz has successfully supported major public
                and private digital initiatives that scale to lakhs of users
                while ensuring data security, uptime, and compliance.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/egovernance-visa-platform-solutions/tsxbkjtsxbkjtsxb-1.webp"
                alt="Digital Governance Beyond Borders"
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
                src="/egovernance-visa-platform-solutions/qr25ekqr25ekqr25-1.webp"
                alt="EdTech Platforms for Inclusive Learning"
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
                EdTech Platforms for Inclusive Learning
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                <Box
                  component="span"
                  sx={{
                    fontWeight: 600,
                    textDecoration: "none",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  TriWinz{" "}
                </Box>
                is proud to support India’s vision of Digital Education for All
                through a range of EdTech development services. From custom LMS
                platforms to analytics-backed learning dashboards, we empower
                educational institutions and skilling missions to scale
                digitally.
              </Typography>

              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  textDecoration: "none",
                  "&:hover": {
                    textDecoration: "underline",
                  },
                  color: "#6B7280",
                }}
              >
                Highlights:{" "}
              </Box>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Unlike costly, rigid enterprise solutions, our systems are
                designed to be affordable, modular, and easy to use. We empower
                small and medium businesses with tools previously accessible
                only to large corporates. Your business deserves more than
                spreadsheets and legacy systems.
              </Typography>

              <Box>
                {[
                  "Built skill development portals for state skill development missions and CSR bodies",
                  "Developed course delivery platforms with performance monitoring, certification, and automated grading",
                  "Provided end-to-end IT support for remote learning initiatives in rural and semi-urban areas",
                  "Created mobile-first microlearning solutions tailored for vocational skilling",
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
                    <Box>
                      <PointIcon />
                    </Box>
                    {item}
                  </Box>
                ))}
              </Box>

              <Typography sx={{ color: "#6B7280", fontWeight: 500, mt: 2 }}>
                With our EdTech solutions, government and CSR partners can reach
                underserved populations, improve learning outcomes, and monitor
                the real-time progress of students and institutions.
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
                IT Support for Community & Civic Projects
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Digital transformation is most impactful when it touches lives
                at the grassroots level. At TriWinz, we work hand-in-hand with
                NGOs, community leaders, and local government bodies to deliver
                cost-effective IT consulting and web infrastructure for:
              </Typography>

              <Box>
                {[
                  "Citizen service portals and grievance management systems",
                  "Local governance (panchayat and municipality) digital platforms",
                  "Telemedicine and public health registration systems",
                  "Volunteer and crowd-sourcing management portals",
                  "Awareness campaigns and digital helpline integration",
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
                Whether it’s for elections, religious events, or social outreach
                programs, our platforms ensure high availability, real-time
                analytics, and multi-user access, backed by secure cloud hosting
                through our partner brand IndiaDomainMart.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/egovernance-visa-platform-solutions/5vogzh5vogzh5vog-1.webp"
                alt="IT Support for Community & Civic Projects"
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

      <OurDevelopmentApproach />

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
                src="/egovernance-visa-platform-solutions/2149151163-1.webp"
                alt="Why Choose TriWinz for eGovernance & Public Sector Tech"
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
                sx={{ fontSize: { xs: "1.6rem", md: "2.1rem" }, mb: 4 }}
              >
                Why Choose TriWinz for eGovernance & Public Sector Tech
              </Typography>

              <Box>
                {[
                  "Over 20 years of domain expertise in public digital transformation",
                  "Proven experience with biometric systems, crowd management, and multilingual interfaces",
                  "Government-grade security and compliance (ISO, GDPR, Indian IT Act)",
                  "End-to-end services: Consulting, Development, Hosting, Training, and Support",
                  "Trusted technology partner for governments, embassies, NGOs, and PSUs",
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
                    <Box>
                      <PointIcon />
                    </Box>
                    {item}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <EGovernanceCTA />
    </>
  );
}
