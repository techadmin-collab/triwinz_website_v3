import Link from "next/link";
import { Card, Typography, Box, Chip } from "@mui/material";

const CaseStudyCard = ({ client, industry, summary, result, slug }) => {
  return (
    <Link
      href={`/case-studies/${slug}`}
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
          minHeight: { xs: 320, lg: 350 },
          display: "flex",
          flexDirection: "column",
          cursor: "pointer",
          overflow: "hidden",
          position: "relative",
          "&:hover": {
            transform: "scale(1.02)",
            transition: "transform 0.3s ease",
          },
          fontFamily: "montserrat, inter",
        }}
      >
        <Box
          sx={{
            height: 8,
            flexShrink: 0,
            background:
              "linear-gradient(122deg, #5014d2ff 0%, #dd3ca7ff 100%)",
          }}
        />

        <Box
          sx={{
            p: 3.5,
            display: "flex",
            flexDirection: "column",
            flex: 1,
            minHeight: 0,
          }}
        >
          <Box sx={{ flex: 1 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <Chip
                label={industry}
                size="small"
                sx={{
                  backgroundColor: "grey.100",
                  color: "grey.800",
                  fontWeight: 500,
                  letterSpacing: "0.5px",
                }}
              />
            </Box>

            <Box sx={{ py: 1 }}>
              <Typography variant="h5" fontWeight={700} mb={1}>
                {client}
              </Typography>
              <Typography
                variant="body2"
                color="text.secondary"
                fontWeight={500}
                sx={{
                  lineHeight: 1.6,
                  mb: 1,
                }}
              >
                {summary}
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              py: 1,
              mt: "auto",
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography
              variant="caption"
              fontWeight={500}
              color="text.secondary"
              display="block"
              mb={1}
            >
              OUTCOME
            </Typography>
            <Typography variant="body2" fontWeight={600} color="primary.dark">
              {result}
            </Typography>
          </Box>
        </Box>
      </Card>
    </Link>
  );
};

export default CaseStudyCard;
