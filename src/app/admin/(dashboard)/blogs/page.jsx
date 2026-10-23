"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import AdminResourceList from "../../components/AdminResourceList";

export default function AdminBlogsPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/blogs");
    if (!res.ok) {
      toast.error("Failed to load blogs");
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
    const res = await fetch(`/api/admin/blogs/${row.id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      throw new Error("Delete failed");
    }
    toast.success("Blog deleted");
    await load();
  }

  return (
    <AdminResourceList
      title="Blogs"
      description="Write and publish blog posts for the website."
      createHref="/admin/blogs/new"
      createLabel="Add blog"
      rows={rows}
      loading={loading}
      editHref={(id) => `/admin/blogs/${id}/edit`}
      onDelete={onDelete}
      emptyText="No blogs yet. Create your first post."
      deleteTitle="Delete this blog?"
      getDeleteDescription={(row) =>
        row
          ? `“${row.title}” will be permanently deleted.`
          : "This action cannot be undone."
      }
    />
  );
}
