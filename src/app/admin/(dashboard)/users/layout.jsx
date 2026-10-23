import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function UsersLayout({ children }) {
  await requirePageModule("/admin/users");
  return children;
}
