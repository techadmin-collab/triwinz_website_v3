import { Box, Container, Typography, Card } from "@mui/material";

import {
  MobilePhoneRetailersIcon,
  ElectronicsAppliancesIcon,
  FashionGarmentStoresIcon,
  SupermarketsGeneralStoresIcon,
  FranchiseOutletsAndChains,
  ServiceFocusedRetailersIcon,
} from "../icons/WhoUseBisBuddyIcons";

const users = [
  {
    title: "Mobile Phone Retailers",
    icon: <MobilePhoneRetailersIcon />,
  },
  {
    title: "Electronics & Appliances",
    icon: <ElectronicsAppliancesIcon />,
  },
  {
    title: "Fashion & Garment Stores",
    icon: <FashionGarmentStoresIcon />,
  },
  {
    title: "Supermarkets & General Stores",
    icon: <SupermarketsGeneralStoresIcon />,
  },
  {
    title: "Franchise Outlets & Chains",
    icon: <FranchiseOutletsAndChains />,
  },
  {
    title: "Service-focused Retailers",
    icon: <ServiceFocusedRetailersIcon />,
  },
];

export default function WhoCanUseBisBuddySection() {
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
            Who Can Use BisBuddy?
          </Typography>

          <Typography
            color="text.secondary"
            maxWidth={700}
            mx="auto"
            fontSize="1rem"
            fontWeight={600}
          >
            Built for every type of SME retailer across India
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
          {users.map((item, index) => (
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
                  flexGrow: 1,
                  p: 3,
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: "0px 4px 14px rgba(0,0,0,0.05)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0px 10px 30px rgba(0,0,0,0.1)",
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
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#fff",
                    background:
                      "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                  }}
                >
                  {item.icon}
                </Box>

                {/* Title */}
                <Typography fontWeight={600}>{item.title}</Typography>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
