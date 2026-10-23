import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  Chip,
} from "@mui/material";

import SaasModel from "../icons/SaasModel";
import PrivateCloudorOnPremise from "../icons/PrivateCloudorOnPremise";
import WhiteLabel from "../icons/WhiteLabel";

const deploymentOptions = [
  {
    title: "SaaS Model (Fully Managed)",
    description:
      "Go live within weeks with our fully managed cloud solution. No infrastructure management required.",
    icon: <SaasModel />,
    badge: "Fastest deployment",
    gradient: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
  },
  {
    title: "Private Cloud or On-Premise",
    description:
      "Complete data sovereignty with custom infrastructure deployment on your premises or private cloud.",
    icon: <PrivateCloudorOnPremise />,
    badge: "Maximum control",
    gradient: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
  },
  {
    title: "White-Label",
    description:
      "Your logo, your domain, your workflow. Fully customizable branded solution for your organization.",
    icon: <WhiteLabel />,
    badge: "Full customization",
    gradient: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
  },
];

export default function DeploymentOptionsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "#F1F2F480",
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
            sx={{ fontSize: { xs: 24, md: 48 } }}
            fontWeight={700}
            gutterBottom
          >
            Deployment Options
          </Typography>
          <Typography
            sx={{ fontSize: { xs: 16, md: 18 } }}
            color="text.secondary"
            fontWeight={600}
          >
            Choose the deployment model that best fits your requirements
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
          {deploymentOptions.map((item, index) => (
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
                display: "flex",
              }}
            >
              <Card
                sx={{
                  position: "relative",
                  flexGrow: 1,
                  borderRadius: "8px",
                  p: 3,
                  boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0px 16px 40px rgba(0,0,0,0.12)",
                  },
                }}
              >
                {/* Badge */}
                <Chip
                  label={item.badge}
                  size="small"
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    borderRadius: "0 8px 0 8px", // rectangle with one rounded corner
                    color: "#fff",
                    fontWeight: 600,
                    px: 1,
                    py: 1,
                    background: item.gradient,
                  }}
                />

                <CardContent>
                  {/* Icon */}
                  <Avatar
                    sx={{
                      mb: 2,
                      width: 56,
                      height: 56,
                      background: item.gradient,
                      color: "#fff",
                    }}
                  >
                    {item.icon}
                  </Avatar>

                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {item.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    fontWeight={600}
                  >
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
