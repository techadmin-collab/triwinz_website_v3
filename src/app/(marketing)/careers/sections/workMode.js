export const WORK_MODE_LABELS = {
  WFH: "Work from home",
  WFO: "Work from office",
  Hybrid: "Hybrid",
};

export function getWorkModeLabel(workMode) {
  return WORK_MODE_LABELS[workMode] || workMode || "Hybrid";
}
