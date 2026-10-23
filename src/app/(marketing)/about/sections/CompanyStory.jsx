import { Box, Container, Typography, Grid } from "@mui/material";
import Image from "next/image";

export default function CompanyStory() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
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
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            gap: { xs: 6, md: 8 },
          }}
        >
          {/* Left Content */}
          <Box sx={{ flex: 1 }}>
            {/* Small pill */}
            <Box
              sx={{
                display: "inline-block",
                mb: { xs: 1.5, md: 2 },
                px: { xs: 2, md: 2.5 },
                py: 0.8,
                borderRadius: "999px",
                backgroundColor: "#efe9ff",
                color: "#6d28d9",
                fontWeight: 800,
                fontSize: { xs: "0.75rem", md: "0.85rem" },
              }}
            >
              The TriWinz Story
            </Box>

            {/* Heading */}
            <Typography
              fontWeight={700}
              sx={{
                mb: { xs: 2, md: 3 },
                fontSize: {
                  xs: "2rem", // mobile
                  sm: "2.5rem", // tablet
                  md: "3rem", // desktop (~48px)
                },
                lineHeight: 1.2,
                color: "#0F1729",
              }}
            >
              From Realization to Revolution
            </Typography>

            {/* Paragraph 1 */}
            <Typography
              sx={{
                mb: 3,
                color: "#374151",
                lineHeight: 1.75,
                fontSize: { xs: "0.95rem", md: "1rem" },
                fontWeight: 500,
              }}
            >
              It all started when our founders – professionals with deep
              experience in visa logistics, ERP systems, and government
              technology – kept encountering the same challenge in every
              project: amazing ideas were being held back by overly complex
              systems. Passionate entrepreneurs couldn’t scale because of
              unaffordable software. Government programs stalled because of
              disconnected platforms. And everyday users struggled with
              unintuitive, bloated systems.
            </Typography>

            {/* Paragraph 2 */}
            <Typography
              sx={{
                color: "#374151",
                lineHeight: 1.75,
                fontSize: { xs: "0.95rem", md: "1rem" },
                fontWeight: 500,
              }}
            >
              TriWinz was born to change that. We set out to design simple
              solutions to complex problems. Solutions that can be implemented,
              understood, and sustained by anyone – not just by the tech-savvy.
              Because for us,{" "}
              <Box
                component="span"
                sx={{
                  color: "#6d28d9",
                  fontWeight: 700,
                }}
              >
                technology only matters when it is used to improve lives.
              </Box>
            </Typography>
          </Box>

          {/* Right Image */}
          <Box
            sx={{
              flex: 1,
              width: "100%",
            }}
          >
            <Box
              sx={{
                position: "relative",
                borderRadius: { xs: "12px", md: "16px" },
                overflow: "hidden",
                boxShadow: "0 20px 50px rgba(0,0,0,0.12)",
              }}
            >
              <Image
                src="/about/TT Team - 034.webp"
                alt="TriWinz team collaboration"
                width={700}
                height={500}
                style={{
                  width: "100%",
                  height: "auto",
                  objectFit: "cover",
                }}
                priority
              />
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
