import { Box, Typography } from "@mui/material";
import SupportAgentOutlinedIcon from "@mui/icons-material/SupportAgentOutlined";
import SpeedOutlinedIcon from "@mui/icons-material/SpeedOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import HubOutlinedIcon from "@mui/icons-material/HubOutlined";

const points = [
  {
    icon: <SupportAgentOutlinedIcon />,
    title: "Fully Managed, 24/7",
    text: "End-to-end managed deployment with round-the-clock support",
  },
  {
    icon: <SpeedOutlinedIcon />,
    title: "Speed & Reliability",
    text: "Industry-grade speed, scalability, and reliability",
  },
  {
    icon: <TuneOutlinedIcon />,
    title: "Built for Your Sector",
    text: "Customized infrastructure tailored to specific sectors such as retail, logistics, insurance, and visa facilitation",
  },
  {
    icon: <HubOutlinedIcon />,
    title: "Seamless Integration",
    text: "Seamless integration with cloud-native and legacy applications",
  },
];

export default function TrustInfrastructureSection() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        overflow: "hidden",
        py: { xs: 8, md: 11 },
        background: "linear-gradient(122deg, #1D5758ff 0%, #2BD1C7ff 100%)",
        color: "#fff",
        fontFamily: "montserrat, inter",
        // Soft decorative glows
        "&::before, &::after": {
          content: '""',
          position: "absolute",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.08)",
          pointerEvents: "none",
        },
        "&::before": { width: 420, height: 420, top: -160, left: -140 },
        "&::after": { width: 360, height: 360, bottom: -150, right: -120 },
      }}
    >
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          mx: "auto",
          px: { xs: 2.5, sm: 4, md: 6 },
          maxWidth: { xs: "1250px", xl: "xl" },
        }}
      >
        {/* Heading */}
        <Box sx={{ textAlign: "center", maxWidth: 820, mx: "auto", mb: { xs: 5, md: 7 } }}>
          <Box
            sx={{
              display: "inline-block",
              px: 2,
              py: 0.6,
              mb: 2,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.16)",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Why TriWinz
          </Box>
          <Typography
            component="h2"
            sx={{
              fontWeight: 800,
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              lineHeight: 1.2,
              letterSpacing: "-0.01em",
              mb: 2,
            }}
          >
            Why Businesses Trust TriWinz Infrastructure
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              lineHeight: 1.7,
              opacity: 0.92,
            }}
          >
            We combine technical expertise with business understanding to deliver
            infrastructure that supports real-world performance. Our clients choose
            us for:
          </Typography>
        </Box>

        {/* Points */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" },
            gap: { xs: 2, md: 3 },
            mb: { xs: 5, md: 7 },
          }}
        >
          {points.map((item) => (
            <Box
              key={item.title}
              sx={{
                p: { xs: 2.5, md: 3 },
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                transition: "transform 0.3s ease, background-color 0.3s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  backgroundColor: "rgba(255,255,255,0.18)",
                },
              }}
            >
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  mb: 2,
                  borderRadius: 2,
                  display: "grid",
                  placeItems: "center",
                  backgroundColor: "#fff",
                  color: "#1D5758",
                  boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
                  "& svg": { fontSize: 26 },
                }}
              >
                {item.icon}
              </Box>
              <Typography
                component="h3"
                sx={{ fontWeight: 800, fontSize: "1.08rem", mb: 1, lineHeight: 1.3 }}
              >
                {item.title}
              </Typography>
              <Typography sx={{ fontSize: "0.92rem", lineHeight: 1.65, opacity: 0.9 }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Footer Text */}
        <Box
          sx={{
            maxWidth: 900,
            mx: "auto",
            px: { xs: 2.5, md: 4 },
            py: { xs: 2.5, md: 3 },
            borderRadius: 3,
            textAlign: "center",
            backgroundColor: "rgba(0,0,0,0.12)",
          }}
        >
          <Typography sx={{ fontSize: { xs: "0.95rem", md: "1.05rem" }, lineHeight: 1.7, fontWeight: 500 }}>
            From launching your website to managing massive cloud-based applications,
            TriWinz Technologies ensures you have the tools and technology to thrive in
            the digital era.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
