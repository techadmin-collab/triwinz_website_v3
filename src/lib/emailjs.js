export async function sendEmailJs({
  templateId,
  templateParams,
  serviceId,
  publicKey,
  privateKey,
}) {
  const resolvedServiceId = serviceId ?? process.env.EMAILJS_SERVICE_ID;
  const resolvedPublicKey = publicKey ?? process.env.EMAILJS_PUBLIC_KEY;
  const resolvedPrivateKey = privateKey ?? process.env.EMAILJS_PRIVATE_KEY;

  if (!resolvedServiceId || !templateId || !resolvedPublicKey) {
    throw new Error("Email service is not configured");
  }

  if (!resolvedPrivateKey) {
    throw new Error(
      "EmailJS private key is missing. Generate a private key in EmailJS → Account → API Keys and add it to .env.",
    );
  }

  const payload = {
    service_id: resolvedServiceId,
    template_id: templateId,
    user_id: resolvedPublicKey,
    accessToken: resolvedPrivateKey,
    template_params: templateParams,
  };

  const response = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const detail = await response.text();

    if (detail.includes("non-browser environments")) {
      throw new Error(
        "EmailJS blocked this server request. In EmailJS → Account → Security, enable “Allow EmailJS API for non-browser applications”, then restart the dev server.",
      );
    }

    throw new Error(detail || "EmailJS send failed");
  }

  return true;
}
