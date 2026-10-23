import { Box, Container, Typography } from "@mui/material";
import Image from "next/image";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

const items = [
  {
    title: "Win for the Client",
    image: "/about/3305-1-1.webp",
  },
  {
    title: "Win for the Team",
    image: "/about/1471-1.webp",
  },
  {
    title: "Win for the Community",
    image: "/about/2150950172-1.webp",
  },
];

export default function WhyTriWinz() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#faf9ff",
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
          fontWeight={700}
          textAlign="center"
          gutterBottom
          sx={{
            fontSize: { xs: "1.9rem", sm: "2.2rem", md: "3rem" },
          }}
        >
          Why the Name ‘TriWinz’?
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            color: "#6d28d9",
            mb: { xs: 4, md: 6 },
            fontWeight: 700,
            fontSize: { xs: "0.95rem", sm: "1rem" },
          }}
        >
          Our name reflects our core philosophy
        </Typography>

        {/* Cards */}
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: { xs: 3, md: 4 },
            justifyContent: "center",
            mb: { xs: 4, md: 6 },
          }}
        >
          {items.map((item, index) => (
            <Box
              key={index}
              sx={{
                flex: 1,
                maxWidth: { md: 360 },
                width: "100%",
                borderRadius: "16px",
                border: "1px solid #f0f0f0",
                boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
                p: 2,
                textAlign: "center",
              }}
            >
              <Typography
                component="div"
                sx={{
                  fontWeight: 700,
                  mb: 2,
                  fontSize: { xs: "1rem", sm: "1.15rem" },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background:
                      "linear-gradient(#fff, #fff) padding-box, linear-gradient(135deg, #6d28d9, #ec4899) border-box",
                    border: "2px solid transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <defs>
                      <linearGradient
                        id="checkGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="100%"
                      >
                        <stop offset="0%" stopColor="#6d28d9" />
                        <stop offset="100%" stopColor="#ec4899" />
                      </linearGradient>
                    </defs>

                    <path
                      d="M9.2 16.2L4.8 11.8L6.2 10.4L9.2 13.4L17.8 4.8L19.2 6.2L9.2 16.2Z"
                      fill="url(#checkGradient)"
                    />
                  </svg>
                </Box>

                {item.title}
              </Typography>

              <Box
                sx={{
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  width={400}
                  height={260}
                  style={{
                    width: "100%",
                    height: "auto",
                    display: "block",
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>

        {/* Bottom text */}
        <Typography
          textAlign="center"
          fontWeight={600}
          sx={{ mb: 2, fontSize: 24 }}
        >
          A true TriWin.
        </Typography>

        <Typography
          textAlign="center"
          sx={{
            maxWidth: 720,
            mx: "auto",
            color: "#494949",
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          We believe success should always be shared.
        </Typography>
        <Typography
          textAlign="center"
          sx={{
            maxWidth: 720,
            mx: "auto",
            color: "#494949",
            mt: 2,
            fontSize: 16,
            fontWeight: 500,
          }}
        >
          We don’t measure success by lines of code – we measure it by impact,
          clarity, and the positive ripple effects our work creates.
        </Typography>
      </Box>
    </Box>
  );
}
