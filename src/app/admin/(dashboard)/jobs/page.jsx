"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminResourceList from "../../components/AdminResourceList";

export default function AdminJobsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  async function onDelete(row) {
    const res = await fetch(`/api/admin/jobs/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      throw new Error("Delete failed");
    }
    toast.success("Job deleted");
    await load();
  }

  return (
    <AdminResourceList
      title="Jobs"
      description="Create and publish open roles for the careers pages."
      createHref="/admin/jobs/new"
      createLabel="Add job"
      rows={rows}
      loading={loading}
      editHref={(id) => `/admin/jobs/${id}/edit`}
      viewHref={(id) => `/admin/jobs/${id}`}
      onDelete={onDelete}
      emptyText="No jobs yet."
      deleteTitle="Delete this job?"
      getDeleteDescription={(row) =>
        row
          ? `“${row.title}” will be permanently removed from the careers listing.`
          : "This action cannot be undone."
      }
    />
  );
}
