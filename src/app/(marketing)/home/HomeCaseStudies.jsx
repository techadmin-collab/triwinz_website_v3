"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Container, Typography } from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";

const proofBlocks = [
  {
    title: "Aviation & Immigration Platforms",
    tag: "Government · Immigration",
    description:
      "Mission-critical visa, consular, and passenger processing platforms built for sovereign compliance, scale, and zero operational tolerance across border and embassy environments.",
    image: "/home/Aviation_Immigration_Platforms.webp",
    link: "/case-studies/us-embassy-india-appointment-system-consular-digitization-case-study",
  },
  {
    title: "Government-Scale Crowd Intelligence",
    tag: "Public Safety · Events",
    description:
      "Audit-grade crowd intelligence and participant validation systems delivered for high-risk, large-scale public events with real-time visibility and regulatory assurance.",
    image: "/home/Government_Crowd_Intelligence.webp",
    link: "/case-studies/india-usa-visa-interview-appointment",
  },
  {
    title: "Airline-Led Visa Digitisation",
    tag: "Aviation · Visa",
    description:
      "Airline-integrated visa digitisation platforms enabling secure, end-to-end digital visa processing, compliance-aligned workflows, and frictionless passenger journeys across global markets.",
    image: "/home/Airline_Visa_Digitisation.webp",
    link: "/case-studies/etihad-airways-visa-digitisation-platform-uae",
  },
  {
    title: "Retail & Hyperlocal Commerce",
    tag: "Retail · Commerce",
    description:
      "Hyperlocal commerce and retail digitisation frameworks empowering neighborhood businesses with micro-ERP, quick-commerce fulfillment, and retailer-first digital ecosystems.",
    image: "/home/Retail_Hyperlocal_Commerce.webp",
    link: "/case-studies/bizbuddy-hyperlocal-retail-quick-commerce-framework",
  },
];

const DARK = "#1D5758";
const DARKER = "#164546";
const LIGHT = "#2BD1C7";
const GRADIENT = `linear-gradient(96deg, ${DARK} 0%, ${LIGHT} 100%)`;

const focusRing = { outline: `3px solid ${LIGHT}`, outlineOffset: 3 };

/* Large card on the left */
function FeaturedCard({ item }) {
  return (
    <Box
      component={Link}
      href={item.link}
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        minHeight: { xs: 360, sm: 420, md: 470 },
        borderRadius: 4,
        overflow: "hidden",
        textDecoration: "none",
        color: "#fff",
        isolation: "isolate",
        boxShadow: "0 24px 60px rgba(29, 87, 88, 0.22)",
        "& .cs-feat-img": { transition: "transform 0.8s ease" },
        "& .cs-feat-arrow": { transition: "transform 0.35s ease, background-color 0.35s ease" },
        "&:hover .cs-feat-img, &:focus-visible .cs-feat-img": { transform: "scale(1.05)" },
        "&:hover .cs-feat-arrow, &:focus-visible .cs-feat-arrow": {
          transform: "translate(3px, -3px)",
          backgroundColor: LIGHT,
          color: DARKER,
        },
        "&:focus-visible": focusRing,
      }}
    >
      <Image
        src={item.image}
        alt={item.title}
        fill
        priority={false}
        sizes="(max-width: 900px) 100vw, 680px"
        className="cs-feat-img"
        style={{ objectFit: "cover", zIndex: -2 }}
      />
      {/* Teal fade so the text stays readable */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
          background:
            "linear-gradient(180deg, rgba(22,69,70,0) 25%, rgba(22,69,70,0.55) 55%, rgba(22,69,70,0.95) 100%)",
        }}
      />

      {/* Arrow badge, top right */}
      <Box
        className="cs-feat-arrow"
        sx={{
          position: "absolute",
          top: 20,
          right: 20,
          width: 46,
          height: 46,
          borderRadius: "50%",
          display: "grid",
          placeItems: "center",
          backgroundColor: "rgba(255,255,255,0.18)",
          border: "1px solid rgba(255,255,255,0.35)",
          backdropFilter: "blur(8px)",
          color: "#fff",
        }}
      >
        <NorthEastRoundedIcon sx={{ fontSize: 22 }} />
      </Box>

      <Box sx={{ p: { xs: 3, md: 4 } }}>
        <Box
          sx={{
            display: "inline-block",
            px: 1.5,
            py: 0.5,
            mb: 1.75,
            borderRadius: 999,
            backgroundColor: "rgba(43, 209, 199, 0.22)",
            border: "1px solid rgba(43, 209, 199, 0.55)",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {item.tag}
        </Box>
        <Typography
          component="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "1.45rem", md: "1.9rem" },
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
            mb: 1.25,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: "0.9rem", md: "0.98rem" },
            lineHeight: 1.65,
            opacity: 0.9,
            maxWidth: 560,
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </Typography>
      </Box>
    </Box>
  );
}

/* Compact row on the right */
function CaseRow({ item, index }) {
  return (
    <Box
      component={Link}
      href={item.link}
      sx={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        gap: { xs: 2, sm: 2.5 },
        p: { xs: 1.5, sm: 2 },
        borderRadius: 3,
        textDecoration: "none",
        color: "inherit",
        backgroundColor: "#fff",
        border: "1px solid rgba(29, 87, 88, 0.1)",
        boxShadow: "0 8px 24px rgba(17, 12, 46, 0.05)",
        transition:
          "transform 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease",
        "& .cs-row-img": { transition: "transform 0.6s ease" },
        "& .cs-row-arrow": {
          transition: "transform 0.35s ease, background-color 0.35s ease, color 0.35s ease",
        },
        "&:hover, &:focus-visible": {
          transform: "translateY(-3px)",
          boxShadow: "0 18px 40px rgba(29, 87, 88, 0.14)",
          borderColor: "rgba(29, 87, 88, 0.28)",
        },
        "&:hover .cs-row-img, &:focus-visible .cs-row-img": { transform: "scale(1.08)" },
        "&:hover .cs-row-arrow, &:focus-visible .cs-row-arrow": {
          transform: "translateX(3px)",
          backgroundColor: DARK,
          color: "#fff",
        },
        "&:focus-visible": focusRing,
      }}
    >
      {/* Thumbnail */}
      <Box
        sx={{
          position: "relative",
          flexShrink: 0,
          width: { xs: 96, sm: 132 },
          alignSelf: "stretch",
          minHeight: { xs: 88, sm: 104 },
          borderRadius: 2.5,
          overflow: "hidden",
          backgroundColor: "#DDF5F3",
        }}
      >
        <Image
          src={item.image}
          alt={item.title}
          fill
          sizes="132px"
          className="cs-row-img"
          style={{ objectFit: "cover" }}
        />
      </Box>

      {/* Text */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: DARK,
            fontSize: "0.68rem",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            mb: 0.5,
          }}
        >
          {String(index + 2).padStart(2, "0")} · {item.tag}
        </Typography>
        <Typography
          component="h3"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "0.98rem", md: "1.05rem" },
            color: "#1a1a1a",
            lineHeight: 1.3,
            mb: 0.5,
          }}
        >
          {item.title}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.84rem",
            color: "#555",
            lineHeight: 1.55,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {item.description}
        </Typography>
      </Box>

      {/* Arrow */}
      <Box
        className="cs-row-arrow"
        sx={{
          display: { xs: "none", sm: "grid" },
          placeItems: "center",
          flexShrink: 0,
          width: 38,
          height: 38,
          borderRadius: "50%",
          backgroundColor: "#DDF5F3",
          color: DARK,
        }}
      >
        <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
      </Box>
    </Box>
  );
}

const exploreButtonSx = {
  display: "inline-flex",
  alignItems: "center",
  gap: 1,
  px: 3,
  py: 1.2,
  borderRadius: "10px",
  backgroundColor: DARK,
  color: "#fff",
  fontWeight: 600,
  fontSize: "0.92rem",
  textDecoration: "none",
  whiteSpace: "nowrap",
  boxShadow: "0 10px 24px rgba(29, 87, 88, 0.25)",
  transition: "background-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease",
  "&:hover": {
    backgroundColor: DARKER,
    boxShadow: "0 14px 30px rgba(29, 87, 88, 0.35)",
    transform: "translateY(-2px)",
  },
  "&:focus-visible": focusRing,
};

const HomeCaseStudies = () => {
  const [featured, ...rest] = proofBlocks;

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 7, md: 10 },
        fontFamily: "montserrat, inter",
        background: "linear-gradient(180deg, #ffffff 0%, #F5FCFB 100%)",
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: { xs: 4, md: 5 } }}>
          <Typography
            component="h2"
            sx={{
              color: "#1a1a1a",
              fontSize: { xs: "1.7rem", sm: "2rem", md: "2.4rem" },
              fontWeight: 800,
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              whiteSpace: { md: "nowrap" },
              mb: 1.5,
            }}
          >
            Trusted by Governments.{" "}
            <Box
              component="span"
              sx={{
                backgroundImage: GRADIENT,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              Proven at Scale.
            </Box>
          </Typography>
          <Typography
            sx={{
              color: "#555",
              fontSize: { xs: "0.95rem", md: "1rem" },
              lineHeight: 1.7,
              maxWidth: 640,
              mx: "auto",
            }}
          >
            Sovereign-grade platforms delivered for embassies, airlines,
            public events and retail networks.
          </Typography>
        </Box>

        {/* Featured + list */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.25fr 1fr" },
            gap: { xs: 2.5, md: 3 },
            alignItems: "stretch",
          }}
        >
          <FeaturedCard item={featured} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 2.5 } }}>
            {rest.map((item, i) => (
              <CaseRow key={item.title} item={item} index={i} />
            ))}
          </Box>
        </Box>

        {/* Section CTA */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: { xs: 4, md: 5 } }}>
          <Box component={Link} href="/case-studies" sx={exploreButtonSx}>
            Explore all case studies
            <ArrowForwardRoundedIcon sx={{ fontSize: 20 }} />
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeCaseStudies;
