"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminResourceList from "../../components/AdminResourceList";

export default function AdminCaseStudiesPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/case-studies");
    if (!res.ok) {
      toast.error("Failed to load case studies");
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
    const res = await fetch(`/api/admin/case-studies/${row.id}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      toast.error("Delete failed");
      throw new Error("Delete failed");
    }
    toast.success("Case study deleted");
    await load();
  }

  return (
    <AdminResourceList
      title="Case Studies"
      description="Manage case studies shown on the marketing site."
      createHref="/admin/case-studies/new"
      createLabel="Add case study"
      rows={rows}
      loading={loading}
      editHref={(id) => `/admin/case-studies/${id}/edit`}
      onDelete={onDelete}
      emptyText="No case studies yet."
      deleteTitle="Delete this case study?"
      getDeleteDescription={(row) =>
        row
          ? `“${row.title}” will be permanently deleted.`
          : "This action cannot be undone."
      }
    />
  );
}
