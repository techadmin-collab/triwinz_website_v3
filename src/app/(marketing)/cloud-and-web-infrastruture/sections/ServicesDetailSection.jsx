"use client";

import { Box, Container, Grid, Typography } from "@mui/material";
import { PointIcon } from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import TrustInfrastructureSection from "./TrustInfrastructureSection";

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
                A Complete Infrastructure Ecosystem
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Our web infrastructure service suite is built to support
                startups, SMEs, large enterprises, and government projects
                alike. Whether you’re deploying an eCommerce site, an ERP
                system, or a high-traffic customer portal, we ensure you stay
                online, protected, and competitive.
              </Typography>

              <Typography mb={1.5} sx={{ color: "#6B7280", fontWeight: 500 }}>
                We assist businesses in transitioning from legacy systems to
                modern, cloud-native platforms with zero downtime and full data
                integrity. Our solutions are backed by industry-leading
                providers such as AWS, Azure, and Google Cloud, along with our
                in-house expertise.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/cloud-and-web-infrastructure/104240-1.webp"
                alt="Digital Strategy"
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
                alt="Enterprise Software"
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
                Web Essentials - Done Right
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Your web identity begins with the basics – domain, email, and
                SSL. This is where our exclusive sister concern,
                IndiaDomainMart, comes into play. It acts as your dedicated
                digital storefront partner, providing:
              </Typography>

              <Box>
                {[
                  "Easy domain registration across popular and industry-specific extensions",
                  "Branded corporate email solutions with anti-spam and backup features",
                  "Secure, browser-trusted SSL certificates for customer trust and compliance",
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
                  fontWeight: 500,
                }}
              >
                We offer free domain and hosting for one year on select
                packages, making it easier for new businesses to get started
                with zero friction.
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
                Cloud Hosting That Scales With You
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                As your traffic grows, your infrastructure needs to keep pace.
                Our cloud hosting solutions are built to be elastic, fast, and
                cost-effective. We deploy virtual machines (VMs), containerized
                apps, and full-stack deployments across public, private, or
                hybrid clouds.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                With auto-scaling, high availability, and disaster recovery,
                you’re never caught off guard – even during peak demand.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/cloud-and-web-infrastructure/8502-1.webp"
                alt="Digital Strategy"
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
                src="/cloud-and-web-infrastructure/97922-1.webp"
                alt="Enterprise Software"
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
                Built-In Security & Compliance
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                We implement multi-layered web security architecture that
                includes firewalls, intrusion detection, and SSL encryption. Our
                systems follow ISO 27001, GDPR, and OWASP best practices to
                ensure your data and that of your customers is always protected.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Secure infrastructure isn’t optional—it’s your brand’s
                reputation at stake. That’s why every deployment is reviewed by
                certified cloud security professionals.
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
          {/* ===== Section 5 ===== */}
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
                Application Hosting & DevOps Integration
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                Whether you’re running an ERP backend, a customer portal, or a
                custom web app, our infrastructure solutions include fully
                managed application hosting environments, optimized for
                performance and uptime.
              </Typography>

              <Typography sx={{ color: "#6B7280", mb: 3, fontWeight: 500 }}>
                We support full DevOps automation using CI/CD pipelines,
                container orchestration, and infrastructure-as-code deployments
                for rapid updates and fewer errors.
              </Typography>
            </Box>

            {/* Image */}
            <Box sx={{ flex: 1 }}>
              <Box
                component="img"
                src="/cloud-and-web-infrastructure/y0aloy0aloy0al-1.webp"
                alt="Enterprise Software"
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
                src="/cloud-and-web-infrastructure/3667-1.webp"
                alt="Enterprise Software"
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
                Trusted by Industry Leaders
              </Typography>

              <Typography
                sx={{ color: "#6B7280", mb: 3, lineHeight: 1.7 }}
                fontWeight={600}
              >
                TriWinz has powered infrastructure for national and
                international clients, including:
              </Typography>

              <Box>
                {[
                  "Visa processing platforms for global embassies",
                  "ERP backends for retail and logistics companies",
                  "Secure data platforms for large-scale government events",
                  "Web ecosystems for insurance, aviation, and e-governance sectors",
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
                Our real-world deployment success includes managing high-volume
                web traffic, live streaming portals, appointment platforms, and
                high-security authentication systems.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </>
  );
}
