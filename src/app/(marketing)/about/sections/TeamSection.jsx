"use client";

import {
  Box,
  Container,
  Typography,
  Grid,
  Avatar,
  Stack,
  Link as MuiLink,
} from "@mui/material";
import { useState, useRef } from "react";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

/* ------------------ DATA ------------------ */

const teamMembers = [
  {
    name: "Rajkiran Sukumaran",
    role: "Founder & CEO",
    message: [
      "Rajkiran Sukumaran leads Triwinz’s strategy and mission-critical digital programs across visa, consular, immigration, and regulated government platforms. He has driven large-scale secure processing systems, cross-border service platforms, and embassy-aligned technology initiatives, working with airlines and institutional stakeholders.",
      "His portfolio includes enterprise modernization, SAP landscape stabilization, and high-visibility multi-agency program delivery. He founded Triwinz to build governance-driven, compliance-ready, and institution-grade digital platforms focused on reliability, scalability, and operational trust.",
    ],
    image: "/teams/triwinz_team_3.webp",
    linkedin: "https://www.linkedin.com/in/raj-kiran-pmp/",
  },
  {
    name: "Harikrishnan A S",
    role: "Vice President, Technology & Projects",
    message: [
      "Harikrishnan A S leads technology delivery and project execution across Triwinz platform and system initiatives. He oversees cross-functional engineering teams, structured delivery models, and execution governance across multiple programs. His focus includes delivery discipline, performance optimization, and engineering quality standards aligned with platform architecture goals.",
      "He works closely with leadership and solution teams to ensure delivery predictability, integration readiness, and operational stability across enterprise and regulated digital environments.",
    ],
    image: "/teams/triwinz_team_9.webp",
    linkedin: "https://www.linkedin.com/in/harikrishnan-a-s-qleap/",
  },
  {
    name: "Beneetta P B",
    role: "Senior Lead, Application Delivery (Python Platforms)",
    message: [
      "Beneetta P B leads Python platform delivery across backend systems, APIs, and database-driven applications at Triwinz. She focuses on scalable service architecture, secure backend workflows, and microservice-based platform design supporting transaction and process-heavy systems.",
      "She establishes backend delivery standards, supports performance and reliability improvements, and guides development teams across execution cycles. Her work emphasizes maintainability, security, and scalability across production digital platforms.",
    ],
    image: "/teams/triwinz_team_8.webp",
    linkedin: "https://www.linkedin.com/in/beneettapb/",
  },
  {
    name: "Venu Gopal Bandameedi",
    role: "Senior Architect, SAP Landscape & Migration",
    message: [
      "Venu Gopal Bandameedi leads SAP landscape and migration architecture programs supporting realization builds, cloud transitions, and platform transformations. He works on migration planning, environment structuring, BTP and RISE platforms, and technical integration models.",
      "His contributions include platform sizing, migration governance, and realization program support across complex SAP ecosystems, strengthening architecture-driven SAP transformation delivery.",
    ],
    image: "/teams/triwinz_team_11.webp",
  },
  {
    name: "Praveen Kumar A",
    role: "Senior Architect, SAP Basis Platforms",
    message: [
      "Praveen Kumar A leads SAP Basis platform architecture and technical operations across enterprise SAP landscapes. He focuses on platform lifecycle control, installation and upgrade programs, security configuration, and operational stability frameworks. His responsibilities include Solution Manager, Fiori, database platforms, and structured transport governance.",
      "He supports architecture-aligned Basis delivery and strengthens reliability across production SAP environments.",
    ],
    image: "/teams/triwinz_team_7.webp",
  },
  {
    name: "Meghana Reghunath Pillai",
    role: "UX & Interface Experience Specialist",
    message: [
      "Meghana Reghunath Pillai is a passionate UX specialist focused on intuitive, user-centered interface experiences across digital platforms. She works on improving interaction flows, usability clarity, and responsive interface behavior across applications. With a strong product mindset, she translates functional requirements into clean and accessible user journeys. ",
      "Her contributions support interface consistency, visual clarity, and experience refinement across platform environments.",
    ],
    image: "/teams/triwinz_team_5.webp",
    linkedin: "https://www.linkedin.com/in/meghna-reghunath-pillai-909b762a2/",
  },
  {
    name: "Abdul Samad N",
    role: "Senior Lead, Frontend Engineering (React Platforms)",
    message: [
      "Abdul Samad leads React-based frontend engineering and user interface delivery across Triwinz digital platforms. He translates functional workflows into scalable, component-driven interfaces integrated with secure backend services. His work emphasizes performance optimization, responsive behavior, and maintainable UI architecture.",
      "He supports frontend standards, developer mentoring, and cross-team delivery coordination, strengthening usability and experience quality across user-facing platform layers",
    ],
    image: "/teams/triwinz_team_2.webp",
    linkedin: "https://www.linkedin.com/in/abdul-samad-397364240/",
  },
  {
    name: "Ramesh Amala Sreenivasan",
    role: "Lead, Web Platforms & Infrastructure",
    message: [
      "Ramesh Amala Sreenivasan leads web platform and hosting infrastructure operations across Triwinz and client web environments. He oversees WordPress systems, domain and server platforms, and hosting continuity controls to ensure stable and secure web presence. His work focuses on uptime, configuration reliability, and operational resilience across digital properties.",
      "He is also deeply committed to animal welfare and rescue initiatives.",
    ],
    image: "/teams/triwinz_team_10.webp",
  },
  {
    name: "Swathy M S",
    role: "Manager, Programs & Client Operations",
    message: [
      "Swathy M S supports program execution and client operations across Triwinz initiatives, working closely with leadership, clients, and delivery teams. She coordinates stakeholder communications, delivery tracking, documentation workflows, and operational follow-ups across programs.",
      "Her role strengthens execution continuity and client engagement support while enabling structured coordination across multi-team initiatives and active delivery environments.",
    ],
    image: "/teams/triwinz_team_6.webp",
    linkedin: "https://www.linkedin.com/in/swathy-m-s-0714ab30a/",
  },
  {
    name: "Karthick V",
    role: "Senior Architect, SAP S/4HANA & Cloud Platforms",
    message: [
      "Karthick V leads SAP S/4HANA and cloud platform architecture initiatives across enterprise SAP environments at Triwinz. He supports landscape design, system conversions, cloud migrations, and resilient platform topologies. His work includes architecture planning, migration strategy, and technical optimization across core SAP systems and supporting platforms.",
      " He contributes to architecture-led delivery standards that strengthen cloud-aligned SAP platform execution.",
    ],
    image: "/teams/triwinz_team_1.webp",
  },
];

/* ------------------ COMPONENT ------------------ */

export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState(teamMembers[0]);
  const topSectionRef = useRef(null);

  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        // backgroundImage: "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
        color: "#000",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="lg">
        {/* ================= CEO MESSAGE ================= */}
        <Box
          ref={topSectionRef}
          sx={{
            display: "flex",
            scrollMarginTop: "100px",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
          }}
        >
          {/* Image */}
          <Box>
            <Box
              component="img"
              src={selectedMember.image}
              alt={selectedMember.name}
              sx={{
                minWidth: 320,
                height: 420, // 👈 fixed height
                borderRadius: 3,
                objectFit: "cover", // 👈 prevents stretching
                objectPosition: "center",
                transition: "transform 0.3s ease",
                cursor: "pointer",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            />
          </Box>
          {/* Text */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <Typography variant="h5" fontWeight={700} mb={2}>
              {selectedMember.role}
            </Typography>

            {selectedMember.message.map((para, index) => (
              <Typography
                key={index}
                sx={{ opacity: 0.9, lineHeight: 1.8, mb: 2 }}
              >
                {para}
              </Typography>
            ))}

            <Box>
              <Typography fontWeight={600} mt={3}>
                — {selectedMember.name}
              </Typography>

              <Typography sx={{ opacity: 0.7 }}>
                {selectedMember.role}
              </Typography>

              {/* <Stack direction="row" spacing={2} mt={1}> */}
              {/* <MuiLink href="#" underline="hover" color="primary">
                  <LinkedInIcon />
                </MuiLink> */}
              {/* <MuiLink href="#" underline="hover" color="primary">
                Instagram
              </MuiLink> */}
              {/* </Stack> */}
            </Box>
          </Box>
        </Box>

        {/* ================= TEAM ================= */}
        <Typography
          variant="h4"
          fontWeight={800}
          textAlign="center"
          my={1}
          mt={10}
        >
          Leadership & Core Delivery Team
        </Typography>

        <Box
          sx={{
            overflow: "hidden",
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        >
          <Grid
            container
            spacing={4}
            sx={{
              flexWrap: "nowrap", // 👈 force one row
              width: "max-content",
              animation: "scrollX 25s linear infinite",
              py: 4,
              "&:hover": {
                animationPlayState: "paused", // 👈 pause on hover (nice UX)
              },
            }}
          >
            {[...teamMembers, ...teamMembers].map((member, index) => (
              <Grid
                item
                key={index}
                onClick={() => {
                  setSelectedMember(member);

                  // smooth scroll to top section
                  topSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }}
                sx={{ cursor: "pointer" }}
              >
                <Box textAlign="center">
                  <Avatar
                    src={member.image}
                    alt={member.name}
                    sx={{
                      width: 200,
                      height: 280,
                      mx: "auto",
                      borderRadius: 2,
                      mb: 2,
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />

                  <Typography fontWeight={600}>{member.name}</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.7, width: 250 }}>
                    {member.role}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
