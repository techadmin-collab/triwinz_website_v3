import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function InterviewsLayout({ children }) {
  await requirePageModule("/admin/interviews");
  return children;
}
