import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function JobsLayout({ children }) {
  await requirePageModule("/admin/jobs");
  return children;
}
