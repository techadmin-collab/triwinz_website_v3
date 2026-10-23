import { NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { requireAdmin } from "../../../../../lib/requireAdmin";
import {
  hashPassword,
  validatePassword,
  verifyPassword,
} from "../../../../../lib/password";

export async function PUT(req) {
  const { session, error } = await requireAdmin();
  if (error) return error;

  if (session.user.role === "superadmin") {
    return NextResponse.json(
      {
        error:
          "Super admin password is managed in environment variables (.env), not in the app.",
      },
      { status: 400 },
    );
  }

  const body = await req.json();
  const currentPassword = String(body.currentPassword || "");
  const newPassword = String(body.newPassword || "");

  const passwordError = validatePassword(newPassword);
  if (passwordError) {
    return NextResponse.json({ error: passwordError }, { status: 400 });
  }

  const user = await prisma.adminUser.findUnique({
    where: { id: session.user.id },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const ok = await verifyPassword(currentPassword, user.passwordHash);
  if (!ok) {
    return NextResponse.json(
      { error: "Current password is incorrect" },
      { status: 400 },
    );
  }

  const passwordHash = await hashPassword(newPassword);
  await prisma.adminUser.update({
    where: { id: user.id },
    data: { passwordHash },
  });

  return NextResponse.json({ ok: true, requireReLogin: true });
}
