import { Box, Typography, Button } from "@mui/material";

export default function SAPHero() {
  return (
    <Box
      sx={{
        minHeight: { xs: "auto", md: "100vh", xl: "80vh" },
        display: "flex",
        alignItems: "center",
        alignContent: "center",
        p: 2,
        color: "#fff",
        backgroundImage:
          "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%), url('/sap-consulting-support-services/gbdb.webp')",
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
            display: "flex",
            flexDirection: "column",
            gap: 2.5,
            py: 5,
          }}
        >
          {/* Badge */}
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              width: "fit-content",
              px: 2.5,
              py: 0.8,
              borderRadius: "999px",
              backgroundColor: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(6px)",
              fontSize: "0.85rem",
              fontWeight: 500,
              mt: 10,
            }}
          >
            <Box
              component="img"
              src="/evisa-suite/shield.webp"
              alt=""
              sx={{ width: 16, height: 16, mr: 1 }}
            />{" "}
            We optimize, future-proof, and elevate SAP systems
          </Box>

          {/* Heading */}
          <Typography
            component={"h1"}
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.1,
            }}
          >
            Future-Ready SAP Solutions for Today’s Enterprises
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              opacity: 0.95,
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
            }}
          >
            With a strong foundation in enterprise technology and a deep
            understanding of SAP ecosystems, we offer a comprehensive suite of
            services to ensure that your SAP infrastructure not only runs
            smoothly, but also becomes a catalyst for growth, agility, and
            transformation.
          </Typography>

          <Typography
            sx={{
              opacity: 0.9,
              lineHeight: 1.7,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Whether you are looking to fine-tune your BASIS layer, prepare for
            S/4HANA migration, or need rapid issue resolution, TriWinz is your
            trusted partner with a track record of success across industries.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
