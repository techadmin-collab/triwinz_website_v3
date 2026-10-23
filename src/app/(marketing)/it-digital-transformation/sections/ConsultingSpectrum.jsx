import { Box, Container, Typography } from "@mui/material";
import { PointIcon } from "../icons/RightConsultingPartnerIcon";

const bulletStyle = {
  display: "flex",
  alignItems: "flex-start",
  gap: 1.2,
  mb: 1.4,
  fontSize: "0.95rem",
  fontWeight: 600,
  color: "#374151",
};

export default function ConsultingSpectrum() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 10 },
        fontFamily: "montserrat, inter",
      }}
    >
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 4, md: 8 },
          }}
        >
          {/* LEFT – Content */}
          <Box sx={{ flex: 1 }}>
            <Typography
              fontWeight={800}
              sx={{
                fontSize: { xs: "1.8rem", md: "2.4rem" },
                mb: 3,
              }}
            >
              Our Consulting Spectrum Includes:
            </Typography>

            {[
              "IT Modernization & Legacy System Overhaul",
              "Cloud Architecture & Cloud Migration",
              "Custom ERP & CRM Software Development",
              "Business Intelligence & Real-Time Analytics",
              "Workflow Automation & AI Integration",
              "Government IT Projects & eGovernance Solutions",
              "Custom Solutions for Visa, Insurance, HR, and Retail",
            ].map((item, index) => (
              <Box key={index} sx={bulletStyle}>
                <PointIcon />
                {item}
              </Box>
            ))}
          </Box>

          {/* RIGHT – Image */}
          <Box
            sx={{
              flex: 1,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: "0px 20px 40px rgba(0,0,0,0.15)",
            }}
          >
            <Box
              component="img"
              src="/it-digital-transformation/2149241213-1.webp"
              alt="Our Consulting Spectrum Includes"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
