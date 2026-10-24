import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function TrainingLayout({ children }) {
  await requirePageModule("/admin/training");
  return children;
}
