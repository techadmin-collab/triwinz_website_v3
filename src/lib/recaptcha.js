import { reportIssue } from "./reportIssue";

// Google reCAPTCHA v3 (invisible, score based) — server-side check.
// Env: RECAPTCHA_SECRET_KEY (Secret), optional RECAPTCHA_MIN_SCORE (default 0.5).
// The browser side uses NEXT_PUBLIC_RECAPTCHA_SITE_KEY (see lib/recaptchaClient.js).

const VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

function minScore() {
  const value = Number(process.env.RECAPTCHA_MIN_SCORE);
  return Number.isFinite(value) && value >= 0 && value <= 1 ? value : 0.5;
}

/**
 * @returns {Promise<{ ok: boolean, reason?: string, score?: number, errorCodes?: string[] }>}
 * reason: not_configured | missing_token | invalid_secret | invalid_token |
 *         action_mismatch | low_score | unreachable
 */
export async function verifyRecaptcha(token, { action, remoteip } = {}) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: false, reason: "not_configured" };
  if (!token || typeof token !== "string") return { ok: false, reason: "missing_token" };

  const body = new URLSearchParams({ secret, response: token });
  if (remoteip) body.set("remoteip", remoteip);

  let data;
  try {
    const res = await fetch(VERIFY_URL, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    data = await res.json();
  } catch (error) {
    return { ok: false, reason: "unreachable", errorCodes: [String(error?.message || error)] };
  }

  const errorCodes = data?.["error-codes"] || [];
  if (!data?.success) {
    if (errorCodes.some((c) => c.includes("secret"))) {
      return { ok: false, reason: "invalid_secret", errorCodes };
    }
    return { ok: false, reason: "invalid_token", errorCodes };
  }
  if (action && data.action && data.action !== action) {
    return { ok: false, reason: "action_mismatch", score: data.score, errorCodes };
  }
  if (typeof data.score === "number" && data.score < minScore()) {
    return { ok: false, reason: "low_score", score: data.score, errorCodes };
  }
  return { ok: true, score: data.score };
}

const ISSUES = {
  not_configured: {
    severity: "error",
    title: "Captcha is not configured on the server (RECAPTCHA_SECRET_KEY is missing). Nobody can submit this form.",
    userMessage: "This form is temporarily unavailable. Please try again later or email us.",
    status: 503,
  },
  invalid_secret: {
    severity: "error",
    title: "Google rejected the captcha secret key (RECAPTCHA_SECRET_KEY is wrong). Nobody can submit this form.",
    userMessage: "This form is temporarily unavailable. Please try again later or email us.",
    status: 503,
  },
  unreachable: {
    severity: "error",
    title: "Could not reach Google to verify the captcha.",
    userMessage: "We couldn't verify your submission. Please try again in a moment.",
    status: 503,
  },
  missing_token: {
    severity: "warning",
    title: "A submission arrived without a captcha token.",
    userMessage: "Captcha verification failed. Please refresh the page and try again.",
    status: 400,
  },
  invalid_token: {
    severity: "warning",
    title: "Captcha token was rejected (expired, reused, or from a different site key).",
    userMessage: "Captcha verification failed. Please refresh the page and try again.",
    status: 400,
  },
  action_mismatch: {
    severity: "warning",
    title: "Captcha token was created for a different form.",
    userMessage: "Captcha verification failed. Please refresh the page and try again.",
    status: 400,
  },
  low_score: {
    severity: "warning",
    title: "A submission was blocked because Google rated it as likely automated (low captcha score).",
    userMessage:
      "We couldn't verify your submission. Please try again, or email us if this keeps happening.",
    status: 400,
  },
};

/**
 * Verify, and when it fails record a System issue.
 * Returns null when OK, otherwise { status, error } to send back to the browser.
 */
export async function checkRecaptcha(req, { token, action, source, context }) {
  const remoteip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const result = await verifyRecaptcha(token, { action, remoteip });
  if (result.ok) return null;

  const issue = ISSUES[result.reason] || ISSUES.invalid_token;
  await reportIssue({
    source,
    code: `captcha_${result.reason}`,
    severity: issue.severity,
    title: issue.title,
    context: {
      ...context,
      ...(typeof result.score === "number" ? { score: result.score } : {}),
      ...(result.errorCodes?.length ? { googleErrorCodes: result.errorCodes.join(", ") } : {}),
    },
  });
  return { status: issue.status, error: issue.userMessage };
}
