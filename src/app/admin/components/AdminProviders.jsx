"use client";

import { SessionProvider } from "next-auth/react";
import AdminShell from "./AdminShell";

export default function AdminProviders({ children, session }) {
  return (
    // Re-check the session every minute and when the tab regains focus,
    // so permission changes show up in the sidebar without logging out.
    <SessionProvider session={session} refetchInterval={60} refetchOnWindowFocus>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
