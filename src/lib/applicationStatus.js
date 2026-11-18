// Application statuses that need a reason (shown on the application with who set it)
export const REASON_STATUSES = ["reviewed", "on_hold", "marked_for_rejection"];
export const STATUS_REASON_LIMIT = 1000;

export function needsReason(status) {
  return REASON_STATUSES.includes(status);
}
