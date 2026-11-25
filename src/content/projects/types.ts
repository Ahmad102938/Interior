import type { VerticalKey } from "@/config/theme";

/** The six portfolio browsing categories (slide 14) — distinct from the four business verticals. */
export type ProjectCategory = "telecom" | "solar" | "civil" | "industrial" | "interiors" | "renovation";

/**
 * Publication workflow. Only "approved" and "published" records appear on the
 * public site; drafts and records awaiting approval are visible in development
 * only, so layouts can be reviewed (see lib/content.ts → SHOW_UNVERIFIED).
 */
export type PublicationStatus = "draft" | "pending-approval" | "approved" | "published";

export type ProjectImage = { src: string; alt: string; caption?: string; position?: string };

/** Before / during / after, as the client brief asks. Only supplied phases render. */
export type GalleryPhase = "before" | "during" | "after";
export type GalleryImage = ProjectImage & { phase: GalleryPhase };

/** Approved video: a self-hosted file (with poster) or an embeddable URL. */
export type ProjectVideo = { title: string; phase?: GalleryPhase } & ({ kind: "file"; src: string; poster?: string } | { kind: "embed"; url: string });

/** Documents approved for public distribution only — never drawings, BOQs, quotations or contracts. */
export type ProjectDocument = { title: string; href: string; format: "PDF"; size?: string };

export type Project = {
  id: string;
  slug: string;
  name: string;
  /** Shown only when the client has authorised it. */
  client?: { name: string; visibility: "public" | "withheld" };
  location: { city?: string; state: string };
  /** Primary portfolio category. */
  category: ProjectCategory;
  primaryVertical: VerticalKey;
  /** Secondary categories this one record should also appear under — never duplicate records. */
  tags?: ProjectCategory[];
  projectStatus: "completed" | "ongoing";
  /** Approved period, e.g. "Mar 2023 – Jan 2024". */
  duration?: string;
  /** Verified measurement, e.g. { label: "Built-up area", value: "…" }. */
  metric?: { label: string; value: string };
  /** One-paragraph introduction for cards, the hero and meta description. */
  summary: string;
  /** Context, the client's requirement (where shareable), environment and Adidev's involvement. */
  overview?: string[];
  /** Activities actually undertaken on this project — never the full capability list. */
  scope: string[];
  highlights?: string[];
  featuredImage?: ProjectImage;
  gallery?: GalleryImage[];
  videos?: ProjectVideo[];
  documents?: ProjectDocument[];
  featured?: boolean;
  publicationStatus: PublicationStatus;
  /** Internal reviewer note. Never rendered. */
  note?: string;
};
