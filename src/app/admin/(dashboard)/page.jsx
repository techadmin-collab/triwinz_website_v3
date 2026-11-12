export const dynamic = "force-dynamic";

import { Alert, Box, Button, Paper, Typography } from "@mui/material";
import Link from "next/link";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import { prisma } from "../../../lib/prisma";
import AdminPageHeader from "../components/AdminPageHeader";
import { BRAND, brandButtonSx } from "../../../lib/brand";
import { requirePageModule } from "../../../lib/requirePageModule";
import { hasModuleAccess } from "../../../lib/permissions";

export default async function AdminDashboardPage() {
  const session = await requirePageModule("/admin");
  const canViewApplications = hasModuleAccess(session, "applications");

  // Problems visitors hit on the website forms (admins only). Never breaks the dashboard.
  let openIssueErrors = 0;
  let openIssueTotal = 0;
  if (hasModuleAccess(session, "system")) {
    try {
      [openIssueErrors, openIssueTotal] = await Promise.all([
        prisma.systemIssue.count({ where: { resolved: false, severity: "error" } }),
        prisma.systemIssue.count({ where: { resolved: false } }),
      ]);
    } catch {}
  }

  const [
    jobs,
    newApplications,
    shortlistedApplications,
    selectedApplications,
    jobsList,
    applicationsByJob,
    totalApplications,
    publishedJobs,
  ] = await Promise.all([
    prisma.job.count(),
    prisma.jobApplication.count({ where: { status: "new" } }),
    prisma.jobApplication.count({ where: { status: "shortlisted" } }),
    prisma.jobApplication.count({ where: { status: "selected" } }),
    canViewApplications
      ? prisma.job.findMany({
          select: {
            slug: true,
            title: true,
            department: true,
            published: true,
          },
          orderBy: { title: "asc" },
        })
      : Promise.resolve([]),
    canViewApplications
      ? prisma.jobApplication.groupBy({
          by: ["jobSlug"],
          _count: { _all: true },
        })
      : Promise.resolve([]),
    prisma.jobApplication.count(),
    prisma.job.count({ where: { published: true } }),
  ]);

  const countBySlug = new Map(
    applicationsByJob.map((row) => [row.jobSlug, row._count._all]),
  );

  const jobApplicationRows = jobsList
    .map((job) => ({
      jobSlug: job.slug,
      jobTitle: job.title,
      department: job.department,
      published: job.published,
      count: countBySlug.get(job.slug) || 0,
    }))
    .sort((a, b) => b.count - a.count || a.jobTitle.localeCompare(b.jobTitle));

  const pct = (value) =>
    totalApplications > 0 ? Math.round((value / totalApplications) * 100) : 0;
  const draftJobs = Math.max(jobs - publishedJobs, 0);

  const cards = [
    {
      label: "New applications",
      count: newApplications,
      href: "/admin/applications?status=new",
      icon: FiberNewOutlinedIcon,
      hero: true, // solid teal card that leads the row
      caption: `${pct(newApplications)}% of ${totalApplications} applications`,
      bars: [{ value: pct(newApplications), color: "#2BD1C7" }],
      module: "applications",
    },
    {
      label: "Shortlisted",
      count: shortlistedApplications,
      href: "/admin/shortlisted",
      icon: StarOutlineIcon,
      accent: "#1A9E96",
      soft: "#E6FAF8",
      caption: `${pct(shortlistedApplications)}% of all applications`,
      bars: [{ value: pct(shortlistedApplications), color: "#2BD1C7" }],
      module: "applications",
    },
    {
      label: "Selected",
      count: selectedApplications,
      href: "/admin/applications?status=selected",
      icon: CheckCircleOutlineIcon,
      accent: "#059669",
      soft: "#ECFDF5",
      caption: `${pct(selectedApplications)}% of all applications`,
      bars: [{ value: pct(selectedApplications), color: "#10B981" }],
      module: "applications",
    },
    {
      label: "Jobs listed",
      count: jobs,
      href: "/admin/jobs",
      icon: WorkOutlineIcon,
      accent: BRAND.primary,
      soft: "#E6F7F6",
      caption: `${publishedJobs} published · ${draftJobs} draft${draftJobs === 1 ? "" : "s"}`,
      bars:
        jobs > 0
          ? [
              { value: (publishedJobs / jobs) * 100, color: "#10B981" },
              { value: (draftJobs / jobs) * 100, color: "#F59E0B" },
            ]
          : [],
      module: "jobs",
    },
  ].filter((card) => hasModuleAccess(session, card.module));

  const quickLinks = [
    { label: "Add job", href: "/admin/jobs/new", primary: true, module: "jobs" },
    {
      label: "Review applications",
      href: "/admin/applications",
      module: "applications",
    },
    {
      label: "Review shortlisted",
      href: "/admin/shortlisted",
      module: "applications",
    },
    { label: "Manage users", href: "/admin/users", module: "users" },
  ].filter((link) => hasModuleAccess(session, link.module));

  return (
    <Box>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of jobs and career applications."
      />

      {openIssueTotal > 0 ? (
        <Alert
          severity={openIssueErrors > 0 ? "error" : "warning"}
          sx={{ mb: 2.5, borderRadius: 2, alignItems: "center" }}
          action={
            <Button
              component={Link}
              href="/admin/system-issues"
              size="small"
              sx={{ textTransform: "none", fontWeight: 700, color: "inherit", whiteSpace: "nowrap" }}
            >
              Review
            </Button>
          }
        >
          {openIssueErrors > 0
            ? `${openIssueErrors} website problem${openIssueErrors === 1 ? "" : "s"} may be stopping visitors from submitting forms.`
            : `${openIssueTotal} minor website issue${openIssueTotal === 1 ? "" : "s"} recorded on the forms.`}
        </Alert>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: { xs: 1.25, sm: 2 },
          mb: 3,
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          const hero = Boolean(card.hero);
          const accent = hero ? "#2BD1C7" : card.accent;
          return (
            <Link
              key={card.label}
              href={card.href}
              style={{ textDecoration: "none", color: "inherit", display: "block", minWidth: 0 }}
            >
              <Box
                sx={{
                  position: "relative",
                  overflow: "hidden",
                  isolation: "isolate",
                  height: "100%",
                  p: { xs: 1.75, sm: 2.5 },
                  borderRadius: { xs: 2.5, sm: 3 },
                  display: "flex",
                  flexDirection: "column",
                  color: hero ? "#fff" : "#111",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease",
                  ...(hero
                    ? {
                        background: "linear-gradient(135deg, #164546 0%, #1D5758 45%, #1F8C86 100%)",
                        boxShadow: "0 14px 32px rgba(29, 87, 88, 0.28)",
                      }
                    : {
                        bgcolor: "#fff",
                        border: "1px solid #eef0f3",
                        // soft accent glow in the top-right corner
                        backgroundImage: `radial-gradient(circle at 100% 0%, ${card.soft} 0%, rgba(255,255,255,0) 55%)`,
                        boxShadow: "0 1px 2px rgba(15, 17, 21, 0.04)",
                      }),
                  "&:hover": {
                    transform: "translateY(-3px)",
                    boxShadow: hero
                      ? "0 20px 40px rgba(29, 87, 88, 0.35)"
                      : "0 14px 30px rgba(15, 17, 21, 0.08)",
                    ...(hero ? {} : { borderColor: accent }),
                  },
                  "&:hover .card-arrow": { transform: "translateX(4px)" },
                }}
              >
                {/* Large faded icon in the corner */}
                <Icon
                  sx={{
                    position: "absolute",
                    right: -18,
                    bottom: -18,
                    fontSize: 120,
                    zIndex: -1,
                    color: hero ? "rgba(255,255,255,0.08)" : accent,
                    opacity: hero ? 1 : 0.07,
                  }}
                />

                {/* Top row: label + icon badge */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 1,
                    mb: { xs: 1.25, sm: 2 },
                  }}
                >
                  <Typography
                    sx={{
                      minWidth: 0,
                      lineHeight: 1.35,
                      fontSize: { xs: "0.68rem", sm: "0.78rem" },
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      color: hero ? "rgba(255,255,255,0.82)" : "#6b7280",
                    }}
                  >
                    {card.label}
                  </Typography>
                  <Box
                    sx={{
                      width: { xs: 32, sm: 38 },
                      height: { xs: 32, sm: 38 },
                      borderRadius: 2,
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      ...(hero
                        ? {
                            bgcolor: "rgba(255,255,255,0.16)",
                            border: "1px solid rgba(255,255,255,0.25)",
                            color: "#fff",
                          }
                        : { bgcolor: accent, color: "#fff", boxShadow: `0 6px 14px ${accent}40` }),
                    }}
                  >
                    <Icon sx={{ fontSize: { xs: 17, sm: 20 } }} />
                  </Box>
                </Box>

                {/* Big number */}
                <Typography
                  sx={{
                    fontSize: { xs: "1.9rem", sm: "2.2rem", md: "2.5rem" },
                    fontWeight: 800,
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    color: hero ? "#fff" : "#111",
                  }}
                >
                  {card.count}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.75,
                    fontSize: { xs: "0.72rem", sm: "0.8rem" },
                    lineHeight: 1.4,
                    fontWeight: 500,
                    color: hero ? "rgba(255,255,255,0.78)" : "#6b7280",
                  }}
                >
                  {card.caption}
                </Typography>

                {/* Progress / split bar */}
                <Box
                  sx={{
                    mt: 1.75,
                    height: 6,
                    borderRadius: 999,
                    overflow: "hidden",
                    display: "flex",
                    bgcolor: hero ? "rgba(255,255,255,0.18)" : "#eef0f3",
                  }}
                >
                  {card.bars.map((bar, i) => (
                    <Box
                      key={i}
                      sx={{
                        width: `${Math.min(Math.max(bar.value, 0), 100)}%`,
                        bgcolor: bar.color,
                        height: "100%",
                      }}
                    />
                  ))}
                </Box>

                {/* Footer link */}
                <Box
                  sx={{
                    mt: "auto",
                    pt: { xs: 1.5, sm: 2 },
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    fontSize: { xs: "0.74rem", sm: "0.8rem" },
                    fontWeight: 700,
                    color: hero ? "#fff" : accent,
                  }}
                >
                  View details
                  <ArrowForwardIcon
                    className="card-arrow"
                    sx={{ fontSize: 15, transition: "transform 0.25s ease" }}
                  />
                </Box>
              </Box>
            </Link>
          );
        })}
      </Box>

      {canViewApplications ? (
        <Paper
          elevation={0}
          sx={{
            p: { xs: 2, sm: 2.5 },
            borderRadius: 2,
            border: "1px solid rgba(29, 87, 88, 0.1)",
            bgcolor: "#fff",
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 2,
              mb: 2,
            }}
          >
            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontWeight: 800, mb: 0.5, color: "#111" }}>
                Applications by job
              </Typography>
              <Typography sx={{ color: "#6b7280", fontSize: "0.875rem" }}>
                Application count for each listed role.
              </Typography>
            </Box>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                display: "grid",
                placeItems: "center",
                bgcolor: "#E6F7F6",
                color: BRAND.primary,
                flexShrink: 0,
              }}
            >
              <AssignmentIndOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
          </Box>

          {jobApplicationRows.length === 0 ? (
            <Typography sx={{ color: "#9ca3af", fontSize: "0.9rem" }}>
              No jobs listed yet.
            </Typography>
          ) : (
            <Box>
              {[
                {
                  key: "published",
                  label: "Published",
                  hint: "Live on the careers page",
                  color: "#047857",
                  dot: "#10B981",
                  rows: jobApplicationRows.filter((job) => job.published),
                },
                {
                  key: "draft",
                  label: "Draft",
                  hint: "Not visible on the careers page",
                  color: "#B45309",
                  dot: "#F59E0B",
                  rows: jobApplicationRows.filter((job) => !job.published),
                },
              ]
                .filter((group) => group.rows.length > 0)
                .map((group, groupIndex) => (
                  <Box key={group.key} sx={{ mt: groupIndex === 0 ? 0 : 3 }}>
                    {/* Group heading: label + hint wrap onto two lines on phones */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        flexWrap: "wrap",
                        columnGap: 1,
                        rowGap: 0.25,
                        mb: 1.25,
                      }}
                    >
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          bgcolor: group.dot,
                          flexShrink: 0,
                        }}
                      />
                      <Typography
                        sx={{
                          fontWeight: 800,
                          fontSize: "0.82rem",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          color: group.color,
                        }}
                      >
                        {group.label} ({group.rows.length})
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.78rem",
                          color: "#9ca3af",
                          flexBasis: { xs: "100%", sm: "auto" },
                          pl: { xs: 2, sm: 0 },
                        }}
                      >
                        <Box component="span" sx={{ display: { xs: "none", sm: "inline" } }}>
                          ·{" "}
                        </Box>
                        {group.hint}
                      </Typography>
                      <Box
                        sx={{
                          display: { xs: "none", sm: "block" },
                          flex: 1,
                          height: "1px",
                          bgcolor: "#eef0f3",
                          ml: 1,
                        }}
                      />
                    </Box>

                    <Box
                      sx={{
                        display: "grid",
                        // minmax(0, 1fr) lets cards shrink to the screen width (no sideways overflow)
                        gridTemplateColumns: {
                          xs: "minmax(0, 1fr)",
                          sm: "repeat(2, minmax(0, 1fr))",
                          lg: "repeat(3, minmax(0, 1fr))",
                        },
                        gap: { xs: 1.25, sm: 1.5 },
                      }}
                    >
                      {group.rows.map((job) => (
                        <Link
                          key={job.jobSlug}
                          href={`/admin/applications?jobSlug=${encodeURIComponent(job.jobSlug)}`}
                          style={{
                            textDecoration: "none",
                            color: "inherit",
                            display: "block",
                            minWidth: 0,
                          }}
                        >
                          <Box
                            sx={{
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              gap: 1.5,
                              p: { xs: 1.5, sm: 1.75 },
                              borderRadius: 1.5,
                              transition:
                                "border-color 0.15s ease, background-color 0.15s ease",
                              // Published: soft green card. Draft: warm amber card.
                              ...(job.published
                                ? {
                                    border: "1px solid #A7F3D0",
                                    borderLeft: "4px solid #10B981",
                                    bgcolor: "#F0FDF7",
                                    "&:hover": {
                                      borderColor: "#10B981",
                                      bgcolor: "#DCFCE7",
                                    },
                                  }
                                : {
                                    border: "1px dashed #F5B94A",
                                    borderLeft: "4px solid #F59E0B",
                                    bgcolor: "#FFFBEB",
                                    "&:hover": {
                                      borderColor: "#F59E0B",
                                      bgcolor: "#FEF3C7",
                                    },
                                  }),
                            }}
                          >
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              {/* Title: up to 2 lines instead of being cut off */}
                              <Typography
                                title={job.jobTitle}
                                sx={{
                                  fontWeight: 700,
                                  color: "#111",
                                  fontSize: "0.9rem",
                                  lineHeight: 1.35,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  wordBreak: "break-word",
                                }}
                              >
                                {job.jobTitle}
                              </Typography>
                              <Box
                                sx={{
                                  mt: 0.6,
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 0.75,
                                  minWidth: 0,
                                }}
                              >
                                <Box
                                  component="span"
                                  sx={{
                                    flexShrink: 0,
                                    px: 0.8,
                                    py: 0.1,
                                    borderRadius: 999,
                                    fontSize: "0.64rem",
                                    fontWeight: 800,
                                    letterSpacing: "0.04em",
                                    textTransform: "uppercase",
                                    ...(job.published
                                      ? { bgcolor: "#D1FAE5", border: "1px solid #6EE7B7", color: "#047857" }
                                      : { bgcolor: "#FEF3C7", border: "1px solid #FCD34D", color: "#B45309" }),
                                  }}
                                >
                                  {job.published ? "Published" : "Draft"}
                                </Box>
                                {job.department ? (
                                  <Typography
                                    sx={{
                                      fontSize: "0.75rem",
                                      color: "#6b7280",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                      minWidth: 0,
                                    }}
                                  >
                                    {job.department}
                                  </Typography>
                                ) : null}
                              </Box>
                            </Box>

                            {/* Application count */}
                            <Box sx={{ flexShrink: 0, textAlign: "center" }}>
                              <Box
                                sx={{
                                  minWidth: 38,
                                  height: 38,
                                  px: 1,
                                  borderRadius: 999,
                                  display: "grid",
                                  placeItems: "center",
                                  bgcolor:
                                    job.count > 0
                                      ? "rgba(29, 87, 88, 0.1)"
                                      : "rgba(15, 17, 21, 0.05)",
                                  color: job.count > 0 ? BRAND.primary : "#6b7280",
                                  fontWeight: 800,
                                  fontSize: "0.92rem",
                                }}
                              >
                                {job.count}
                              </Box>
                              <Typography
                                sx={{
                                  mt: 0.25,
                                  fontSize: "0.62rem",
                                  fontWeight: 600,
                                  color: "#9ca3af",
                                  textTransform: "uppercase",
                                  letterSpacing: "0.04em",
                                }}
                              >
                                {job.count === 1 ? "App" : "Apps"}
                              </Typography>
                            </Box>
                          </Box>
                        </Link>
                      ))}
                    </Box>
                  </Box>
                ))}
            </Box>
          )}
        </Paper>
      ) : null}

      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2.5 },
          borderRadius: 2,
          border: "1px solid rgba(29, 87, 88, 0.1)",
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ fontWeight: 800, mb: 0.5, color: "#111" }}>
          Quick actions
        </Typography>
        <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 2 }}>
          Jump into common admin tasks.
        </Typography>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "minmax(0, 1fr)",
              sm: "repeat(2, minmax(0, 1fr))",
              lg: "repeat(4, minmax(0, 1fr))",
            },
            gap: 1.25,
          }}
        >
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none", display: "block", minWidth: 0 }}
            >
              <Button
                fullWidth
                endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
                sx={
                  item.primary
                    ? {
                        ...brandButtonSx,
                        fontWeight: 700,
                        px: 2,
                        py: 1,
                        justifyContent: "space-between",
                      }
                    : {
                        textTransform: "none",
                        fontWeight: 700,
                        color: BRAND.primary,
                        border: "1px solid rgba(29, 87, 88, 0.2)",
                        bgcolor: "#F5FCFB",
                        px: 2,
                        py: 1,
                        justifyContent: "space-between",
                        "&:hover": {
                          bgcolor: "#E6F7F6",
                          borderColor: "rgba(29, 87, 88, 0.35)",
                        },
                      }
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
