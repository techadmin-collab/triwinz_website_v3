import { Box, Container, Typography, Card } from "@mui/material";

import { AgileIcon } from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import {
  CheckIcon,
  CrossIcon,
} from "../../triwinz-cloudkart/icons/IndianRetailSolutionIcons";

import {
  AllInOnePlatform,
  RackIcon,
} from "../../bisbuddy-erp/icons/BisBuddyIcons";
import { MobileIcon } from "../../evisa-suite/icons/MobileIcon";

const items = [
  {
    icon: <AgileIcon />,
    text: "Agile development with sprint based releases",
  },
  {
    icon: <CheckIcon />,
    text: "Rigorous QA, regression, and UAT testing",
  },
  {
    icon: <CrossIcon />,
    text: "Cross-platform proficiency: React JS, Node.js, .NET Core, Python, PHP",
  },
  {
    icon: <AllInOnePlatform />,
    text: "Database expertise: PostgreSQL, MySQL, MSSQL, MongoDB",
  },
  {
    icon: <MobileIcon />,
    text: "Mobile App Development: Native Android, iOS, React Native",
  },
  {
    icon: <RackIcon />,
    text: "Full CI/CD pipelines for version control and scalable deployments",
  },
];

export default function OurDevelopmentApproach() {
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
        {/* Heading */}
        <Typography
          textAlign="center"
          fontWeight={800}
          sx={{ fontSize: { xs: "1.8rem", md: "2.4rem" }, mb: 2 }}
        >
          Our Development Approach
        </Typography>

        {/* Subtitle */}
        <Typography
          textAlign="center"
          sx={{
            maxWidth: 900,
            mx: "auto",
            color: "#6B7280",
            lineHeight: 1.7,
            mb: 6,
            fontWeight: 500,
          }}
        >
          At the core of our delivery methodology lies agility, accountability,
          and excellence. Every project at TriWinz is led by PMP-certified
          project managers and executed by our in-house team of certified
          software engineers and system architects.
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 4,
            justifyContent: "center",
          }}
        >
          {items.map((item, index) => (
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
              }}
            >
              <Card
                elevation={0}
                sx={{
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  p: 3,
                  borderRadius: 3,
                  border: "1px solid #EEE",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0px 15px 40px rgba(0,0,0,0.08)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {item.icon}
                </Box>

                {/* Text */}
                <Typography
                  sx={{
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#111827",
                  }}
                >
                  {item.text}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Footer Text */}
        <Typography
          textAlign="center"
          sx={{
            mt: 6,
            color: "#6B7280",
            fontWeight: 600,
          }}
        >
          Our clients trust us because we build solutions that perform, scale,
          and evolve.
        </Typography>
      </Box>
    </Box>
  );
}
