import { requirePageModule } from "../../../../lib/requirePageModule";

// Admins only (see "content" in lib/permissions.js)
export default async function BlogsLayout({ children }) {
  await requirePageModule("/admin/blogs");
  return children;
}
