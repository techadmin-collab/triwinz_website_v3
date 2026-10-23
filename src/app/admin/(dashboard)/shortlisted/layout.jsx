import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function ShortlistedLayout({ children }) {
  await requirePageModule("/admin/shortlisted");
  return children;
}
