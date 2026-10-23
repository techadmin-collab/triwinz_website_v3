/** Characters Cloudinary rejects in public_id (among others). */
const INVALID_FILENAME_CHARS = /[?&#\\/%<>]/;

export const RESUME_FILENAME_ERROR =
  "Resume file name cannot contain special characters such as & # % ? / \\ < >. Please rename your file and try again.";

export function getResumeFileNameError(fileName) {
  if (!fileName || typeof fileName !== "string") {
    return "Please upload your resume";
  }

  if (INVALID_FILENAME_CHARS.test(fileName)) {
    return RESUME_FILENAME_ERROR;
  }

  return null;
}

export function truncateText(text, maxLength = 25, emptyFallback = "—") {
  if (!text) return emptyFallback;
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function truncateResumeFileName(fileName, maxLength = 25) {
  return truncateText(fileName, maxLength, "View resume");
}
