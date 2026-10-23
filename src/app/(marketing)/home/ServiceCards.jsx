import { Box, Container, Grid, Typography } from "@mui/material";
import Image from "next/image";
// import SAPIcon from "@/components/icons/SAPIcon";

const logos = [
  { src: "/logos/Brainworx.webp", name: "Brainworx Infovision" },
  { src: "/logos/TT-Group.webp", name: "TT Group" },
  { src: "/logos/Spicejet.webp", name: "SpiceJet" },
  { src: "/logos/Aviation_thailand.webp", name: "Aviation Thailand" },
  { src: "/logos/VFSglobal.webp", name: "VFS Global" },
  { src: "/logos/NiumForex.webp", name: "Nium Forex" },
  { src: "/logos/BCS.webp", name: "BCS" },
  { src: "/logos/Asianet.webp", name: "Asianet" },
];

export default function ServiceCards() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container
        maxWidth="xl"
        sx={{
          py: { xs: 4, md: 8 },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          gutterBottom
          sx={{
            color: "#343434",
            fontSize: "36px",
            fontWeight: 600,
          }}
        >
          Trusted by Industry Leaders
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
          <img src="Gradient.webp" alt="" />
        </Box>

        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid
            container
            spacing={{ xs: 2, sm: 3, md: 4 }}
            justifyContent="center"
          >
            {logos.map((logo) => (
              <Grid item xs={6} sm={4} md={3} key={logo.src}>
                <Box
                  sx={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    height: 140,
                    width: { xs: 380, md: 280 },

                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",

                    padding: "11px 40px",

                    boxShadow: "0px 4px 20px -2px rgba(80, 20, 210, 0.1)",
                    transition: "all 0.3s ease",

                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0px 8px 28px -2px rgba(80, 20, 210, 0.18)",
                    },
                  }}
                >
                  <Image
                    src={logo.src}
                    alt={`${logo.name} — Triwinz client`}
                    width={200}
                    height={60}
                    style={{ objectFit: "contain" }}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
    </Box>
  );
}
