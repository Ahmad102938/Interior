import type { Status } from "@/lib/content";

/**
 * How a scope is resourced. The client brief asks the site to distinguish
 * in-house expertise from qualified partner- and vendor-supported delivery —
 * but which arrangement applies to which capability is a business fact that
 * management must confirm. Definitions below explain the labels; nothing is
 * assigned publicly until a classification is verified.
 */
export type DeliveryModelKey = "in-house" | "partner" | "vendor" | "project";

export const deliveryModels: { key: DeliveryModelKey; label: string; copy: string }[] = [
  { key: "in-house", label: "In-house expertise", copy: "Scope delivered by Adidev's own team." },
  { key: "partner", label: "Qualified partner-supported", copy: "Specialist scope delivered with qualified partners, coordinated by Adidev." },
  { key: "vendor", label: "Vendor-coordinated", copy: "Materials, equipment or services supplied by vendors, with procurement and delivery coordinated by Adidev." },
  { key: "project", label: "Project-dependent", copy: "Arranged per project, according to the approved scope and its technical requirements." },
];

/** Per-capability classification. `model` stays empty until management confirms it (status "verified"). */
export const capabilityDelivery: { number: string; model?: DeliveryModelKey; status: Status; note?: string }[] = [
  { number: "01", status: "pending", note: "Confirm: in-house, partner-supported or project-dependent?" },
  { number: "02", status: "pending" },
  { number: "03", status: "pending" },
  { number: "04", status: "pending" },
  { number: "05", status: "pending" },
  { number: "06", status: "pending" },
];

export const deliveryModel = (key: DeliveryModelKey) => deliveryModels.find((m) => m.key === key)!;
