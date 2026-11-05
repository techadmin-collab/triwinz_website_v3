export const ALL_MODULE_KEYS = [
  "dashboard",
  "jobs",
  "applications",
  "interviews",
  "training",
  "contacts",
  "team",
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
    key: "interviews",
    label: "Interviews",
    href: "/admin/interviews",
    pathPrefixes: ["/admin/interviews"],
  },
  {
    key: "training",
    label: "Training",
    href: "/admin/training",
    pathPrefixes: ["/admin/training"],
  },
  {
    key: "contacts",
    label: "Contacts",
    href: "/admin/contacts",
    pathPrefixes: ["/admin/contacts"],
  },
  {
    key: "team",
    label: "Team",
    href: "/admin/team",
    pathPrefixes: ["/admin/team"],
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
  if (pathname.startsWith("/admin/interviews")) return "interviews";
  if (pathname.startsWith("/admin/training")) return "training";
  if (pathname.startsWith("/admin/contacts")) return "contacts";
  if (pathname.startsWith("/admin/team")) return "team";
  // Blogs and case studies are not in the sidebar or the staff permission list:
  // "content" is never granted to staff, so only admins can open them.
  if (
    pathname.startsWith("/admin/blogs") ||
    pathname.startsWith("/admin/case-studies")
  ) {
    return "content";
  }
  // System issues: same rule as "content", admins only.
  if (pathname.startsWith("/admin/system-issues")) return "system";
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
