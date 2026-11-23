/** Presentation categories for the six capabilities. They group; they never rename. */
export type CapabilityGroupKey = "pre-construction" | "field-execution" | "quality-completion";

export const capabilityGroups: { key: CapabilityGroupKey; label: string; numbers: string[] }[] = [
  { key: "pre-construction", label: "Pre-construction", numbers: ["01", "02", "03"] },
  { key: "field-execution", label: "Field execution", numbers: ["04", "05"] },
  { key: "quality-completion", label: "Quality & completion", numbers: ["06"] },
];

export const groupLabel = (key: CapabilityGroupKey) => capabilityGroups.find((g) => g.key === key)!.label;
