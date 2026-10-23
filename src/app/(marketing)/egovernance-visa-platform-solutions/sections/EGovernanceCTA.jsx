import { Box, Typography, Button } from "@mui/material";
import {
  CallIcon,
  EmailIcon,
} from "../../it-digital-transformation/icons/RightConsultingPartnerIcon";
import Link from "next/link";

const buttonStyles = {
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
};

export default function EGovernanceCTA() {
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
          Let’s Build the Future of Governance Together
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            opacity: 0.95,
            maxWidth: 720,
            mb: 4,
            lineHeight: 1.7,
            fontWeight: 500,
          }}
        >
          Whether you’re a ministry planning national eVisa adoption, a CSR body
          supporting digital education, or a local body aiming to go paperless –
          TriWinz is your transformation partner.
        </Typography>

        {/* CTA Buttons */}
        {/* FIRST ROW */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            justifyContent: "center",
          }}
        >
          {/* Contact Us */}
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

          {/* Email */}
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

        {/* SECOND ROW */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 4,
            mt: 4,
            justifyContent: "center",
          }}
        >
          {/* Emirati Visa */}
          <a
            href="https://www.emirativisa.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button
              // startIcon={<EmailIcon />}
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
                Live Platform: www.EmiratiVisa.com
              </Box>
            </Button>
          </a>

          {/* India Domain Mart */}
          <a
            href="https://www.indiadomainmart.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button
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
                Hosting Partner www.IndiaDomainMart.com
              </Box>
            </Button>
          </a>
        </Box>
        <Typography
          sx={{
            fontSize: { xs: "0.95rem", md: "1.05rem" },
            opacity: 0.95,
            maxWidth: 720,
            mt: 4,
            lineHeight: 1.7,
            fontWeight: 600,
          }}
        >
          Digitizing Governance. Scaling Citizenship. Connecting Nations.
        </Typography>
      </Box>
    </Box>
  );
}

const GradientText = ({ children }) => (
  <Box
    component="span"
    sx={{
      background: "linear-gradient(90deg, #3D74FF, #FF4F81)",
      backgroundClip: "text",
      WebkitBackgroundClip: "text",
      color: "transparent",
      fontWeight: 600,
    }}
  >
    {children}
  </Box>
);
