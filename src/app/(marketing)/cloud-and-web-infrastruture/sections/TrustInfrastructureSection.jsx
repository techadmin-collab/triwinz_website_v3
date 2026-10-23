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
  "End-to-end managed deployment with round-the-clock support",
  "Industry-grade speed, scalability, and reliability",
  "Customized infrastructure tailored to specific sectors such as retail, logistics, insurance, and visa facilitation",
  "Seamless integration with cloud-native and legacy applications",
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
          Why Businesses Trust TriWinz Infrastructure?
        </Typography>

        {/* Subtitle */}
        <Typography
          textAlign="center"
          sx={{
            maxWidth: 800,
            mx: "auto",
            mb: 6,
            opacity: 0.95,
            fontWeight: 500,
          }}
        >
          We combine technical expertise with business understanding to deliver
          infrastructure that supports real-world performance.
          <br />
          <strong>Our clients choose us for:</strong>
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
                // maxWidth: {
                //   xs: "100%",
                //   sm: "calc(50% - 12px)",
                // },
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

        {/* Footer Text */}
        <Typography
          textAlign="center"
          sx={{
            maxWidth: 900,
            mx: "auto",
            opacity: 0.95,
            fontWeight: 500,
          }}
        >
          From launching your website to managing massive cloud-based
          applications, TriWinz Technologies ensures you have the tools and
          technology to thrive in the digital era.
        </Typography>
      </Box>
    </Box>
  );
}
