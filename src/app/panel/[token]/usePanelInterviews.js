"use client";

import { useCallback, useEffect, useState } from "react";

/** Load the panel member's interviews: { interviews, loading, error, reload } */
export default function usePanelInterviews(token) {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/panel/${encodeURIComponent(token)}/interviews`, { cache: "no-store" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || "Could not load your interviews");
      setInterviews(json.interviews || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    reload();
  }, [reload]);

  return { interviews, loading, error, reload };
}
