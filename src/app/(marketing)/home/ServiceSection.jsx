import { Box, Container, Grid, Typography } from "@mui/material";
import { services } from "./SvgIcons";

export default function ServicesSection() {
  return (
    <Box
      sx={{
        // Section icons come from a shared file with a purple-pink gradient; recolour here only
        "& stop[stop-color='#5014d2ff']": { stopColor: "#1D5758" },
        "& stop[stop-color='#dd3ca7fd']": { stopColor: "#2BD1C7" },
        py: { xs: 8, md: 12 },
        backgroundColor: "#F5FCFB",
        minHeight: "100vh",
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="xl">
        {/* Heading */}
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{
            color: "#343434",
            fontSize: { md: "40px", xs: "28px" },
          }}
        >
          Empower Your Business with Smart IT Services
        </Typography>

        <Typography
          textAlign="center"
          gutterBottom
          sx={{
            color: "#1D5758",
            fontSize: "20px",
            fontWeight: 700,
          }}
        >
          Future-Ready Solutions Tailored for Growth
        </Typography>

        <Typography
          variant="body1"
          textAlign="center"
          sx={{
            maxWidth: 720,
            mx: "auto",
            color: "#6b7280",
            mb: 6,
            fontWeight: 500,
          }}
        >
          "Optimize operations, scale effortlessly, and unlock intelligence with
          our expert-led services from cloud to AI, SAP, and beyond."
        </Typography>

        {/* Cards */}
        <Grid container spacing={4} justifyContent="center">
          {services.map((service, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box
                sx={{
                  height: "100%",
                  width: "385px",
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "transparent",
                  backgroundImage:
                    "linear-gradient(135deg, #FFFFFF 0%, #F3FBFA 100%)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transform: "translateY(0px)",
                  position: "relative",
                  isolation: "isolate", // keeps the gradient layer behind the content
                  overflow: "hidden",
                  // Same timing in and out, so nothing snaps back
                  transition:
                    "transform 0.4s ease, box-shadow 0.4s ease, color 0.4s ease",

                  // Teal gradient layer that fades in on hover
                  // (switching between two background gradients can't animate)
                  "&::before": {
                    content: '""',
                    position: "absolute",
                    inset: 0,
                    zIndex: -1,
                    borderRadius: "inherit",
                    backgroundImage:
                      "linear-gradient(122deg, #1D5758 0%, #2BD1C7 100%)",
                    opacity: 0,
                    transition: "opacity 0.4s ease",
                  },

                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    color: "#fff",
                  },
                  "&:hover::before": {
                    opacity: 1,
                  },
                }}
              >
                {/* Icon */}
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    p: 0.8,
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #D9F4F2, #EEFAF9)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#1D5758",
                    mb: 2,
                  }}
                >
                  {service.icon}
                </Box>

                {/* Title */}
                <Typography
                  variant="subtitle1"
                  fontWeight={700}
                  sx={{ fontSize: "18px" }}
                  gutterBottom
                >
                  {service.title}
                </Typography>

                {/* Description */}
                <Typography
                  variant="body2"
                  sx={{
                    // color: "#6b7280",
                    // ":hover": { color: "#fff", transition: "all 0.3s ease" },
                    lineHeight: 1.6,
                    fontWeight: 500,
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
