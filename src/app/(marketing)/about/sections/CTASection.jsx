import { Box, Container, Typography, Button } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import Link from "next/link";

export default function CTASection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
        color: "#fff",
        fontFamily: "montserrat, inter",
        textAlign: "center",
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Typography
          variant="h3"
          fontWeight={700}
          sx={{
            mb: 2,
            fontSize: { xs: "2rem", md: "2.8rem" },
          }}
        >
          Ready to Transform Your Ideas?
        </Typography>

        {/* Description */}
        <Typography
          sx={{
            mx: "auto",
            mb: 5,
            fontSize: { xs: "1rem", md: "1.1rem" },
            lineHeight: 1.7,
            opacity: 0.95,
            fontWeight: 500,
          }}
        >
          Whether you’re exploring digital transformation, smarter
          infrastructure, or tailored IT strategies – our experts are here to
          help. Book a quick call and let’s build something great together.
        </Typography>

        {/* Buttons */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link href="/contact-us" style={{ textDecoration: "none" }}>
            <Button
              variant="outlined"
              startIcon={<PhoneIcon />}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "10px",
                borderColor: "#fff",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              Connect Us
            </Button>
          </Link>

          <Link
            href="mailto:corpconnect@triwinz.com"
            style={{ textDecoration: "none" }}
          >
            <Button
              variant="outlined"
              startIcon={<EmailIcon />}
              sx={{
                px: 4,
                py: 1.2,
                borderRadius: "10px",
                borderColor: "#fff",
                color: "#fff",
                fontWeight: 700,
                textTransform: "none",
                "&:hover": {
                  borderColor: "#fff",
                  backgroundColor: "rgba(255,255,255,0.1)",
                },
              }}
            >
              corpconnect@triwinz.com
            </Button>
          </Link>
        </Box>
      </Container>
    </Box>
  );
}
