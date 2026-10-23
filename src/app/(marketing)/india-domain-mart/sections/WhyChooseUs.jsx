import { Box, Container, Typography, Card } from "@mui/material";

// replace these with your actual SVG icon components
import NationalVisaSystems from "../../evisa-suite/icons/NationalVisaSystems";

const reasons = [
  {
    title: "Sister Concern of TriWinz Technologies",
    description:
      "Complete digitization of national-level visa processing infrastructure",
    icon: <NationalVisaSystems />,
  },
  {
    title: "End-to-End Web Infrastructure",
    description: "Domains to deployment, all in one place",
    icon: <NationalVisaSystems />,
  },
  {
    title: "Security & Compliance First",
    description: "Every service hardened and monitored",
    icon: <NationalVisaSystems />,
  },
  {
    title: "One-Stop for All Business Sizes",
    description: "Packages for startups to enterprises",
    icon: <NationalVisaSystems />,
  },
];

export default function WhyChooseUs() {
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
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Why Choose IndiaDomainMart
          </Typography>

          <Typography color="text.secondary" fontWeight={600}>
            Indian Roots, Global Standards – Local support with world-class
            service
          </Typography>
        </Box>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
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
                  textAlign: "center",
                  boxShadow: "0px 6px 20px rgba(0,0,0,0.06)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 14px 40px rgba(0,0,0,0.1)",
                    backgroundImage:
                      "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                    color: "#fff",
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
                    borderRadius: "50%",
                    backgroundColor: "#F2ECFF",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </Box>

                {/* Title */}
                <Typography fontWeight={700} mb={1}>
                  {item.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="inherit"
                  lineHeight={1.6}
                  fontWeight={500}
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
