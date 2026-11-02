import { Box, Container, Typography } from "@mui/material";

export default function ProductHeroSection() {
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
  linear-gradient(122deg, #1D5758ff 0%, #2BD1C73d 100%),
  url("/triwinz-cloudkart/hncb-teal.webp")
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
            mt: { xs: 10, md: 0 },
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              mt: { xs: 0, md: 10 },
              mb: 2,
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: { xs: "0.7rem", sm: "0.85rem" },
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
            Where Every Retailer Becomes a Digital Brand
          </Box>

          {/* Product Title */}
          <Typography
            component={"h1"}
            fontWeight={800}
            gutterBottom
            sx={{
              fontSize: { xs: "2.2rem", sm: "2.8rem", md: "3.8rem" },
              lineHeight: 1.1,
            }}
          >
            TriWinz CloudKart
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
            Build Your Digital Storefront. Control Your Brand. Grow on Your
            Terms.
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              opacity: 0.85,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1rem" },
              fontWeight: 600,
            }}
          >
            A fully integrated, cloud-based eCommerce suite designed to help
            Indian businesses set up, operate, and grow a complete online store
            without relying on marketplaces or losing margin to intermediaries.
          </Typography>

        </Box>
      </Box>
    </Box>
  );
}
