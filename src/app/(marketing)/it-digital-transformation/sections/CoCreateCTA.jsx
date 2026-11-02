import { Box, Typography, Button } from "@mui/material";
import { CallIcon, EmailIcon } from "../icons/RightConsultingPartnerIcon";
import Link from "next/link";

export default function CoCreateCTA() {
  return (
    <Box
      sx={{
        background: "linear-gradient(122deg, #1D5758ff 0%, #2BD1C7ff 100%)",
        py: { xs: 6, md: 10 },
        px: 2,
        color: "#fff",
        textAlign: "center",
        fontFamily: "montserrat, inter",
      }}
    >
      <Box
        sx={{
          mx: "auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {/* Heading */}
        <Typography
          fontWeight={800}
          sx={{
            fontSize: { xs: "1.8rem", md: "2.6rem" },
            mb: 2,
          }}
        >
          Let’s Co-Create Your Digital Future
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            opacity: 0.95,
            maxWidth: 720,
            mb: 4,
            fontWeight: 600,
          }}
        >
          Your business deserves a technology partner that’s as committed to
          growth as you are. Let’s talk about your digital goals — and how
          TriWinz can help you achieve them, faster and smarter.
        </Typography>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            justifyContent: "center",
          }}
        >
          <Link href="/contact-us" style={{ textDecoration: "none" }}>
            <Button
              startIcon={<CallIcon />}
              variant="contained"
              sx={{
                px: 4,
                py: 1.4,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                backgroundColor: "transparent",
                backgroundImage: "none",
                boxShadow: "none",
                mx: { xs: "auto", md: 0 },
                display: "inline-flex",
                // Icons have a built-in gradient stroke; force them white here
                "& .MuiButton-startIcon svg path": { stroke: "#fff" },
                "&:hover": {
                  backgroundColor: "transparent",
                  backgroundImage: "none",
                  boxShadow: "none",
                },
              }}
            >
              Book a Free Consultation or Demo
            </Button>
          </Link>

          <a
            href="mailto:corpconnect@triwinz.com"
            style={{ textDecoration: "none" }}
          >
            <Button
              startIcon={<EmailIcon />}
              variant="contained"
              sx={{
                px: 4,
                py: 1.4,
                borderRadius: 2,
                fontWeight: 700,
                textTransform: "none",
                color: "#fff",
                backgroundColor: "transparent",
                backgroundImage: "none",
                boxShadow: "none",
                mx: { xs: "auto", md: 0 },
                display: "inline-flex",
                // Icons have a built-in gradient stroke; force them white here
                "& .MuiButton-startIcon svg path": { stroke: "#fff" },
                "&:hover": {
                  backgroundColor: "transparent",
                  backgroundImage: "none",
                  boxShadow: "none",
                },
              }}
            >
              corpconnect@triwinz.com
            </Button>
          </a>
        </Box>
      </Box>
    </Box>
  );
}
