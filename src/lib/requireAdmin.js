import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "./auth";
import { hasModuleAccess } from "./permissions";

export async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.role) {
    return {
      session: null,
      error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { session, error: null };
}

export async function requireModule(moduleKey) {
  const result = await requireAdmin();
  if (result.error) return result;

  if (!hasModuleAccess(result.session, moduleKey)) {
    return {
      session: result.session,
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return result;
}
