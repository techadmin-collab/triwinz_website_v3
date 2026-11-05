// Browser side of Google reCAPTCHA v3. The script loads once, in the background;
// a fresh token is requested right when the visitor presses Submit.

export const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || "";

let loader = null;

function loadScript() {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"));
  if (window.grecaptcha?.execute) return Promise.resolve(window.grecaptcha);
  if (loader) return loader;

  loader = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(RECAPTCHA_SITE_KEY)}`;
    script.async = true;
    script.defer = true;
    const timer = setTimeout(() => reject(new Error("Captcha script timed out")), 15000);
    script.onload = () => {
      clearTimeout(timer);
      if (window.grecaptcha?.ready) window.grecaptcha.ready(() => resolve(window.grecaptcha));
      else reject(new Error("Captcha script loaded without grecaptcha"));
    };
    script.onerror = () => {
      clearTimeout(timer);
      reject(new Error("Captcha script failed to load"));
    };
    document.head.appendChild(script);
  }).catch((error) => {
    loader = null; // allow a retry on the next attempt
    throw error;
  });
  return loader;
}

/** Start loading early (e.g. when the form is shown). Errors are ignored here. */
export function preloadRecaptcha() {
  if (RECAPTCHA_SITE_KEY) loadScript().catch(() => {});
}

export class CaptchaError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code; // captcha_not_configured | captcha_load_failed | captcha_execute_failed
  }
}

/** Get a token for this action. Throws CaptchaError. */
export async function getRecaptchaToken(action) {
  if (!RECAPTCHA_SITE_KEY) {
    throw new CaptchaError("captcha_not_configured", "Captcha site key is missing");
  }
  let grecaptcha;
  try {
    grecaptcha = await loadScript();
  } catch (error) {
    throw new CaptchaError("captcha_load_failed", error?.message || "Captcha failed to load");
  }
  try {
    const token = await grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
    if (!token) throw new Error("Empty captcha token");
    return token;
  } catch (error) {
    // e.g. "Invalid domain for site key" when the domain isn't added in the reCAPTCHA console
    throw new CaptchaError(
      "captcha_execute_failed",
      error?.message || String(error || "Captcha could not run"),
    );
  }
}

/** Tell the server about a problem that only the browser can see. Never throws. */
export function reportClientIssue(source, code, detail) {
  try {
    const body = JSON.stringify({
      source,
      code,
      detail: String(detail || "").slice(0, 300),
      path: window.location.pathname,
    });
    if (navigator.sendBeacon) {
      const ok = navigator.sendBeacon("/api/report-issue", new Blob([body], { type: "application/json" }));
      if (ok) return;
    }
    fetch("/api/report-issue", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

/** Message to show the visitor for a CaptchaError (and report it). */
export function handleCaptchaError(error, source) {
  const code = error?.code || "captcha_execute_failed";
  reportClientIssue(source, code, error?.message);
  if (code === "captcha_load_failed") {
    return "Our security check couldn't load. Please disable any ad/script blocker for this site or check your connection, then try again.";
  }
  return "This form is temporarily unavailable. Please try again later or email us.";
}

export const RECAPTCHA_NOTICE =
  "This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply.";
