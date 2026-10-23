import { Box, Container, Typography, Button } from "@mui/material";
import Link from "next/link";

export default function FinalCTASection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        textAlign: "center",
        color: "#fff",
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
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
        {/* Heading */}
        <Typography
          fontWeight={800}
          gutterBottom
          sx={{
            fontSize: { xs: "1.8rem", sm: "2.2rem", md: "2.8rem" },
          }}
        >
          Ready to Take Control of Your Retail Business?
        </Typography>

        {/* Subtitle */}
        <Typography
          sx={{
            mb: 4,
            opacity: 0.95,
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            fontWeight: 600,
          }}
        >
          Join the league of retailers who’ve simplified their business with
          BisBuddy. Start your free demo today.
        </Typography>

        {/* CTA Button */}
        <Link href="/contact-us" style={{ textDecoration: "none" }}>
          <Button
            variant="outlined"
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 700,
              color: "#fff",
              borderColor: "#FFFFFF4D",
              backgroundColor: "#FFFFFF1A",
              "&:hover": {
                borderColor: "#fff",
                backgroundColor: "rgba(255,255,255,0.1)",
              },
            }}
          >
            Contact Us
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
