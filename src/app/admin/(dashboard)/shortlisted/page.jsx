"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { toast } from "react-hot-toast";
import AdminPageHeader from "../../components/AdminPageHeader";
import { BRAND } from "../../../../lib/brand";

export default function ShortlistedJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch("/api/admin/applications/shortlisted");
      if (!res.ok) {
        toast.error("Failed to load shortlisted jobs");
        setLoading(false);
        return;
      }
      const data = await res.json();
      setJobs(data.jobs || []);
      setTotal(data.total || 0);
      setLoading(false);
    }

    load();
  }, []);

  return (
    <Box>
      <AdminPageHeader
        title="Review shortlisted"
        description="Choose a job to review candidates marked as shortlisted."
      />

      {loading ? (
        <Box sx={{ py: 10, textAlign: "center" }}>
          <CircularProgress size={28} sx={{ color: BRAND.primary }} />
        </Box>
      ) : jobs.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 6,
            textAlign: "center",
            borderRadius: 2,
            border: "1px solid #e8eaed",
            bgcolor: "#fff",
          }}
        >
          <Typography sx={{ fontWeight: 700, color: "#111", mb: 1 }}>
            No shortlisted applications yet
          </Typography>
          <Typography color="text.secondary">
            Shortlist candidates from the applications page to review them here.
          </Typography>
        </Paper>
      ) : (
        <>
          <Typography sx={{ color: "#6b7280", mb: 2, fontSize: "0.9rem" }}>
            {total} shortlisted candidate{total === 1 ? "" : "s"} across{" "}
            {jobs.length} job{jobs.length === 1 ? "" : "s"}
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {jobs.map((job) => (
              <Link
                key={job.jobSlug}
                href={`/admin/shortlisted/${job.jobSlug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <Paper
                  elevation={0}
                  sx={{
                    height: "100%",
                    p: 2.5,
                    borderRadius: 2,
                    border: "1px solid #e8eaed",
                    bgcolor: "#fff",
                    transition:
                      "border-color 0.15s ease, box-shadow 0.15s ease, transform 0.15s ease",
                    "&:hover": {
                      borderColor: "#c9ced6",
                      boxShadow: "0 8px 24px rgba(15, 17, 21, 0.06)",
                      transform: "translateY(-2px)",
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
                    bgcolor: "#f5f0ff",
                    color: BRAND.primary,
                    mb: 2,
                  }}
                >
                  <WorkOutlineIcon sx={{ fontSize: 20 }} />
                </Box>

                  <Typography
                    fontWeight={700}
                    sx={{ color: "#111", mb: 2, fontSize: "1.05rem" }}
                  >
                    {job.jobTitle}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 800,
                        color: BRAND.primary,
                        fontSize: "1.5rem",
                      }}
                    >
                      {job.count}
                    </Typography>
                    <Box
                      sx={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 0.5,
                        color: "#6b7280",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      Review
                      <ArrowForwardIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                </Paper>
              </Link>
            ))}
          </Box>
        </>
      )}
    </Box>
  );
}
