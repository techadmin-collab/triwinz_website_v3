import { requirePageModule } from "../../../../lib/requirePageModule";

// Admins only (see "system" in lib/permissions.js)
export default async function SystemIssuesLayout({ children }) {
  await requirePageModule("/admin/system-issues");
  return children;
}
