import { Box, Container, Typography, Card } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";

const pricingPlans = [
  {
    name: "Free",
    highlight: "Free",
    title: "Domain + Hosting for the first year",
    subtitle: "Select packages",
    features: [
      "Free .in or .com domain",
      "Free hosting for 1 year",
      "Free SSL certificate",
      "Free payment gateway setup",
      "Free onboarding assistance",
    ],
  },
  {
    name: "Custom",
    highlight: "Custom",
    title: "Packages for agencies, resellers",
    subtitle: "Multi-site operators",
    features: [
      "Everything in Free",
      "Bulk discount pricing",
      "White-label options",
      "Priority support",
      "Custom integrations",
    ],
  },
  {
    name: "24/7",
    highlight: "24/7",
    title: "Packages for agencies, resellers",
    subtitle: "Multi-site operators",
    features: [
      "Everything in Custom",
      "24/7 dedicated support",
      "Advanced analytics",
      "Custom development",
      "SLA guarantees",
    ],
  },
];

export default function PricingSpecialOffers() {
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
            Pricing & Special Offers
          </Typography>

          <Typography
            color="text.secondary"
            maxWidth={700}
            fontWeight={600}
            mx="auto"
          >
            To support India’s growing digital commerce movement, we’re offering
            a limited-time launch package
          </Typography>
        </Box>

        {/* Pricing Cards */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: 4,
            mb: 6,
          }}
        >
          {pricingPlans.map((plan, index) => (
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
                borderRadius: 3,

                // reserve space
                border: "1px solid transparent",

                transition: "border-color 0.3s ease-in-out",

                "&:hover": {
                  borderColor: "#7C3BED",
                },
              }}
            >
              <Card
                sx={{
                  flexGrow: 1,
                  p: 4,
                  borderRadius: 3,
                  textAlign: "center",
                  boxShadow: "0px 8px 30px rgba(0,0,0,0.08)",
                }}
              >
                {/* Highlight */}
                <Typography
                  fontWeight={800}
                  sx={{
                    mb: 2,
                    fontSize: "1.6rem",
                    background:
                      "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                    // backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  {plan.highlight}
                </Typography>

                {/* Title */}
                <Typography fontWeight={700}>{plan.title}</Typography>

                {/* Subtitle */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  mb={3}
                  fontWeight={600}
                >
                  {plan.subtitle}
                </Typography>

                {/* Features */}
                <Box
                  component="ul"
                  sx={{
                    p: 0,
                    m: 0,
                    textAlign: "left",
                  }}
                >
                  {plan.features.map((feature, idx) => (
                    <Box
                      component="li"
                      key={idx}
                      sx={{
                        listStyle: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: 1.2,
                        mb: 1.5,
                        fontSize: "0.95rem",
                        fontWeight: 600,
                      }}
                    >
                      <CheckIcon
                        sx={{
                          fontSize: 18,
                          color: "#5014d2ff",
                        }}
                      />
                      {feature}
                    </Box>
                  ))}
                </Box>
              </Card>
            </Box>
          ))}
        </Box>

        {/* Footer Note */}
        <Typography
          textAlign="center"
          color="text.secondary"
          fontSize="1rem"
          fontWeight={600}
        >
          <strong fontWeight={700}>No hidden costs. No commissions.</strong> You
          own your platform entirely — brand, data, and customers included.
        </Typography>
      </Box>
    </Box>
  );
}
