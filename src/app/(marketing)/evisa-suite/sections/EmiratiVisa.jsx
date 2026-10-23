import { Box, Container, Typography, Button } from "@mui/material";
import Image from "next/image";
import LaunchIcon from "@mui/icons-material/Launch";
import CheckIcon from "../icons/CheckIcon";

export default function EmiratiVisa() {
  return (
    <Box
      sx={{
        py: { xs: 8, md: 12 },
        backgroundColor: "#F8F9F9",
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
            gap: { xs: 6, md: 8 },
            alignItems: "center",
          }}
        >
          {/* LEFT CONTENT */}
          <Box sx={{ flex: 1 }}>
            {/* Pill */}
            <Box
              sx={{
                display: "inline-block",
                mb: 2,
                px: 2.5,
                py: 0.8,
                borderRadius: "999px",
                backgroundColor: "#EEF2FF",
                color: "#4F46E5",
                fontWeight: 700,
                fontSize: "0.95rem",
              }}
            >
              Real-World Implementation
            </Box>

            <Typography variant="h4" fontWeight={700} sx={{ mb: 2 }}>
              EmiratiVisa.com
            </Typography>

            <Typography
              sx={{
                color: "#4B5563",
                mb: 3,
                maxWidth: 520,
                fontWeight: 500,
              }}
            >
              <strong>EmiratiVisa.com</strong> is a live example of eVisa Suite
              in action. This streamlined platform enables Indian travelers to
              apply for UAE Tourist and Transit Visas completely online—with no
              paperwork, no agent visits, and zero hassles.
            </Typography>

            <Typography fontWeight={700} sx={{ mb: 2 }}>
              Why Use EmiratiVisa.com?
            </Typography>

            {/* Bullet points */}
            <Box
              component="ul"
              sx={{
                pl: 0,
                mb: 3,
                listStyle: "none",
              }}
            >
              {[
                "Easy-to-use Online Application Form",
                "WhatsApp and Email Status Alerts",
                "Fast Turnaround Time with Express Processing",
                "Safe Payments & Digital Receipts",
                "Transparent Pricing & Dedicated Support",
              ].map((text, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.2,
                    mb: 1.2,
                    color: "#374151",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                  }}
                >
                  <CheckIcon />
                  {text}
                </Box>
              ))}
            </Box>

            <Typography
              sx={{
                color: "#4B5563",
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 520,
                fontWeight: 500,
              }}
            >
              From solo travelers and families to business groups and event
              attendees, EmiratiVisa.com brings the UAE visa experience into the
              digital era—powered by TriWinz’s eVisa Suite.
            </Typography>

            <Button
              variant="contained"
              endIcon={<LaunchIcon />}
              sx={{
                textTransform: "none",
                borderRadius: "10px",
                px: 3,
                py: 1.4,
                background:
                  "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
              }}
              href="https://www.emirativisa.com"
              target="_blank"
            >
              Visit EmiratiVisa.com
            </Button>
          </Box>

          {/* RIGHT CARD */}
          <Box sx={{ flex: 1, width: "100%" }}>
            <Box
              sx={{
                borderRadius: "16px",
                border: "1px solid #E5E7EB",
                p: 2,
                boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
              }}
            >
              {/* Image */}
              <Box
                sx={{
                  position: "relative",
                  borderRadius: "12px",
                  overflow: "hidden",
                }}
              >
                <Image
                  src="/evisa-suite/Background.webp" // update path if needed
                  alt="EmiratiVisa"
                  width={600}
                  height={400}
                  style={{ width: "100%", height: "auto" }}
                />

                {/* Image caption */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    color: "#fff",
                  }}
                >
                  <Typography fontWeight={700}>EmiratiVisa.com</Typography>
                  <Typography variant="body2">
                    UAE Visa Processing Made Simple
                  </Typography>
                </Box>
              </Box>

              {/* Stats */}
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "", md: "repeat(3, 1fr)" },
                  gap: 2,
                  mt: 3,
                }}
              >
                <StatBox
                  title="24-48h"
                  sx={{ backgroundColor: "#F1F2F4" }}
                  subtitle="Processing Time"
                />

                <StatBox
                  title="100%"
                  sx={{ backgroundColor: "#F1F2F4" }}
                  subtitle="Digital Process"
                />
                <StatBox
                  title="24/7"
                  sx={{ backgroundColor: "#F1F2F4" }}
                  subtitle="Support Available"
                />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Helper ---------- */

function StatBox({ title, subtitle, sx }) {
  return (
    <Box
      sx={{
        backgroundColor: "#F9FAFB", // default
        borderRadius: "12px",
        textAlign: "center",
        py: 2,
        ...sx, // 👈 IMPORTANT: allow override
      }}
    >
      <Typography
        fontWeight={700}
        sx={{
          background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
        }}
      >
        {title}
      </Typography>
      <Typography variant="body2" color="#6B7280" fontWeight={600}>
        {subtitle}
      </Typography>
    </Box>
  );
}
