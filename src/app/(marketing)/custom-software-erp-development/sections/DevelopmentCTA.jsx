import { Box, Typography, Button } from "@mui/material";
import {
  CallIcon,
  EmailIcon,
} from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import Link from "next/link";

export default function DevelopmentCTA() {
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
          maxWidth: "xl",
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
          Let’s Talk About Your Next Software Project
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            opacity: 0.95,
            maxWidth: 720,
            mb: 4,
            fontWeight: 500,
          }}
        >
          Whether you’re looking for a custom ERP system, an industry-specific
          solution, or a complete digital transformation, we’re ready to build
          it – your way.
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
                fontWeight: 600,
                textTransform: "none",
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.14)",
                backgroundImage: "none",
                backdropFilter: "blur(6px)",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
                mx: { xs: "auto", md: 0 },
                display: "inline-flex",
                // Icons have a built-in gradient stroke; force them white here
                "& .MuiButton-startIcon svg path": { stroke: "#fff" },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.24)",
                  backgroundImage: "none",
                  boxShadow: "0px 12px 32px rgba(0,0,0,0.25)",
                },
              }}
            >
              Book a Free Consultation or Demo
            </Button>
          </Link>

          {/* Email Button */}
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
                fontWeight: 600,
                textTransform: "none",
                color: "#fff",
                backgroundColor: "rgba(255,255,255,0.14)",
                backgroundImage: "none",
                backdropFilter: "blur(6px)",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
                mx: { xs: "auto", md: 0 },
                display: "inline-flex",
                // Icons have a built-in gradient stroke; force them white here
                "& .MuiButton-startIcon svg path": { stroke: "#fff" },
                "&:hover": {
                  backgroundColor: "rgba(255,255,255,0.24)",
                  backgroundImage: "none",
                  boxShadow: "0px 12px 32px rgba(0,0,0,0.25)",
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
