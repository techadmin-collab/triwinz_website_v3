// Helpers that make file uploads from the public forms more reliable,
// especially on Android phones (files chosen from Google Drive, WhatsApp, Downloads...).

export const FILE_UNREADABLE_MESSAGE =
  "We couldn't read this file. Please save it to your phone or computer first (not straight from Google Drive, WhatsApp or another app), then choose it again.";

export const NETWORK_FAILED_MESSAGE =
  "We couldn't send your application. Please check your internet connection and try again. Your details are still filled in.";

const READ_TIMEOUT_MS = 15000;

export class FileUnreadableError extends Error {}

/**
 * Copy the chosen file into memory right away. Android Chrome can lose access to a file
 * picked from another app before the form is sent ("Failed to fetch"); a copy in memory
 * can't change or disappear, and if it can't be read we can tell the visitor straight away.
 */
export async function readFileIntoMemory(file) {
  if (!file) throw new FileUnreadableError("No file");
  if (file.size === 0) throw new FileUnreadableError("The file is empty (0 bytes)");
  let buffer;
  try {
    buffer = await Promise.race([
      file.arrayBuffer(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Reading the file timed out")), READ_TIMEOUT_MS)),
    ]);
  } catch (error) {
    throw new FileUnreadableError(error?.message || "The file could not be read");
  }
  if (!buffer || buffer.byteLength === 0) throw new FileUnreadableError("The file came back empty");
  return new File([buffer], file.name, {
    type: file.type || guessType(file.name),
    lastModified: file.lastModified || Date.now(),
  });
}

function guessType(name = "") {
  const ext = name.toLowerCase().split(".").pop();
  if (ext === "pdf") return "application/pdf";
  if (ext === "doc") return "application/msword";
  if (ext === "docx") return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  return "application/octet-stream";
}

/** "resume.pdf · 120 KB · application/pdf" (for problem reports) */
export function describeFile(file) {
  if (!file) return "no file";
  const kb = Math.max(1, Math.round((file.size || 0) / 1024));
  return `${file.name} · ${kb} KB · ${file.type || "unknown type"}`;
}

/** "online · 4g" (for problem reports) */
export function connectionInfo() {
  if (typeof navigator === "undefined") return "";
  const online = navigator.onLine === false ? "offline" : "online";
  const type = navigator.connection?.effectiveType;
  const saveData = navigator.connection?.saveData ? " · data saver on" : "";
  return `${online}${type ? ` · ${type}` : ""}${saveData}`;
}

export class NetworkFailedError extends Error {
  constructor(message, attempts) {
    super(message);
    this.attempts = attempts;
  }
}

/**
 * POST a form, trying once more if the connection drops.
 * makeBody() is called for every attempt so each one sends a fresh FormData.
 * Resolves with the Response (any HTTP status); throws NetworkFailedError if nothing got through.
 */
export async function postWithRetry(url, makeBody, { retries = 1, delayMs = 1500 } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      return await fetch(url, { method: "POST", body: makeBody() });
    } catch (error) {
      lastError = error;
      if (attempt <= retries) await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  throw new NetworkFailedError(lastError?.message || "Network request failed", retries + 1);
}
