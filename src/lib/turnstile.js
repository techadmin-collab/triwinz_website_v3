/**
 * Verify a Cloudflare Turnstile token server-side.
 * @param {string} token
 * @param {string} [remoteip]
 * @returns {Promise<boolean>}
 */
export async function verifyTurnstileToken(token, remoteip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error("TURNSTILE_SECRET_KEY is not set");
    return false;
  }

  if (!token || typeof token !== "string") {
    return false;
  }

  const body = new URLSearchParams({
    secret,
    response: token,
  });

  if (remoteip) {
    body.set("remoteip", remoteip);
  }

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
    },
  );

  const data = await res.json().catch(() => null);
  if (!data?.success) {
    // Shows up in Vercel -> Logs. Common codes:
    //  invalid-input-secret   -> TURNSTILE_SECRET_KEY is wrong / from another widget
    //  invalid-input-response -> token is from a different site key (keys don't match)
    //  timeout-or-duplicate   -> token expired or was already used
    console.error("Turnstile verification failed:", {
      status: res.status,
      errorCodes: data?.["error-codes"],
      hostname: data?.hostname,
    });
  }
  return Boolean(data?.success);
}
