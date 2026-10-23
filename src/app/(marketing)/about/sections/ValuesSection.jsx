import { Box, Container, Typography } from "@mui/material";

import {
  IntegrityFirstIcon,
  TransparencyIcon,
  DiversityToInnovationIcon,
  InclusivityIcon,
  ContinuousLearningIcon,
  BringWholeSelfIcon,
} from "../Icons/IntegrityIcon";

/* Data */
const values = [
  {
    title: "Integrity First",
    text: "We say what we mean and do what we say. Integrity is the foundation of everything we do.",
    icon: <IntegrityFirstIcon />,
  },
  {
    title: "Transparency",
    text: "We prioritize openness – with clients, partners, and within our teams.",
    icon: <TransparencyIcon />,
  },
  {
    title: "Diversity to Innovation",
    text: "We see diversity not just as a value, but as a business imperative. Our best ideas come from our differences.",
    icon: <DiversityToInnovationIcon />,
  },
  {
    title: "Inclusivity",
    text: "We’re proud of our inclusive hiring practices and a workplace where everyone feels seen and heard.",
    icon: <InclusivityIcon />,
  },
  {
    title: "Continuous Learning",
    text: "Upskilling and continuous learning are part of our DNA – helping every team member reach their full potential.",
    icon: <ContinuousLearningIcon />,
  },
  {
    title: "Bring Whole Self",
    text: "From interns to leadership, everyone at TriWinz is encouraged to show up authentically, every day.",
    icon: <BringWholeSelfIcon />,
  },
];

export default function ValuesSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, sm: 8, md: 12 },
        backgroundColor: "rgb(248, 249, 249)",
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
          sx={{
            mb: { xs: 4, md: 6 },
            fontSize: {
              xs: "1.9rem",
              sm: "2.3rem",
              md: "3rem",
            },
            lineHeight: 1.2,
          }}
        >
          Ethics, Empathy and Inclusion
        </Typography>

        {/* Grid */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: { xs: 3, md: 4 },
          }}
        >
          {values.map((item, index) => (
            <ValueCard key={index} {...item} />
          ))}
        </Box>
      </Box>
    </Box>
  );
}

/* ---------- Card ---------- */

function ValueCard({ title, text, icon }) {
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: "14px",
        backgroundColor: "#fff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",

        // Disable hover lift on touch devices
        "@media (hover: hover)": {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 16px 40px rgba(0,0,0,0.1)",
            color: "#fff",
            backgroundImage:
              "linear-gradient(122deg, #5014D2 0%, #DD3CA7 100%)",
            transition: "all 0.3s ease-in-out",
          },
        },
      }}
    >
      {/* Icon */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Box
          sx={{
            width: { xs: 40, md: 44 },
            height: { xs: 40, md: 44 },
            borderRadius: "50%",
            mb: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: { xs: "1.1rem", md: "1.3rem" },
            backgroundColor: "#fff",
          }}
        >
          {icon}
        </Box>

        <Typography
          component="div"
          fontWeight={700}
          sx={{
            mb: 1,
            // color: "#111827",
            fontSize: { xs: "1rem", md: "1.05rem" },
          }}
        >
          {title}
        </Typography>
      </Box>

      {/* Title */}

      {/* Text */}
      <Typography
        component="div"
        sx={{
          // color: "#4b5563",
          fontSize: { xs: "0.9rem", md: "0.95rem" },
          lineHeight: 1.7,
          fontWeight: 600,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}
