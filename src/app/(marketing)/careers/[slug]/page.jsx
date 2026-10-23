import { Box, Button, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import HomeWorkOutlinedIcon from "@mui/icons-material/HomeWorkOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublishedJobBySlug, getPublishedJobs } from "../sections/jobs";
import { getWorkModeLabel } from "../sections/workMode";
import ApplyModal from "../sections/ApplyModal";
import { formatJobTypes } from "../../../../lib/jobTypes";

const siteContainerSx = {
  width: "100%",
  mx: "auto",
  px: { xs: 2, md: 4 },
  maxWidth: {
    xs: "1250px",
    xl: "xl",
  },
};

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);
  if (!job) return { title: "Role not found" };
  return {
    title: `${job.title} | Careers`,
    description: job.summary,
  };
}

export default async function CareerDetailPage({ params }) {
  const { slug } = await params;
  const job = await getPublishedJobBySlug(slug);

  if (!job) notFound();

  const related = (await getPublishedJobs()).filter((j) => j.slug !== job.slug);

  const metaItems = [
    {
      icon: <ApartmentOutlinedIcon />,
      label: "Department",
      value: job.department,
    },
    {
      icon: <LocationOnOutlinedIcon />,
      label: "Location",
      value: job.location,
    },
    { icon: <WorkOutlineIcon />, label: "Job type", value: formatJobTypes(job.type) },
    {
      icon: <HomeWorkOutlinedIcon />,
      label: "Work mode",
      value: getWorkModeLabel(job.workMode),
    },
    ...(job.joiningPeriod
      ? [
          {
            icon: <EventAvailableOutlinedIcon />,
            label: "Joining period",
            value: job.joiningPeriod,
          },
        ]
      : []),
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        fontFamily: "montserrat, inter",
        background:
          "linear-gradient(180deg, #faf8ff 0%, #ffffff 28%, #ffffff 100%)",
      }}
    >
      {/* Hero — same pattern as Careers / Case Studies listing */}
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          color: "#fff",
          pt: { xs: 12, md: 14 },
          pb: { xs: 8, md: 10 },
        }}
      >
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(122deg, #5014d2ff 0%, #dd3ca73d 100%),url('/about/bg-1-1.webp')",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <Box sx={{ ...siteContainerSx, position: "relative", zIndex: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 3 }}>
            <Link href="/careers" style={{ textDecoration: "none" }}>
              <Button
                startIcon={<ArrowBackIcon />}
                sx={{
                  color: "white",
                  textTransform: "none",
                  fontWeight: 600,
                  "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
                }}
              >
                All open roles
              </Button>
            </Link>
          </Box>

          <Typography
            textAlign="center"
            fontWeight={800}
            sx={{
              fontSize: { xs: "2.2rem", md: "3.5rem" },
              lineHeight: 1.15,
              mb: 3,
            }}
          >
            {job.title}
          </Typography>

          <Typography
            textAlign="center"
            sx={{
              maxWidth: 900,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              opacity: 0.9,
              mb: job.experience ? 2.5 : 4,
              whiteSpace: "pre-line",
            }}
          >
            {job.summary}
          </Typography>

          {job.experience ? (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 0.75,
                  px: 2,
                  py: 0.75,
                  borderRadius: 2,
                  backgroundColor: "rgba(0,0,0,0.28)",
                  border: "1px solid rgba(255,255,255,0.22)",
                  backdropFilter: "blur(6px)",
                }}
              >
                <AccessTimeOutlinedIcon sx={{ fontSize: 16, opacity: 0.95 }} />
                <Typography
                  sx={{
                    fontSize: { xs: "0.78rem", md: "0.85rem" },
                    fontWeight: 600,
                    opacity: 0.98,
                  }}
                >
                  Experience · {job.experience}
                </Typography>
              </Box>
            </Box>
          ) : null}
        </Box>
      </Box>

      {/* Meta strip */}
      <Box
        sx={{
          ...siteContainerSx,
          position: "relative",
          zIndex: 2,
          mt: { xs: -3, md: -4 },
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: metaItems.length >= 5 ? "repeat(5, 1fr)" : "repeat(4, 1fr)",
            },
            gap: { xs: 1.5, md: 2 },
            p: { xs: 2, md: 2.5 },
            borderRadius: 3,
            backgroundColor: "#fff",
            boxShadow: "0 18px 40px rgba(80, 20, 210, 0.1)",
            border: "1px solid rgba(80, 20, 210, 0.08)",
          }}
        >
          {metaItems.map((item) => (
            <Box
              key={item.label}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 1.5,
                px: { xs: 0.5, md: 1 },
                py: 0.5,
              }}
            >
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background:
                    "linear-gradient(135deg, rgba(80,20,210,0.1) 0%, rgba(221,60,167,0.1) 100%)",
                  color: "#5014d2",
                  "& svg": { fontSize: 20 },
                }}
              >
                {item.icon}
              </Box>
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    fontSize: "0.65rem",
                  }}
                >
                  {item.label}
                </Typography>
                <Typography
                  fontWeight={700}
                  sx={{
                    fontSize: { xs: "0.85rem", md: "0.95rem" },
                    lineHeight: 1.35,
                    color: "#1a1a1a",
                  }}
                >
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Job details */}
      <Box sx={{ ...siteContainerSx, py: { xs: 6, md: 9 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1.05fr 0.95fr" },
            gap: { xs: 0, lg: 6, xl: 7 },
            alignItems: "start",
            mb: { xs: 5, md: 6 },
          }}
        >
          <Box
            sx={{
              order: { xs: 1, lg: 1 },
              position: { lg: "sticky" },
              top: { lg: 110 },
            }}
          >
            <Section
              title="About the role"
              intro="What you’ll be working on and why this role matters."
              inColumn
              last
            >
              <Box sx={{ display: "grid", gap: 2 }}>
                {String(job.about || "")
                  .split(/\n+/)
                  .map((paragraph) => paragraph.trim())
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <Typography
                      key={index}
                      sx={{
                        color: "#444",
                        fontSize: { xs: "0.95rem", md: "1rem" },
                        lineHeight: 1.8,
                      }}
                    >
                      {paragraph}
                    </Typography>
                  ))}
              </Box>
            </Section>
          </Box>

          <Box sx={{ order: { xs: 2, lg: 2 } }}>
            {[
              {
                title: "Responsibilities",
                intro: "Day-to-day ownership and impact areas.",
                items: job.responsibilities,
              },
              {
                title: "Requirements",
                intro: "Skills and experience that will help you succeed.",
                items: job.requirements,
              },
              {
                title: "Qualifications and certifications",
                intro: "Education and credentials that support this role.",
                items: job.qualifications,
              },
              {
                title: "Nice to have",
                intro: "Bonus strengths — not required, but valued.",
                items: job.niceToHave,
              },
            ]
              .filter(
                (section) =>
                  Array.isArray(section.items) && section.items.length > 0,
              )
              .map((section, index, list) => (
                <Section
                  key={section.title}
                  title={section.title}
                  intro={section.intro}
                  inColumn
                  last={index === list.length - 1}
                >
                  <CheckList items={section.items} />
                </Section>
              ))}
          </Box>
        </Box>

        <Box
          sx={{
            mt: { xs: 5, md: 6 },
            p: { xs: 3, md: 4 },
            borderRadius: 3,
            textAlign: "center",
            background:
              "linear-gradient(135deg, rgba(80,20,210,0.06) 0%, rgba(221,60,167,0.06) 100%)",
            border: "1px solid rgba(80, 20, 210, 0.1)",
          }}
        >
          <Typography
            fontWeight={800}
            sx={{ fontSize: { xs: "1.25rem", md: "1.5rem" }, mb: 1 }}
          >
            Interested in this role?
          </Typography>
          <Typography
            color="text.secondary"
            sx={{ mb: 3, maxWidth: 480, mx: "auto" }}
          >
            Submit your application and our team will get back to you soon.
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <ApplyModal
              jobTitle={job.title}
              jobSlug={job.slug}
              buttonSx={{ minWidth: { xs: "100%", sm: 280 } }}
            />
          </Box>
        </Box>
      </Box>

      {/* Related roles */}
      {related.length > 0 && (
        <Box
          sx={{
            borderTop: "1px solid",
            borderColor: "rgba(80, 20, 210, 0.08)",
            background: "linear-gradient(180deg, #faf8ff 0%, #fff 100%)",
            py: { xs: 6, md: 8 },
          }}
        >
          <Box sx={siteContainerSx}>
            <Typography
              fontWeight={800}
              sx={{ fontSize: { xs: "1.4rem", md: "1.75rem" }, mb: 1 }}
            >
              Other open roles
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 4 }}>
              Explore more opportunities at Triwinz
            </Typography>

            <Box
              sx={{
                display: "flex",
                gap: 2.5,
                overflowX: "auto",
                pb: 1.5,
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                "&::-webkit-scrollbar": {
                  height: 6,
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(80, 20, 210, 0.25)",
                  borderRadius: 999,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "rgba(80, 20, 210, 0.06)",
                  borderRadius: 999,
                },
              }}
            >
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/careers/${item.slug}`}
                  style={{ textDecoration: "none", flex: "0 0 auto" }}
                >
                  <Box
                    sx={{
                      width: { xs: 280, sm: 300, md: 320 },
                      height: "100%",
                      p: 3,
                      borderRadius: 3,
                      backgroundColor: "#fff",
                      border: "1px solid rgba(80, 20, 210, 0.1)",
                      scrollSnapAlign: "start",
                      transition:
                        "transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease",
                      "&:hover": {
                        transform: "translateY(-3px)",
                        borderColor: "rgba(80, 20, 210, 0.28)",
                        boxShadow: "0 14px 30px rgba(80, 20, 210, 0.1)",
                      },
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#5014d2",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                      }}
                    >
                      {item.department}
                    </Typography>
                    <Typography
                      fontWeight={700}
                      sx={{
                        mt: 1,
                        mb: 1,
                        color: "#1a1a1a",
                        fontSize: "1.1rem",
                      }}
                    >
                      {item.title}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ lineHeight: 1.6 }}
                    >
                      {item.location} · {item.workMode || "Hybrid"} ·{" "}
                      {formatJobTypes(item.type)}
                    </Typography>
                  </Box>
                </Link>
              ))}
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
}

function Section({ title, intro, children, last = false, inColumn = false }) {
  return (
    <Box
      sx={{
        mb: last ? 0 : { xs: 5, md: 6 },
        pb: last ? 0 : { xs: 5, md: 6 },
        borderBottom: last ? "none" : "1px solid rgba(80, 20, 210, 0.08)",
      }}
    >
      <Typography
        fontWeight={800}
        sx={{
          fontSize: { xs: "1.45rem", md: "1.75rem" },
          mb: 1,
          letterSpacing: "-0.02em",
          color: "#141414",
        }}
      >
        {title}
      </Typography>
      {intro && (
        <Typography
          color="text.secondary"
          sx={{ mb: 3, maxWidth: inColumn ? "none" : 720, lineHeight: 1.6 }}
        >
          {intro}
        </Typography>
      )}
      {children}
    </Box>
  );
}

function CheckList({ items }) {
  const list = Array.isArray(items) ? items : [];
  if (!list.length) return null;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 1 }}>
      {list.map((item, index) => (
        <Box
          key={`${index}-${item}`}
          sx={{
            display: "flex",
            gap: 1.25,
            alignItems: "flex-start",
            p: 1.25,
            borderRadius: 2,
            backgroundColor: "rgba(80, 20, 210, 0.03)",
            border: "1px solid rgba(80, 20, 210, 0.06)",
            transition: "background-color 0.2s ease",
            "&:hover": {
              backgroundColor: "rgba(80, 20, 210, 0.055)",
            },
          }}
        >
          <Box
            sx={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              flexShrink: 0,
              mt: 0.25,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "linear-gradient(135deg, #5014d2 0%, #dd3ca7 100%)",
              color: "#fff",
            }}
          >
            <CheckRoundedIcon sx={{ fontSize: 11 }} />
          </Box>
          <Typography
            sx={{
              color: "#333",
              lineHeight: 1.55,
              fontSize: "0.875rem",
              fontWeight: 500,
            }}
          >
            {item}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
