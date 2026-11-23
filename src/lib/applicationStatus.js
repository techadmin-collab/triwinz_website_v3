// Application statuses that need a reason (shown on the application with who set it)
export const REASON_STATUSES = ["reviewed", "next_step", "on_hold", "marked_for_rejection"];
export const STATUS_REASON_LIMIT = 1000;

export function needsReason(status) {
  return REASON_STATUSES.includes(status);
}

// Label and hint for the note box of each status
export function reasonLabel(status) {
  return status === "next_step" ? "Next step for HR" : "Reason";
}

export function reasonPlaceholder(status) {
  switch (status) {
    case "reviewed":
      return "What did you find in your review?";
    case "next_step":
      return "e.g. Share the machine task / Schedule a direct technical interview / Call for an HR discussion";
    case "on_hold":
      return "Why is this application on hold?";
    default:
      return "Why should this candidate be rejected?";
  }
}
