import { requirePageModule } from "../../../../lib/requirePageModule";

// Admins only (see "content" in lib/permissions.js)
export default async function CaseStudiesLayout({ children }) {
  await requirePageModule("/admin/case-studies");
  return children;
}
