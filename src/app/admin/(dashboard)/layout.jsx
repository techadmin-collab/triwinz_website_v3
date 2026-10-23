import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../../lib/auth";
import AdminProviders from "../components/AdminProviders";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    redirect("/admin/login");
  }

  return (
    <AdminProviders session={session}>{children}</AdminProviders>
  );
}
