export const JOB_TYPES = ["Employment", "Contract", "Internship"];

export function normalizeJobTypes(value) {
  if (Array.isArray(value)) {
    return value.filter((item) => JOB_TYPES.includes(item));
  }

  if (typeof value === "string" && value.trim()) {
    if (value.includes("/")) {
      return value
        .split("/")
        .map((item) => item.trim())
        .filter((item) => JOB_TYPES.includes(item));
    }

    if (JOB_TYPES.includes(value)) {
      return [value];
    }
  }

  return ["Employment"];
}

export function formatJobTypes(value) {
  const types = normalizeJobTypes(value);
  return types.length ? types.join(" / ") : "Employment";
}

/** Persist multi-select as a single string for DB/prod compatibility. */
export function serializeJobTypes(value) {
  return formatJobTypes(value);
}
