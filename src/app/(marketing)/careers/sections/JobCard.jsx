import Link from "next/link";
import { Box, Card, Chip, Typography } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatJobTypes } from "../../../../lib/jobTypes";

// Listing card: department label, job title, job type + work mode, and "View role".
// Full details (summary, qualifications, location...) are on the job page.
export default function JobCard({ title, department, type, workMode, slug }) {
  const chipSx = {
    bgcolor: "#fff",
    color: "#1D5758",
    fontWeight: 600,
    border: "1px solid rgba(29, 87, 88, 0.22)",
  };

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
        elevation={0}
        sx={{
          height: "100%",
          minHeight: 190,
          display: "flex",
          flexDirection: "column",
          px: { xs: 2.5, md: 3 },
          pt: { xs: 2.5, md: 3 },
          pb: { xs: 2, md: 2.5 },
          borderRadius: "14px",
          border: "1px solid #e3ecec",
          borderLeft: "5px solid #2BD1C7",
          bgcolor: "#fff",
          cursor: "pointer",
          fontFamily: "montserrat, inter",
          boxShadow: "0 4px 14px rgba(29, 87, 88, 0.05)",
          transition: "transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease",
          "&:hover": {
            transform: "translateY(-3px)",
            borderLeftColor: "#1D5758",
            boxShadow: "0 12px 28px rgba(29, 87, 88, 0.14)",
          },
          "&:hover .job-card-go": {
            backgroundImage: "linear-gradient(135deg, #1D5758 0%, #2BD1C7 100%)",
          },
          "&:hover .job-card-go svg": { transform: "translateX(2px)" },
        }}
      >
        {department ? (
          <Typography
            sx={{
              fontSize: "0.72rem",
              fontWeight: 800,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#1A9E96",
            }}
          >
            {department}
          </Typography>
        ) : null}

        <Typography
          component="h3"
          sx={{
            mt: 1,
            mb: 1.75,
            fontWeight: 800,
            fontSize: { xs: "1.15rem", md: "1.3rem" },
            lineHeight: 1.25,
            color: "#111",
            wordBreak: "break-word",
          }}
        >
          {title}
        </Typography>

        <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap" }}>
          <Chip label={formatJobTypes(type)} size="small" sx={chipSx} />
          <Chip label={workMode || "Hybrid"} size="small" sx={chipSx} />
        </Box>

        <Box
          sx={{
            mt: "auto",
            pt: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: "0.92rem", color: "#1D5758" }}>
            View role
          </Typography>
          <Box
            className="job-card-go"
            sx={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              color: "#fff",
              bgcolor: "#1D5758",
              transition: "background 0.3s ease",
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 18, transition: "transform 0.25s ease" }} />
          </Box>
        </Box>
      </Card>
    </Link>
  );
}
