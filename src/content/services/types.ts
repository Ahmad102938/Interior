import type { VerticalKey } from "@/config/theme";
import type { Status } from "@/lib/content";
import type { ProjectCategory } from "../projects";
import type { ImageAsset, ImageSlot } from "../types";

/**
 * One configuration per service page. Capability titles, process stages and
 * headlines follow the client presentation (slides 7–11) and the approved page
 * brief; supporting copy only restates that scope — it never adds services,
 * figures or ratings. Qualifiers such as "where applicable", "support" and
 * "coordination" are kept wherever the source uses them.
 */

export type ServiceImage = ImageAsset;

export type ServiceCapability = { number: string; title: string; copy?: string };

/** Capabilities are grouped so long lists stay scannable (and collapsible on phones). */
export type CapabilityGroup = { title: string; intro: string; items: ServiceCapability[] };

export type ProcessStep = { title: string; copy: string };

/** A labelled point on a schematic or photograph, tied to the capabilities it illustrates. */
export type Callout = {
  label: string;
  copy: string;
  /** Capability numbers this point illustrates. */
  covers: string[];
  /** Position as a percentage of the figure (x, y). */
  at: [number, number];
};

/** A step in a design-to-completion story, with an optional image. */
export type JourneyStep = { title: string; copy: string; covers: string[]; image?: ServiceImage };

/** Each page's signature section — same design language, different composition. */
export type ServiceFeature =
  | { kind: "telecom-site"; callouts: Callout[] }
  | { kind: "solar-array"; callouts: Callout[] }
  | { kind: "civil-anatomy"; image: ServiceImage; callouts: Callout[] }
  | { kind: "interior-journey"; steps: JourneyStep[] };

export type Surface = "white" | "ivory" | "brand";

export type SectionKey = "overview" | "capabilities" | "feature" | "process" | "projects" | "support";

export type ServiceConfig = {
  key: VerticalKey;
  slug: string;
  serviceNumber: string;
  title: string;
  /** Headline as two lines: the second renders as the italic accent. */
  headline: [string, string];
  description: string;
  metaDescription: string;
  heroImage: ServiceImage;
  overview: {
    title: [string, string];
    body: string[];
    /** Clarifies what is delivered directly and what is coordinated. */
    scopeNote: string;
  };
  capabilities: { intro: string; groups: CapabilityGroup[] };
  feature: { eyebrow: string; title: [string, string]; intro: string; navLabel: string } & ServiceFeature;
  process: { intro: string; steps: ProcessStep[] };
  /** Project categories that count as references on this page. */
  projectCategories: ProjectCategory[];
  /**
   * Concept image slots shown while no approved reference exists (slide wording).
   * A plain string shows a placeholder; use { slot, src, alt } to show a photo.
   */
  referenceSlots: (string | ImageSlot)[];
  /** Numbers from capabilities.ts most relevant to this vertical (a short selection). */
  relatedCapabilities: string[];
  /** Items from quality.qa that matter most for this work. */
  qualityChecks: string[];
  enquiry: { title: string; copy: string };
  /** Section order and surfaces — chosen per vertical so the pages do not share one rhythm. */
  layout: { section: SectionKey; surface: Surface }[];
  verificationStatus: Status;
};
