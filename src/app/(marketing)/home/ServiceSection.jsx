import { Box, Container, Grid, Typography } from "@mui/material";
import { services } from "./SvgIcons";

export default function ServicesSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#faf9ff",
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
            color: "#5014D2",
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
                    "linear-gradient(135deg, #FFFFFF 0%, #F8F6FE 100%)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transform: "translateY(0px)",
                  transition: "all 0.3s ease",

                  "&:hover": {
                    transform: "translateY(-6px)",
                    transition: "all 0.3s ease",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                    color: "#fff",
                    backgroundImage:
                      "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
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
                    background: "linear-gradient(135deg, #ede9fe, #f5f3ff)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#6d28d9",
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
