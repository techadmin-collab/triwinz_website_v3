import Link from "next/link";
import { Box, Card, Chip, Typography, Stack } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { getWorkModeLabel } from "./workMode";
import { formatJobTypes } from "../../../../lib/jobTypes";

export default function JobCard({
  title,
  department,
  location,
  type,
  workMode,
  experience,
  joiningPeriod,
  summary,
  qualifications,
  slug,
}) {
  const qualificationItems = Array.isArray(qualifications)
    ? qualifications.filter(Boolean)
    : [];

  return (
    <Link
      href={`/careers/${slug}`}
      style={{
        textDecoration: "none",
        display: "block",
        height: "100%",
        width: "100%",
      }}
    >
      <Card
        sx={{
          p: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          overflow: "hidden",
          fontFamily: "montserrat, inter",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(80, 20, 210, 0.15)",
          },
        }}
      >
        <Box
          sx={{
            height: 8,
            flexShrink: 0,
            background: "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
          }}
        />

        <Box
          sx={{
            p: 3.5,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              label={department}
              size="small"
              sx={{
                backgroundColor: "grey.100",
                color: "grey.800",
                fontWeight: 500,
              }}
            />
            <Chip
              label={formatJobTypes(type)}
              size="small"
              sx={{
                backgroundColor: "rgba(80, 20, 210, 0.08)",
                color: "#5014d2",
                fontWeight: 500,
              }}
            />
            <Chip
              label={workMode || "Hybrid"}
              size="small"
              sx={{
                backgroundColor: "rgba(221, 60, 167, 0.08)",
                color: "#b02a86",
                fontWeight: 500,
              }}
            />
          </Stack>

          <Typography variant="h5" fontWeight={700}>
            {title}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            fontWeight={500}
            sx={{ lineHeight: 1.6, whiteSpace: "pre-line" }}
          >
            {summary}
          </Typography>

          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              minHeight: 0,
            }}
          >
            {qualificationItems.length > 0 ? (
              <Box>
                <Typography
                  variant="body2"
                  color="#4b5563"
                  fontWeight={600}
                  sx={{ lineHeight: 1.6, mb: 0.5 }}
                >
                  Qualifications and Certifications
                </Typography>
                <Stack spacing={0.5}>
                  {qualificationItems.map((item, index) => (
                    <Typography
                      key={`${index}-${item}`}
                      variant="body2"
                      color="text.secondary"
                      fontWeight={500}
                      sx={{ lineHeight: 1.6 }}
                    >
                      • {item}
                    </Typography>
                  ))}
                </Stack>
              </Box>
            ) : null}
          </Box>

          <Stack spacing={0.8} sx={{ color: "text.secondary" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <LocationOnOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" fontWeight={500}>
                {location}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <HomeWorkOutlinedIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" fontWeight={500}>
                {getWorkModeLabel(workMode)}
              </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <WorkOutlineIcon sx={{ fontSize: 18 }} />
              <Typography variant="body2" fontWeight={500}>
                {experience}
              </Typography>
            </Box>
            {joiningPeriod ? (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <EventAvailableOutlinedIcon sx={{ fontSize: 18 }} />
                <Typography variant="body2" fontWeight={500}>
                  Joining · {joiningPeriod}
                </Typography>
              </Box>
            ) : null}
          </Stack>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              pt: 1,
              borderTop: "1px solid",
              borderColor: "divider",
              color: "#5014d2",
              fontWeight: 600,
              fontSize: "0.9rem",
            }}
          >
            View role
            <ArrowForwardIcon sx={{ fontSize: 18 }} />
          </Box>
        </Box>
      </Card>
    </Link>
  );
}
