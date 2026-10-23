import { Box, Container, Typography } from "@mui/material";

const CheckIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="29"
    height="29"
    viewBox="0 0 29 29"
    fill="none"
  >
    <path
      d="M14.5001 26.5837C21.1736 26.5837 26.5834 21.1738 26.5834 14.5003C26.5834 7.82688 21.1736 2.41699 14.5001 2.41699C7.82667 2.41699 2.41678 7.82688 2.41678 14.5003C2.41678 21.1738 7.82667 26.5837 14.5001 26.5837Z"
      stroke="white"
      strokeWidth="2.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
    <path
      d="M10.875 14.4997L13.2917 16.9163L18.125 12.083"
      stroke="white"
      strokeWidth="2.41667"
      strokeLinecap="round"
      strokeLinejoin="round"
    ></path>
  </svg>
);

const points = [
  "Proven expertise in ERP system design & modular software development",
  "Agile delivery powered by certified project managers and tech leads",
  "Experience across platforms: web, mobile, cloud-native, API-driven",
  "Mastery in front-end and back-end stacks including React, Angular, Node, Django, Laravel, .NET Core",
  "Secure and scalable database architectures using PostgreSQL, MongoDB, Firebase, and SQL Server",
  "Flexible engagement models: project-based, retainer, or offshore augmentation",
];

export default function TrustInfrastructureSection() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 8 },
        background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
        color: "#fff",
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
        {/* Heading */}
        <Typography
          fontWeight={800}
          textAlign="center"
          sx={{
            fontSize: { xs: "1.8rem", md: "2.4rem" },
            mb: 2,
          }}
        >
          Why Choose TriWinz?
        </Typography>

        {/* Points */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 3,
            justifyContent: "center",
            mb: 6,
          }}
        >
          {points.map((text, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                px: 3,
                py: 1.6,
                borderRadius: 3,
                backgroundColor: "rgba(255,255,255,0.15)",
                backdropFilter: "blur(6px)",
                borderTop: "1px solid #fff",
                width: {
                  xs: "100%",
                  sm: "calc(50% - 12px)",
                },
              }}
            >
              <Box>
                <CheckIcon />
              </Box>
              <Typography sx={{ fontSize: "0.95rem", fontWeight: 500 }}>
                {text}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
