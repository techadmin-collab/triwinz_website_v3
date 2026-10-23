"use client";

import { SessionProvider } from "next-auth/react";
import AdminShell from "./AdminShell";

export default function AdminProviders({ children, session }) {
  return (
    <SessionProvider session={session}>
      <AdminShell>{children}</AdminShell>
    </SessionProvider>
  );
}
