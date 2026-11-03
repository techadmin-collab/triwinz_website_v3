"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-hot-toast";
import { Box, Tab, Tabs } from "@mui/material";
import AdminResourceList from "../../components/AdminResourceList";
import { BRAND } from "../../../../lib/brand";

const TABS = [
  { value: "published", label: "Published" },
  { value: "draft", label: "Draft" },
];

function CountBadge({ count, active }) {
  return (
    <Box
      component="span"
      sx={{
        ml: 1,
        minWidth: 22,
        px: 0.75,
        py: 0.1,
        borderRadius: 999,
        fontSize: "0.72rem",
        fontWeight: 700,
        lineHeight: 1.6,
        textAlign: "center",
        bgcolor: active ? BRAND.primary : "#eef0f3",
        color: active ? "#fff" : "#4b5563",
        transition: "background-color 0.2s ease, color 0.2s ease",
      }}
    >
      {count}
    </Box>
  );
}

export default function AdminJobsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("published");

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/jobs");
    if (!res.ok) {
      toast.error("Failed to load jobs");
      setLoading(false);
      return;
    }
    setRows(await res.json());
    setLoading(false);
  }

  useEffect(() => {
    load();
    // Remember the tab in the URL (?tab=draft) so it survives refresh / back
    const fromUrl = new URLSearchParams(window.location.search).get("tab");
    if (fromUrl === "draft" || fromUrl === "published") setTab(fromUrl);
  }, []);

  function changeTab(_, value) {
    setTab(value);
    const url = new URL(window.location.href);
    url.searchParams.set("tab", value);
    window.history.replaceState(null, "", url);
  }

  const published = useMemo(() => rows.filter((r) => r.published), [rows]);
  const drafts = useMemo(() => rows.filter((r) => !r.published), [rows]);
  const visibleRows = tab === "draft" ? drafts : published;

  async function onDelete(row) {
    const res = await fetch(`/api/admin/jobs/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      throw new Error("Delete failed");
    }
    toast.success("Job deleted");
    await load();
  }

  const tabs = (
    <Box sx={{ borderBottom: "1px solid #e8eaed", mb: 2 }}>
      <Tabs
        value={tab}
        onChange={changeTab}
        aria-label="Job status"
        sx={{
          minHeight: 44,
          "& .MuiTabs-indicator": {
            height: 3,
            borderRadius: "3px 3px 0 0",
            backgroundColor: BRAND.primary,
          },
        }}
      >
        {TABS.map((t) => (
          <Tab
            key={t.value}
            value={t.value}
            disableRipple
            label={
              <Box component="span" sx={{ display: "inline-flex", alignItems: "center" }}>
                {t.label}
                <CountBadge
                  count={t.value === "draft" ? drafts.length : published.length}
                  active={tab === t.value}
                />
              </Box>
            }
            sx={{
              minHeight: 44,
              px: 2,
              textTransform: "none",
              fontWeight: 700,
              fontSize: "0.92rem",
              color: "#6b7280",
              "&.Mui-selected": { color: BRAND.primary },
            }}
          />
        ))}
      </Tabs>
    </Box>
  );

  return (
    <AdminResourceList
      title="Jobs"
      description="Create and publish open roles for the careers pages."
      createHref="/admin/jobs/new"
      createLabel="Add job"
      rows={visibleRows}
      loading={loading}
      toolbar={tabs}
      editHref={(id) => `/admin/jobs/${id}/edit`}
      viewHref={(id) => `/admin/jobs/${id}`}
      onDelete={onDelete}
      emptyText={
        tab === "draft"
          ? "No draft jobs. Jobs you save without publishing will appear here."
          : "No published jobs yet. Published jobs appear on the careers page."
      }
      deleteTitle="Delete this job?"
      getDeleteDescription={(row) =>
        row
          ? `“${row.title}” will be permanently removed from the careers listing.`
          : "This action cannot be undone."
      }
    />
  );
}
