import { Box, Typography, Button } from "@mui/material";
import {
  CallIcon,
  EmailIcon,
} from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import Link from "next/link";

export default function SAPCTA() {
  return (
    <Box
      sx={{
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
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
          Let’s Talk SAP
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
          Ready to stabilize, optimize, or scale your SAP ecosystem?
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
                backgroundColor: "#fff",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
                mx: { xs: "auto", md: 0 },
                display: "inline-flex",
                "&:hover": {
                  backgroundColor: "#fff",
                  opacity: 0.95,
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: 600,
                }}
              >
                Book a Free Consultation or Demo
              </Box>
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
                fontWeight: 600,
                textTransform: "none",
                backgroundColor: "#fff",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.25)",
                mx: { xs: "auto", md: 0 },
                display: "inline-flex",
                "&:hover": {
                  backgroundColor: "#fff",
                  opacity: 0.95,
                },
              }}
            >
              <Box
                component="span"
                sx={{
                  background:
                    "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                  fontWeight: 600,
                }}
              >
                corpconnect@triwinz.com
              </Box>
            </Button>
          </a>
        </Box>
      </Box>
    </Box>
  );
}
