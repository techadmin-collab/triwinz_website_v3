import { Box, Container, Typography } from "@mui/material";

import {
  TechnologyForHumanImpactIcon,
  AgileByBelief,
  PeopleWithPurposeIcon,
} from "../../about/Icons/DiversityIcon";

/* Data */
const cultureItems = [
  {
    title: "People with Purpose",
    text: `We work with people who care about impact. Whether you're a client or a team member, we look for curiosity, humility, and purpose. We like collaborators who ask "why," who challenge assumptions, and who want their work to make a difference.`,
    icon: <PeopleWithPurposeIcon />,
  },
  {
    title: "Agile by Belief",
    text: `TriWinz operates on agile principles - not because it's a buzzword, but because we believe adaptability and collaboration are essential in a fast-changing world. Our teams are led by PMP-certified project managers, supported by experienced developers and testers, and fueled by a shared belief in continuous improvement.`,
    icon: <AgileByBelief />,
  },
  {
    title: "Technology for Human Impact",
    text: `We’re fluent in React, Node, .NET, Java, Python, and SAP, and skilled in cloud, DevOps, and database architecture. But tools don’t define us - our real strength is how we apply them to solve human problems. Because tech, unlike nuclear power, is meant to be used again and again - to build, to grow, to include. At TriWinz, we don’t obsess over dashboards unless they make life easier. We don’t create reports unless they drive action.
Our focus is on outcomes, adoption, and longevity.`,
    icon: <TechnologyForHumanImpactIcon />,
  },
];

export default function DevelopmentCulture() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
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
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Box
            sx={{
              display: "inline-block",
              mb: 2,
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "#efe9ff",
              color: "#6d28d9",
              fontWeight: 700,
              fontSize: "0.85rem",
            }}
          >
            Our Development Culture
          </Box>

          <Typography variant="h4" fontWeight={700} sx={{ color: "#111827" }}>
            People First, Tech Second
          </Typography>
        </Box>

        {/* Items */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          {cultureItems.map((item, index) => (
            <CultureItem
              key={index}
              title={item.title}
              text={item.text}
              icon={item.icon}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Single Item ---------- */

function CultureItem({ title, text, icon = "★" }) {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 3,
        p: { xs: 3, md: 4 },
        borderRadius: "14px",
        backgroundColor: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        alignItems: "flex-start",
      }}
    >
      {/* Icon */}
      <Box
        sx={{
          minWidth: 44,
          height: 44,
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 700,
          fontSize: "1rem",
        }}
      >
        {/* ★ */}
        {icon}
      </Box>

      {/* Content */}
      <Box>
        <Typography fontWeight={700} sx={{ mb: 1, color: "#111827" }}>
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#4b5563",
            // lineHeight: 1.7,
            fontSize: "0.95rem",
            fontWeight: 600,
          }}
        >
          {text}
        </Typography>
      </Box>
    </Box>
  );
}
