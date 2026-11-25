/**
 * Shared shapes for editable page content (see src/content/README.md).
 * Spread a Heading straight into <SectionHeading /> or <PageHero />:
 *   <SectionHeading {...homePage.verticals.heading} />
 */
export type Heading = {
  eyebrow: string;
  title: string;
  /** Second line, rendered in italic accent colour. */
  accent?: string;
  intro?: string;
};

export type Cta = { label: string; href: string };

export type ImageAsset = {
  /** Path under /public, e.g. "/images/projects/site-01.jpg". */
  src: string;
  alt: string;
  /** CSS object-position, e.g. "50% 40%" — which part of the photo stays in frame. */
  position?: string;
  /** Small label over the image, e.g. "Illustrative visualisation". */
  caption?: string;
};

/** An image slot that may not have a photograph yet — a branded placeholder shows until `src` is set. */
export type ImageSlot = Omit<ImageAsset, "src"> & {
  src?: string;
  /** What photograph belongs here (shown on the placeholder in development). */
  slot: string;
};

/**
 * Type-checked image helpers for content files: a missing `src` or `alt` is
 * flagged in the editor and fails the build, instead of breaking at runtime.
 *   image({ src: "/images/…", alt: "…" })
 *   imageMap({ telecom: { src, alt }, solar: renders.solar })
 */
export const image = (img: ImageAsset): ImageAsset => img;
export const imageMap = <K extends string>(map: Record<K, ImageAsset>): Record<K, ImageAsset> => map;
