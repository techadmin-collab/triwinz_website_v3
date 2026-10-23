import { Box, Container, Typography, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

export default function HeroSection() {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        py: { xs: 8, md: 0 },
        px: 2,
        position: "relative",
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        color: "#fff",
        backgroundImage: `
  linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),
  url("/india-domain-mart/gdb.webp")
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
            maxWidth: 720,
            textAlign: { xs: "left", md: "left" },
            mx: { xs: "auto", md: 0 },
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mt: { xs: 4, md: 10 },
              mb: 2,
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: { xs: "0.8rem", sm: "0.95rem" },
              fontWeight: 500,
              mx: { xs: "auto", md: 0 },
            }}
          >
            <Box
              component="img"
              src="/evisa-suite/shield.webp"
              alt=""
              sx={{ width: 16, height: 16, mr: 1 }}
            />
            A Sister Concern of TriWinz Technologies
          </Box>

          {/* Heading */}
          <Typography
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "1.9rem", sm: "2.4rem", md: "3.5rem" },
              lineHeight: 1.15,
            }}
          >
            Your Gateway to the Digital World
          </Typography>

          {/* Subheading */}
          <Typography
            sx={{
              mb: 2,
              opacity: 0.9,
              fontSize: { xs: "0.95rem", sm: "1.1rem", md: "1.25rem" },
              fontWeight: 600,
            }}
          >
            Web Services Made Simple, Secure, and Scalable
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              mb: 4,
              opacity: 0.85,
              fontSize: { xs: "0.9rem", md: "1rem" },
              fontWeight: 600,
            }}
          >
            IndiaDomainMart is an exclusive web services company and a proud
            sister concern of TriWinz Technologies, focused on delivering
            end-to-end digital infrastructure solutions for businesses of all
            sizes. Whether you're launching your first website, scaling up your
            cloud operations, or seeking enterprise-grade security and email
            services — IndiaDomainMart is your trusted partner for everything
            online. We believe every business deserves a robust digital
            foundation, and we're here to make that possible with reliable,
            affordable, and expertly managed web services.
          </Typography>

          <a
            href="https://www.indiadomainmart.com/"
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
                  transition: "all 0.3s ease-in-out",
                }}
              >
                Get Started Today
              </Box>
            </Button>
          </a>
        </Box>
      </Box>
    </Box>
  );
}
