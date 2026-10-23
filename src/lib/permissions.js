export const ALL_MODULE_KEYS = [
  "dashboard",
  "jobs",
  "applications",
  "contacts",
  "users",
];

export const ADMIN_MODULES = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/admin",
    pathPrefixes: ["/admin"],
    exact: true,
  },
  {
    key: "jobs",
    label: "Jobs",
    href: "/admin/jobs",
    pathPrefixes: ["/admin/jobs"],
  },
  {
    key: "applications",
    label: "Applications",
    href: "/admin/applications",
    pathPrefixes: ["/admin/applications", "/admin/shortlisted"],
  },
  {
    key: "contacts",
    label: "Contacts",
    href: "/admin/contacts",
    pathPrefixes: ["/admin/contacts"],
  },
  {
    key: "users",
    label: "Users",
    href: "/admin/users",
    pathPrefixes: ["/admin/users"],
  },
];

export function getSuperAdminEmail() {
  return (process.env.ADMIN_EMAIL || "superadmin@triwinz.com").toLowerCase();
}

export function isSuperAdminSession(session) {
  return session?.user?.role === "superadmin";
}

export function isAdminSession(session) {
  const role = session?.user?.role;
  return role === "superadmin" || role === "admin";
}

export function resolvePermissions(role, permissions = []) {
  if (role === "superadmin" || role === "admin") {
    return [...ALL_MODULE_KEYS];
  }
  return (permissions || []).filter((key) => ALL_MODULE_KEYS.includes(key));
}

export function hasModuleAccess(session, moduleKey) {
  if (!session?.user) return false;
  if (session.user.role === "superadmin" || session.user.role === "admin") {
    return true;
  }
  if (session.user.permissions?.includes("*")) return true;
  return (session.user.permissions || []).includes(moduleKey);
}

export function getModuleKeyForPath(pathname) {
  if (!pathname) return null;
  // Account is always allowed for any authenticated admin user.
  if (pathname.startsWith("/admin/account")) return null;
  if (pathname === "/admin" || pathname === "/admin/") return "dashboard";
  if (pathname.startsWith("/admin/users")) return "users";
  if (pathname.startsWith("/admin/jobs")) return "jobs";
  if (
    pathname.startsWith("/admin/applications") ||
    pathname.startsWith("/admin/shortlisted")
  ) {
    return "applications";
  }
  if (pathname.startsWith("/admin/contacts")) return "contacts";
  return null;
}

export function hasAnyModuleAccess(session) {
  return ADMIN_MODULES.some((module) => hasModuleAccess(session, module.key));
}

export function getFirstAllowedHref(session) {
  for (const module of ADMIN_MODULES) {
    if (hasModuleAccess(session, module.key)) return module.href;
  }
  // Never send authenticated users back to /admin/login — that causes a redirect loop.
  return "/admin/account";
}

export function sanitizeUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    permissions: resolvePermissions(user.role, user.permissions),
    active: user.active,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}
