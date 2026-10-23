import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
import {
  getSuperAdminEmail,
  resolvePermissions,
} from "./permissions";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = String(credentials?.email || "")
          .trim()
          .toLowerCase();
        const password = String(credentials?.password || "");

        if (!email || !password) return null;

        const superEmail = getSuperAdminEmail();
        if (
          email === superEmail &&
          password === process.env.ADMIN_PASSWORD
        ) {
          return {
            id: "superadmin",
            name: "Super Admin",
            email: superEmail,
            role: "superadmin",
            permissions: ["*"],
          };
        }

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user || !user.active) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          permissions: resolvePermissions(user.role, user.permissions),
          pwdVer: user.passwordHash.slice(-16),
        };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.permissions = user.permissions;
        token.pwdVer = user.pwdVer || null;
        return token;
      }

      // Drop pre-permissions / corrupt cookies so they can't redirect-loop.
      if (!token?.role) {
        return null;
      }

      // Super admin is env-based — no DB password version to check.
      if (token.id === "superadmin" || token.role === "superadmin") {
        return token;
      }

      // Invalidate JWT when password changes (own change or admin reset).
      if (token.id) {
        const dbUser = await prisma.adminUser.findUnique({
          where: { id: String(token.id) },
          select: { active: true, passwordHash: true },
        });

        if (!dbUser || !dbUser.active) {
          return null;
        }

        const currentVer = dbUser.passwordHash.slice(-16);

        if (token.pwdVer && token.pwdVer !== currentVer) {
          return null;
        }

        if (!token.pwdVer) {
          token.pwdVer = currentVer;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (!token?.role) {
        return { ...session, user: undefined };
      }
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.permissions = token.permissions || [];
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
