import { Box, Container, Typography, Card } from "@mui/material";
import CheckIcon from "../../evisa-suite/icons/CheckIcon";

import {
  NoItExpertiseIcon,
  PurchaseAndVendorManagementIcon,
  SalesAndPOSBillingIcon,
  FinanceAndExpenseTrackingIcon,
  PostSalesServiceModuleIcon,
  RealTimeDashboardIcon,
} from "../icons/CoreERPIcons";

const modules = [
  {
    title: "No IT Expertise Needed",
    description:
      "Track stock in real time, manage multi-location inventory, set reorder levels, and avoid stockouts.",
    icon: <NoItExpertiseIcon />,
    features: [
      "Real-time stock tracking",
      "Multi-location inventory",
      "Automated reorder alerts",
    ],
  },
  {
    title: "Sales & POS Billing",
    description:
      "Fast and secure billing with barcode support, real-time tax calculations, and auto-discount application.",
    icon: <SalesAndPOSBillingIcon />,
    features: [
      "Barcode scanning support",
      "GST-enabled invoicing",
      "Multiple payment modes",
    ],
  },
  {
    title: "Purchase & Vendor Management",
    description:
      "Automate purchase orders, track inward goods, manage supplier credits, and generate GRNs seamlessly.",
    icon: <PurchaseAndVendorManagementIcon />,
    features: [
      "Automated purchase orders",
      "Supplier credit tracking",
      "GRN generation",
    ],
  },
  {
    title: "Finance & Expense Tracking",
    description:
      "Record and categorize daily expenses, track profit margins, and auto-generate sales summaries.",
    icon: <FinanceAndExpenseTrackingIcon />,
    features: [
      "Expense categorization",
      "Profit margin tracking",
      "Automated reports",
    ],
  },
  {
    title: "Post-Sales Service Module",
    description:
      "Manage customer complaints, service tickets, warranty claims, and automate AMC tracking.",
    icon: <PostSalesServiceModuleIcon />,
    features: [
      "Service ticket management",
      "Warranty claim tracking",
      "AMC automation",
    ],
  },
  {
    title: "Real-Time Dashboards & MIS",
    description:
      "Complete visibility into daily sales, cash flow, product performance, and dealer commissions.",
    icon: <RealTimeDashboardIcon />,
    features: [
      "Live sales dashboard",
      "Product performance analytics",
      "Drill-down reports",
    ],
  },
];

export default function CoreERPModulesSection() {
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
            Core ERP Modules
          </Typography>

          <Typography
            color="text.secondary"
            maxWidth={700}
            mx="auto"
            fontSize="1rem"
            fontWeight={600}
          >
            Everything you need to run your retail business efficiently — all
            integrated, all automated.
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
          {modules.map((module, index) => (
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
                  {module.icon}
                </Box>

                {/* Title */}
                <Typography fontWeight={700} mb={1}>
                  {module.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={2}
                  lineHeight={1.6}
                  fontWeight={600}
                >
                  {module.description}
                </Typography>

                {/* Feature List */}
                <Box component="ul" sx={{ p: 0, m: 0 }}>
                  {module.features.map((feature, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        listStyle: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 1,
                        fontSize: "0.9rem",
                        fontWeight: 600,
                        color: "text.secondary",
                      }}
                    >
                      <CheckIcon />
                      {feature}
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
