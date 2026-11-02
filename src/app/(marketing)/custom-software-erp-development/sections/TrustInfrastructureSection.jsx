import { Box, Typography } from "@mui/material";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import RocketLaunchOutlinedIcon from "@mui/icons-material/RocketLaunchOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";

const points = [
  {
    icon: <AccountTreeOutlinedIcon />,
    title: "ERP & Modular Expertise",
    text: "Proven expertise in ERP system design & modular software development",
  },
  {
    icon: <RocketLaunchOutlinedIcon />,
    title: "Agile Delivery",
    text: "Agile delivery powered by certified project managers and tech leads",
  },
  {
    icon: <DevicesOutlinedIcon />,
    title: "Every Platform",
    text: "Experience across platforms: web, mobile, cloud-native, API-driven",
  },
  {
    icon: <CodeOutlinedIcon />,
    title: "Full-Stack Mastery",
    text: "Mastery in front-end and back-end stacks including React, Angular, Node, Django, Laravel, .NET Core",
  },
  {
    icon: <StorageOutlinedIcon />,
    title: "Secure, Scalable Data",
    text: "Secure and scalable database architectures using PostgreSQL, MongoDB, Firebase, and SQL Server",
  },
  {
    icon: <HandshakeOutlinedIcon />,
    title: "Flexible Engagement",
    text: "Flexible engagement models: project-based, retainer, or offshore augmentation",
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
            Why Choose TriWinz?
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              lineHeight: 1.7,
              opacity: 0.92,
            }}
          >
            The expertise, delivery discipline and flexibility to build software
            that fits your business.
          </Typography>
        </Box>

        {/* Points */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" },
            gap: { xs: 2, md: 3 },
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
      </Box>
    </Box>
  );
}
