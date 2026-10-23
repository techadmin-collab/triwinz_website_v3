export const dynamic = "force-dynamic";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
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

  const [
    jobs,
    newApplications,
    shortlistedApplications,
    selectedApplications,
    jobsList,
    applicationsByJob,
  ] = await Promise.all([
    prisma.job.count(),
    prisma.jobApplication.count({ where: { status: "new" } }),
    prisma.jobApplication.count({
      where: { status: { in: ["shortlisted", "reviewed"] } },
    }),
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

  const cards = [
    {
      label: "New applications",
      count: newApplications,
      href: "/admin/applications?status=new",
      icon: FiberNewOutlinedIcon,
      tone: "#f5f0ff",
      iconColor: BRAND.primary,
      module: "applications",
    },
    {
      label: "Shortlisted applications",
      count: shortlistedApplications,
      href: "/admin/shortlisted",
      icon: StarOutlineIcon,
      tone: "#fdf2f8",
      iconColor: BRAND.accent,
      module: "applications",
    },
    {
      label: "Selected applications",
      count: selectedApplications,
      href: "/admin/applications?status=selected",
      icon: CheckCircleOutlineIcon,
      tone: "#ecfdf5",
      iconColor: "#047857",
      module: "applications",
    },
    {
      label: "Jobs listed",
      count: jobs,
      href: "/admin/jobs",
      icon: WorkOutlineIcon,
      tone: "#f5f3ff",
      iconColor: "#6d28d9",
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 3,
        }}
      >
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Paper
                elevation={0}
                sx={{
                  height: "100%",
                  p: 2.5,
                  borderRadius: 2,
                  border: "1px solid rgba(80, 20, 210, 0.1)",
                  bgcolor: "#fff",
                  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  "&:hover": {
                    borderColor: "rgba(80, 20, 210, 0.28)",
                    boxShadow: "0 8px 24px rgba(80, 20, 210, 0.08)",
                  },
                }}
              >
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    display: "grid",
                    placeItems: "center",
                    bgcolor: card.tone,
                    color: card.iconColor,
                    mb: 2,
                  }}
                >
                  <Icon sx={{ fontSize: 20 }} />
                </Box>
                <Typography
                  sx={{ color: "#6b7280", fontSize: "0.85rem", fontWeight: 600 }}
                >
                  {card.label}
                </Typography>
                <Typography
                  sx={{
                    mt: 0.5,
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "#111",
                    lineHeight: 1.1,
                  }}
                >
                  {card.count}
                </Typography>
                <Typography sx={{ mt: 1, fontSize: "0.8rem", color: "#9ca3af" }}>
                  View
                </Typography>
              </Paper>
            </Link>
          );
        })}
      </Box>

      {canViewApplications ? (
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            border: "1px solid rgba(80, 20, 210, 0.1)",
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
            <Box>
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
                bgcolor: "#f5f0ff",
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
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 1.5,
              }}
            >
              {jobApplicationRows.map((job) => (
                <Link
                  key={job.jobSlug}
                  href={`/admin/applications?jobSlug=${encodeURIComponent(job.jobSlug)}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: 1.5,
                      p: 1.75,
                      borderRadius: 1.5,
                      border: "1px solid #eef0f3",
                      bgcolor: "#fafafa",
                      transition:
                        "border-color 0.15s ease, background-color 0.15s ease",
                      "&:hover": {
                        borderColor: "rgba(80, 20, 210, 0.25)",
                        bgcolor: "#faf8ff",
                      },
                    }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 700,
                          color: "#111",
                          fontSize: "0.9rem",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {job.jobTitle}
                      </Typography>
                      <Typography
                        sx={{
                          mt: 0.25,
                          fontSize: "0.75rem",
                          color: "#9ca3af",
                        }}
                      >
                        {job.department}
                        {job.published ? "" : " · Draft"}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        minWidth: 36,
                        height: 36,
                        px: 1,
                        borderRadius: 999,
                        display: "grid",
                        placeItems: "center",
                        bgcolor:
                          job.count > 0
                            ? "rgba(80, 20, 210, 0.1)"
                            : "#f3f4f6",
                        color: job.count > 0 ? BRAND.primary : "#6b7280",
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        flexShrink: 0,
                      }}
                    >
                      {job.count}
                    </Box>
                  </Box>
                </Link>
              ))}
            </Box>
          )}
        </Paper>
      ) : null}

      <Paper
        elevation={0}
        sx={{
          p: 2.5,
          borderRadius: 2,
          border: "1px solid rgba(80, 20, 210, 0.1)",
          bgcolor: "#fff",
        }}
      >
        <Typography sx={{ fontWeight: 800, mb: 0.5, color: "#111" }}>
          Quick actions
        </Typography>
        <Typography sx={{ color: "#6b7280", fontSize: "0.875rem", mb: 2 }}>
          Jump into common admin tasks.
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          {quickLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: "none", flex: 1 }}
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
                        border: "1px solid rgba(80, 20, 210, 0.2)",
                        bgcolor: "#faf8ff",
                        px: 2,
                        py: 1,
                        justifyContent: "space-between",
                        "&:hover": {
                          bgcolor: "#f5f0ff",
                          borderColor: "rgba(80, 20, 210, 0.35)",
                        },
                      }
                }
              >
                {item.label}
              </Button>
            </Link>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}
