import { NextResponse } from "next/server";
import { reportIssue } from "../../../lib/reportIssue";

// Public endpoint the forms call when something fails in the visitor's browser
// (captcha didn't load, network dropped). Only known sources/codes are accepted,
// and repeats are grouped, so it can't be used to fill the database.

const SOURCES = ["job-application", "training-application", "contact"];

const CODES = {
  captcha_not_configured: {
    severity: "error",
    title: "Captcha site key is missing in the website build (NEXT_PUBLIC_RECAPTCHA_SITE_KEY). Nobody can submit this form.",
  },
  captcha_execute_failed: {
    severity: "error",
    title: "Captcha could not run in visitors' browsers (often: this domain isn't added to the reCAPTCHA key).",
  },
  captcha_load_failed: {
    severity: "warning",
    title: "Captcha script failed to load for a visitor (ad blocker or network).",
  },
  server_error: {
    severity: "error",
    title: "The server returned an error page instead of a response (hosting timeout or crash, e.g. on Vercel).",
  },
  network_error: {
    severity: "warning",
    title: "A visitor's submission didn't reach the server (network error or timeout).",
  },
};

export async function POST(req) {
  try {
    const body = await req.json().catch(() => ({}));
    const source = String(body.source || "");
    const code = String(body.code || "");
    const def = CODES[code];
    if (!SOURCES.includes(source) || !def) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }
    await reportIssue({
      source,
      code: `client_${code}`,
      severity: def.severity,
      title: def.title,
      context: {
        message: String(body.detail || "").slice(0, 300),
        page: String(body.path || "").slice(0, 200),
        browser: String(req.headers.get("user-agent") || "").slice(0, 200),
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
