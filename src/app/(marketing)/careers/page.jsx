import { Box, Container, Typography } from "@mui/material";
import JobCard from "./sections/JobCard";
import TrainingApplyModal from "./sections/TrainingApplyModal";
import { getPublishedJobs } from "./sections/jobs";
import { defaultOpenGraph, defaultTwitter } from "../../../lib/seo";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Careers",
  description:
    "Join Triwinz Technologies. Explore open roles in engineering, design, consulting, and more.",
  alternates: {
    canonical: "/careers",
  },
  openGraph: {
    ...defaultOpenGraph,
    title: "Careers at Triwinz",
    description:
      "Join Triwinz Technologies. Explore open roles in engineering, design, consulting, and more.",
    url: "/careers",
  },
  twitter: {
    ...defaultTwitter,
    title: "Careers at Triwinz",
    description:
      "Join Triwinz Technologies. Explore open roles in engineering, design, consulting, and more.",
  },
};

export default async function CareersPage() {
  const jobs = await getPublishedJobs();

  return (
    <>
      <Box
        sx={{
          minHeight: { xs: "auto", md: "70vh" },
          alignItems: "center",
          justifyContent: "center",
          alignContent: "center",
          position: "relative",
          overflow: "hidden",
          fontFamily: "montserrat, inter",
          color: "#fff",
          py: { xs: 12, md: 16 },
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

        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2, px: { xs: 2, md: 4 } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              mb: 3,
            }}
          >
            <Box
              sx={{
                display: "inline-flex",
                alignItems: "center",
                px: 2.5,
                py: 0.8,
                borderRadius: "999px",
                backgroundColor: "rgba(255,255,255,0.15)",
                border: "1px solid rgba(255,255,255,0.3)",
                backdropFilter: "blur(6px)",
                fontSize: { xs: "0.75rem", sm: "0.85rem" },
                fontWeight: 500,
              }}
            >
              Careers
            </Box>
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
            Build With Us
          </Typography>

          <Typography
            textAlign="center"
            sx={{
              fontSize: { xs: "1rem", md: "1.25rem" },
              fontWeight: 500,
              mb: 3,
              opacity: 0.95,
            }}
          >
            Join a team shipping real products for real impact
          </Typography>

          <Typography
            textAlign="center"
            sx={{
              maxWidth: 720,
              mx: "auto",
              lineHeight: 1.7,
              fontSize: "0.95rem",
              opacity: 0.9,
            }}
          >
            Explore open roles across engineering, design, and consulting. We’re
            looking for people who care about craft, ownership, and building
            technology that helps businesses scale.
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <TrainingApplyModal />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 8, px: { xs: 2, md: 4 } }}>
        <Typography
          fontWeight={700}
          sx={{ mb: 4, fontSize: { xs: "1.4rem", md: "1.75rem" } }}
        >
          Open positions ({jobs.length})
        </Typography>

        {jobs.length === 0 ? (
          <Typography color="text.secondary">
            No open positions right now. Please check back soon.
          </Typography>
        ) : (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(2, 1fr)",
              },
              gap: 4,
              alignItems: "stretch",
            }}
          >
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                title={job.title}
                department={job.department}
                location={job.location}
                type={job.type}
                workMode={job.workMode}
                experience={job.experience}
                joiningPeriod={job.joiningPeriod}
                summary={job.summary}
                qualifications={job.qualifications}
                slug={job.slug}
              />
            ))}
          </Box>
        )}
      </Container>
    </>
  );
}
