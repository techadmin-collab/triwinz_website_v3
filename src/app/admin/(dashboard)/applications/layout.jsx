import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function ApplicationsLayout({ children }) {
  await requirePageModule("/admin/applications");
  return children;
}
