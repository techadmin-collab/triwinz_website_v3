import { Box, Container, Typography, Button, Paper } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Link from "next/link";

export default function CallToActionSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
        color: "#fff",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="xl">
        {/* Text Content */}
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h3"
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "2rem", md: "2.75rem" },
            }}
          >
            Ready to Transform Visa Management?
          </Typography>

          <Typography
            sx={{
              opacity: 0.9,
              maxWidth: 720,
              mx: "auto",
              fontSize: { xs: "1rem", md: "1.1rem" },
              lineHeight: 1.7,
            }}
          >
            Whether you're digitizing a national visa system, launching a new
            embassy portal, or running a high-volume visa center, eVisa Suite
            offers the tools, security, and scalability to deliver a
            future-ready experience.
          </Typography>
        </Box>

        {/* CTA Card */}
        <Paper
          elevation={0}
          sx={{
            backgroundColor: "#fff",
            borderRadius: 4,
            p: { xs: 4, md: 5 },
            textAlign: "center",
            boxShadow: "0px 20px 50px rgba(0,0,0,0.15)",
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          <Typography variant="h6" fontWeight={700} mb={3} color="text.primary">
            Get Started Today
          </Typography>

          <Link
            href="/contact-us"
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Button
              size="large"
              startIcon={<MailOutlineIcon />}
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                color: "#fff",
                width: "100%",
                borderRadius: 2,
                textTransform: "none",
                background:
                  "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
                boxShadow: "0px 10px 30px rgba(0,0,0,0.2)",
                "&:hover": {
                  opacity: 0.9,
                  boxShadow: "0px 14px 40px rgba(0,0,0,0.25)",
                  transition: "all 0.3s ease-in-out",
                },
              }}
            >
              Request a Demo or Proposal
            </Button>
          </Link>
        </Paper>
      </Container>
    </Box>
  );
}
