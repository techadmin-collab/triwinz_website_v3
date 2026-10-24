// Shared validation for the Training Program application form.
// Used by the client form (inline errors) and the API route (server-side check).

export const QUALIFICATIONS = [
  "B.Tech / B.E.",
  "M.Tech / M.E.",
  "BCA",
  "MCA",
  "B.Sc (Computer Science / IT)",
  "M.Sc (Computer Science / IT)",
  "Diploma",
  "Other",
];

export const RESUME_MAX_BYTES = 512 * 1024; // 512KB
export const RESUME_ALLOWED_EXTENSIONS = [".pdf", ".doc", ".docx"];

export const LIMITS = {
  fullNameMin: 2,
  fullNameMax: 80,
  emailMax: 120,
  collegeMin: 3,
  collegeMax: 150,
};

export function getYearRange() {
  const now = new Date().getFullYear();
  return { min: now - 10, max: now + 4 };
}

export function getYearOptions() {
  const { min, max } = getYearRange();
  const years = [];
  for (let y = max; y >= min; y -= 1) years.push(String(y));
  return years;
}

const NAME_RE = /^[A-Za-z][A-Za-z\s.'-]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;
const PHONE_RE = /^\+?\d{10,15}$/;

/** Remove spaces, dashes and brackets so "+91 98765-43210" validates. */
export function normalizePhone(value) {
  return String(value || "").replace(/[\s\-()]/g, "");
}

export function validateFullName(value) {
  const v = String(value || "").trim();
  if (!v) return "Full name is required";
  if (v.length < LIMITS.fullNameMin) return "Name is too short";
  if (v.length > LIMITS.fullNameMax)
    return `Name must be ${LIMITS.fullNameMax} characters or fewer`;
  if (!NAME_RE.test(v))
    return "Name can only contain letters, spaces, dots, hyphens and apostrophes";
  return "";
}

export function validateEmail(value) {
  const v = String(value || "").trim();
  if (!v) return "Email address is required";
  if (v.length > LIMITS.emailMax) return "Email address is too long";
  if (!EMAIL_RE.test(v)) return "Enter a valid email address";
  return "";
}

export function validatePhone(value) {
  const v = normalizePhone(value);
  if (!v) return "Phone number is required";
  if (!PHONE_RE.test(v))
    return "Enter a valid phone number (10–15 digits, optional +country code)";
  return "";
}

export function validateQualification(value) {
  const v = String(value || "").trim();
  if (!v) return "Please select your highest qualification";
  if (!QUALIFICATIONS.includes(v)) return "Please select a valid qualification";
  return "";
}

export function validateCollege(value) {
  const v = String(value || "").trim();
  if (!v) return "College / institution is required";
  if (v.length < LIMITS.collegeMin) return "College name is too short";
  if (v.length > LIMITS.collegeMax)
    return `College name must be ${LIMITS.collegeMax} characters or fewer`;
  return "";
}

export function validateYearOfPassing(value) {
  const v = String(value || "").trim();
  if (!v) return "Please select your year of passing";
  if (!/^\d{4}$/.test(v)) return "Enter a valid 4-digit year";
  const { min, max } = getYearRange();
  const year = Number(v);
  if (year < min || year > max)
    return `Year of passing must be between ${min} and ${max}`;
  return "";
}

/** Resume is mandatory for training applications. */
export function validateResumeFile(file) {
  if (!file || typeof file === "string") return "Please upload your resume";
  const name = String(file.name || "").toLowerCase();
  if (!RESUME_ALLOWED_EXTENSIONS.some((ext) => name.endsWith(ext)))
    return "Resume must be a PDF, DOC or DOCX file";
  if (file.size > RESUME_MAX_BYTES) return "Resume must be 512KB or smaller";
  if (file.size === 0) return "The selected file is empty";
  return "";
}

export const FIELD_VALIDATORS = {
  fullName: validateFullName,
  email: validateEmail,
  phone: validatePhone,
  qualification: validateQualification,
  college: validateCollege,
  yearOfPassing: validateYearOfPassing,
};

/** Returns an object of { field: message } for every invalid field. */
export function validateTrainingApplication(values) {
  const errors = {};
  for (const [field, validate] of Object.entries(FIELD_VALIDATORS)) {
    const message = validate(values[field]);
    if (message) errors[field] = message;
  }
  return errors;
}
