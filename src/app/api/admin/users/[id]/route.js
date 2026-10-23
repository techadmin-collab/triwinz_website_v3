import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireModule } from "../../../../../lib/requireAdmin";
import {
  ALL_MODULE_KEYS,
  resolvePermissions,
  sanitizeUser,
} from "../../../../../lib/permissions";
import { hashPassword, validatePassword } from "../../../../../lib/password";

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

export async function GET(_req, { params }) {
  const { error } = await requireModule("users");
  if (error) return error;

  const { id } = await params;
  const user = await prisma.adminUser.findUnique({ where: { id } });
  if (!user) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(sanitizeUser(user));
}

export async function PUT(req, { params }) {
  const { session, error } = await requireModule("users");
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const name = String(body.name || "").trim();
  const email = normalizeEmail(body.email);
  const role = normalizeRole(body.role ?? existing.role);
  const active = body.active !== false;
  const permissions = normalizePermissions(
    role,
    body.permissions ?? existing.permissions,
  );

  if (!name || !email) {
    return NextResponse.json(
      { error: "Name and email are required" },
      { status: 400 },
    );
  }

  if (email === (process.env.ADMIN_EMAIL || "").toLowerCase()) {
    return NextResponse.json(
      { error: "That email is reserved for the super admin" },
      { status: 400 },
    );
  }

  if (
    existing.role === "admin" &&
    session.user.role !== "superadmin" &&
    session.user.id !== existing.id
  ) {
    // Non-superadmin admins can edit staff, and themselves, but not other admins' roles/status arbitrarily
  }

  if (role === "admin" && session.user.role !== "superadmin") {
    if (existing.role !== "admin") {
      return NextResponse.json(
        { error: "Only super admin can promote users to admin" },
        { status: 403 },
      );
    }
  }

  if (
    session.user.role !== "superadmin" &&
    existing.role === "admin" &&
    session.user.id !== existing.id
  ) {
    return NextResponse.json(
      { error: "Only super admin can edit other admin users" },
      { status: 403 },
    );
  }

  const emailTaken = await prisma.adminUser.findFirst({
    where: {
      email,
      NOT: { id },
    },
  });
  if (emailTaken) {
    return NextResponse.json(
      { error: "A user with this email already exists" },
      { status: 400 },
    );
  }

  const data = {
    name,
    email,
    role,
    permissions: resolvePermissions(role, permissions),
    active,
  };

  if (body.password) {
    const passwordError = validatePassword(body.password);
    if (passwordError) {
      return NextResponse.json({ error: passwordError }, { status: 400 });
    }
    data.passwordHash = await hashPassword(body.password);
  }

  try {
    const user = await prisma.adminUser.update({
      where: { id },
      data,
    });
    return NextResponse.json(sanitizeUser(user));
  } catch {
    return NextResponse.json({ error: "Update failed" }, { status: 400 });
  }
}

export async function DELETE(_req, { params }) {
  const { session, error } = await requireModule("users");
  if (error) return error;

  const { id } = await params;
  const existing = await prisma.adminUser.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (session.user.id === id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 },
    );
  }

  if (existing.role === "admin" && session.user.role !== "superadmin") {
    return NextResponse.json(
      { error: "Only super admin can delete admin users" },
      { status: 403 },
    );
  }

  try {
    await prisma.adminUser.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 400 });
  }
}
