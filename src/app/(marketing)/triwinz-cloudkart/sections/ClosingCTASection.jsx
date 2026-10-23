import { Box, Typography } from "@mui/material";

export default function ClosingCTASection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
        color: "#fff",
        textAlign: "center",
        fontFamily: "montserrat, inter",
        maxWidth: "100%",
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
        {/* Title */}

        <Box sx={{ textAlign: "center", maxWidth: "800px", mx: "auto" }}>
          <Typography
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
            }}
          >
            Get Started Today
          </Typography>

          {/* Paragraph 1 */}
          <Typography
            sx={{
              opacity: 0.95,
              mb: 2,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 600,
            }}
          >
            TriWinz CloudKart is more than a product — it’s a commitment to
            empower India’s small and medium businesses with modern commerce
            capabilities.
          </Typography>

          {/* Paragraph 2 */}
          <Typography
            sx={{
              opacity: 0.95,
              mb: 4,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 600,
            }}
          >
            If you're ready to take control of your customer relationships,
            expand beyond your physical store, and build a future-ready brand,
            TriWinz CloudKart is your next step forward.
          </Typography>

          {/* Tagline */}
          <Typography
            fontWeight={700}
            sx={{
              fontSize: { xs: "1.05rem", md: "1.2rem" },
            }}
          >
            Where Every Retailer Becomes a Digital Brand
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
