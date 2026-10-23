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
  return Boolean(data?.success);
}
