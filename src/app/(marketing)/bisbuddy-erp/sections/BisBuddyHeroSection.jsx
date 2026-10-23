import { Box, Container, Typography, Button } from "@mui/material";
import { ERPIcon } from "../icons/BisBuddyIcons";

export default function BisBuddyHeroSection() {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        py: { xs: 8, md: 0 },
        px: 2,
        display: "flex",
        alignItems: "center",
        color: "#fff",
        position: "relative",
        backgroundImage: `
  linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),
  url("/bisbuddy-erp/fbfn.webp")
`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
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
        <Box
          sx={{
            maxWidth: 680,
            textAlign: { xs: "left", md: "left" },
            mx: { xs: "auto", md: 0 },
            mt: { xs: 10, md: 0 },
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mb: 2,
              px: 2.5,
              py: 0.7,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.18)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(8px)",
              fontSize: { xs: "0.7rem", sm: "0.85rem" },
              fontWeight: 500,
              mx: { xs: "auto", md: 0 },
            }}
          >
            <ERPIcon /> The Smart ERP for SME Retailers
          </Box>

          {/* Product Name */}
          <Typography
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "2.3rem", sm: "2.8rem", md: "3.8rem" },
              lineHeight: 1.1,
            }}
          >
            BisBuddy
          </Typography>

          {/* Tagline */}
          <Typography
            sx={{
              mb: 2,
              opacity: 0.95,
              fontSize: { xs: "1rem", md: "1.3rem" },
              fontWeight: 600,
            }}
          >
            Affordable. Intelligent. Made for India.
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              mb: 4,
              opacity: 0.85,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1rem" },
              fontWeight: 600,
            }}
          >
            Simplify, streamline, and scale with one powerful retail ERP. Unify
            your store operations from sales to inventory, billing to analytics.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
