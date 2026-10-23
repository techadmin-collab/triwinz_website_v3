import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { requireModule } from "../../../../lib/requireAdmin";
import {
  ALL_MODULE_KEYS,
  resolvePermissions,
  sanitizeUser,
} from "../../../../lib/permissions";
import { hashPassword, validatePassword } from "../../../../lib/password";

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizeRole(role) {
  return role === "admin" ? "admin" : "staff";
}

function normalizePermissions(role, permissions) {
  if (role === "admin") return [...ALL_MODULE_KEYS];
  if (!Array.isArray(permissions)) return [];
  return permissions.filter((key) => ALL_MODULE_KEYS.includes(key));
}

export async function GET() {
  const { error } = await requireModule("users");
  if (error) return error;

  const users = await prisma.adminUser.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users.map(sanitizeUser));
}

export async function POST(req) {
  const { session, error } = await requireModule("users");
  if (error) return error;

  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = normalizeEmail(body.email);
  const password = String(body.password || "");
  const role = normalizeRole(body.role);
  const active = body.active !== false;
  const permissions = normalizePermissions(role, body.permissions);

  if (!name || !email || !password) {
    return NextResponse.json(
      { error: "Name, email, and password are required" },
      { status: 400 },
    );
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  if (email === (process.env.ADMIN_EMAIL || "").toLowerCase()) {
    return NextResponse.json(
      { error: "That email is reserved for the super admin" },
      { status: 400 },
    );
  }

  // Only superadmin can create other admins
  if (role === "admin" && session.user.role !== "superadmin") {
    return NextResponse.json(
      { error: "Only super admin can create admin users" },
      { status: 403 },
    );
  }

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(password);
  const user = await prisma.adminUser.create({
    data: {
      name,
      email,
      passwordHash,
      role,
      permissions: resolvePermissions(role, permissions),
      active,
    },
  });

  return NextResponse.json(sanitizeUser(user), { status: 201 });
}
