import { Box, Container, Typography, Card } from "@mui/material";
import {
  NoItExpertiseIcon,
  AllInOnePlatform,
  RealTimeInsights,
  GSTCompliantIcon,
} from "../icons/BisBuddyIcons";

const reasons = [
  {
    title: "No IT Expertise Needed",
    description:
      "Intuitive interface designed for retailers, not tech experts. Get started in minutes.",
    icon: <NoItExpertiseIcon />,
  },
  {
    title: "All-in-One Platform",
    description:
      "Manage inventory, billing, accounting, service, and analytics from a single dashboard.",
    icon: <AllInOnePlatform />,
  },
  {
    title: "Real-Time Insights",
    description:
      "Make smarter decisions with live dashboards showing sales, margins, and performance.",
    icon: <RealTimeInsights />,
  },
  {
    title: "GST Compliant",
    description:
      "Built-in GST support with auto-generated tax invoices and simplified filing.",
    icon: <GSTCompliantIcon />,
  },
];

export default function WhyBisBuddySection() {
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
            Why BisBuddy is a Game-Changer
          </Typography>

          <Typography
            color="text.secondary"
            maxWidth={700}
            mx="auto"
            fontSize="1rem"
            fontWeight={600}
          >
            Unlike generic ERP platforms, BisBuddy is pre-configured for retail
            and tailor-made for Indian markets. Intuitive, fast to deploy, and
            requires no IT expertise.
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
          {reasons.map((item, index) => (
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
                    width: 48,
                    height: 48,
                    mb: 2,
                    borderRadius: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                {/* Title */}
                <Typography fontWeight={700} mb={1} fontSize="1rem">
                  {item.title}
                </Typography>

                {/* Description */}
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
      </Box>
    </Box>
  );
}
