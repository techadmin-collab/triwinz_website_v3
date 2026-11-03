import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function TeamLayout({ children }) {
  await requirePageModule("/admin/team");
  return children;
}
