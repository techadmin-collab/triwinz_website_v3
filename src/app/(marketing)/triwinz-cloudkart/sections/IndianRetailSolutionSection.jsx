import { Box, Container, Typography, Card } from "@mui/material";

import { SecurityIcon } from "../../evisa-suite/icons/SecurityIcon";
import {
  DedicateSupportIcon,
  QuickCommerceReadyIcon,
  CompleteDigitalTransformationIcon,
} from "../icons/IndianRetailSolutionIcons";

const solutions = [
  {
    title: "Complete Digital Transformation",
    description:
      "Complete digitization of national-level visa processing infrastructure.",
    icon: <CompleteDigitalTransformationIcon />,
  },
  {
    title: "Secure & Compliant",
    description: "Domains to deployment, all in one place",
    icon: <SecurityIcon />,
  },
  {
    title: "Quick Commerce Ready",
    description: "Every service hardened and monitored",
    icon: <QuickCommerceReadyIcon />,
  },
  {
    title: "Dedicated Support",
    description: "Packages for startups to enterprises",
    icon: <DedicateSupportIcon />,
  },
];

export default function IndianRetailSolutionSection() {
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
            sx={{ fontSize: { xs: "1.8rem", md: "2.8rem" } }}
            fontWeight={700}
            gutterBottom
          >
            A Solution That Understands Indian Retail
          </Typography>

          <Typography
            color="text.secondary"
            maxWidth={700}
            fontWeight={600}
            mx="auto"
          >
            Designed to address the unique challenges of Indian SMEs — low
            visibility, operational inefficiencies, and lack of access to
            technology
          </Typography>
        </Box>

        {/* Top Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            mb: { xs: 6, md: 8 },
          }}
        >
          {solutions.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  sm: "1 1 calc(50% - 32px)",
                  md: "1 1 calc(25% - 32px)",
                },
                maxWidth: {
                  xs: "100%",
                  sm: "calc(50% - 32px)",
                  md: "calc(25% - 32px)",
                },
                display: "flex",
              }}
            >
              <Card
                sx={{
                  flexGrow: 1,
                  p: 3,
                  textAlign: "center",
                  borderRadius: 3,
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 14px 40px rgba(0,0,0,0.1)",
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    mx: "auto",
                    mb: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography fontWeight={700} mb={1}>
                  {item.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.6}
                  fontWeight={600}
                >
                  {item.description}
                </Typography>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Bottom Gradient Banner */}
        <Box
          sx={{
            background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
            borderRadius: 4,
            py: { xs: 4, md: 5 },
            px: { xs: 3, md: 6 },
            textAlign: "center",
            color: "#fff",
          }}
        >
          <Typography
            fontWeight={800}
            gutterBottom
            sx={{ fontSize: { xs: "1.5rem", md: "2rem" } }}
          >
            Focus on Business — We Handle the Tech
          </Typography>

          <Typography
            sx={{
              opacity: 0.95,
              maxWidth: 700,
              mx: "auto",
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 600,
            }}
          >
            With TriWinz CloudKart, you don’t need an IT team to grow online.
            Our platform is intuitive, and our support team is always ready to
            assist you.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
