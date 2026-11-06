// Server-only helpers for the interview panel's private availability link.
import crypto from "crypto";
import { NextResponse } from "next/server";
import { prisma } from "./prisma";

const TOKEN_RE = /^[A-Za-z0-9_-]{24,64}$/;

export function newPortalToken() {
  return crypto.randomBytes(24).toString("base64url"); // 32 characters, not guessable
}

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    "https://www.triwinz.com"
  ).replace(/\/$/, "");
}

export function portalUrl(token) {
  return `${siteUrl()}/panel/${token}`;
}

/** The active interviewer this link belongs to, or null. */
export async function interviewerForToken(token) {
  if (typeof token !== "string" || !TOKEN_RE.test(token)) return null;
  const interviewer = await prisma.interviewer.findFirst({ where: { portalToken: token } });
  if (!interviewer || !interviewer.active) return null;
  return interviewer;
}

export function invalidLinkResponse() {
  return NextResponse.json(
    { error: "This link is no longer valid. Please ask the TriWinz team for a new one." },
    { status: 404 },
  );
}

/** For panel API routes: { interviewer } or { error: Response } */
export async function requirePanel(params) {
  const { token } = await params;
  if (!prisma.interviewerSlot || !prisma.interviewFeedback) {
    return {
      error: NextResponse.json(
        { error: "This page is being updated. Please try again in a few minutes." },
        { status: 503 },
      ),
    };
  }
  const interviewer = await interviewerForToken(token);
  if (!interviewer) return { error: invalidLinkResponse() };
  return { interviewer };
}
