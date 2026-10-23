import { Box, Container, Typography } from "@mui/material";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="40"
    height="40"
    viewBox="0 0 40 40"
    fill="none"
  >
    <rect
      width="40"
      height="40"
      rx="12"
      fill="#5014d2ff"
      fillOpacity="0.1"
    ></rect>
    <path
      d="M20 30C25.5228 30 30 25.5228 30 20C30 14.4772 25.5228 10 20 10C14.4772 10 10 14.4772 10 20C10 25.5228 14.4772 30 20 30Z"
      stroke="#5014d2ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M17 20L19 22L23 18"
      stroke="#5014d2ff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

const benefits = [
  {
    title: "Mobile Phone Retailers",
    description:
      "Tailored pricing for small businesses without enterprise costs",
  },
  {
    title: "Zero Tech Knowledge Required",
    description:
      "Easy onboarding with intuitive interface and dedicated support",
  },
  {
    title: "Scalable Operations",
    description: "Works for single stores or multi-location chains",
  },
  {
    title: "All-in-One System",
    description: "ERP, CRM, POS, and After-Sales unified in one platform",
  },
  {
    title: "Increased Profitability",
    description: "Reduces errors, saves time, and unlocks new revenue channels",
  },
  {
    title: "Compete with Online Platforms",
    description: "Go digital and match the efficiency of e-commerce giants",
  },
];

export default function KeyBenefitsSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        backgroundColor: "#fafafa",
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
            Key Benefits for SME Retailers
          </Typography>

          <Typography
            color="text.secondary"
            maxWidth={700}
            mx="auto"
            fontSize="1rem"
            fontWeight={600}
          >
            BisBuddy pays for itself with automation, analytics, and integrated
            commerce
          </Typography>
        </Box>

        {/* Benefits List */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
          }}
        >
          {benefits.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: {
                  xs: "1 1 100%",
                  md: "1 1 calc(50% - 24px)",
                },
                maxWidth: {
                  xs: "100%",
                  md: "calc(50% - 24px)",
                },
                backgroundColor: "#fff",
                borderRadius: 3,
                p: 3,
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                boxShadow: "0px 6px 20px rgba(0,0,0,0.05)",
              }}
            >
              {/* Icon */}
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <CheckIcon />
              </Box>

              {/* Text */}
              <Box>
                <Typography fontWeight={700} mb={0.5}>
                  {item.title}
                </Typography>

                <Typography color="text.secondary" fontWeight={500}>
                  {item.description}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
