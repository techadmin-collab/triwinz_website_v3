import bcrypt from "bcryptjs";

export const MIN_PASSWORD_LENGTH = 8;

export function validatePassword(password) {
  const value = String(password || "");
  if (value.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
  }
  return null;
}

export async function hashPassword(password) {
  return bcrypt.hash(String(password), 10);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(String(password), String(passwordHash || ""));
}
