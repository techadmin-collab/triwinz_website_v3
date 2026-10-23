import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";
import {
  getFirstAllowedHref,
  getModuleKeyForPath,
  hasModuleAccess,
} from "./permissions";

export async function requirePageModule(pathname) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    redirect("/admin/login");
  }

  const moduleKey = getModuleKeyForPath(pathname);
  if (moduleKey && !hasModuleAccess(session, moduleKey)) {
    redirect(getFirstAllowedHref(session));
  }

  return session;
}
