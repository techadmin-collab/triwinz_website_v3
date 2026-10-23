import { requirePageModule } from "../../../../lib/requirePageModule";

export default async function ContactsLayout({ children }) {
  await requirePageModule("/admin/contacts");
  return children;
}
