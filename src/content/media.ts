import type { VerticalKey } from "@/config/theme";
import type { ImageAsset } from "./types";

/**
 * Image library — the illustrative 3D renders currently standing in for
 * photography. Page files (src/content/pages/*) and entity files (projects,
 * services, industries) point at these.
 *
 * To use a real photograph:
 *   1. Drop the file in /public/images/<folder>/ (e.g. /public/images/projects/tower-01.jpg).
 *   2. In the page file, replace `renders.xxx` with your own
 *      { src: "/images/projects/tower-01.jpg", alt: "Describe the photo" }.
 * Changing an entry *here* changes it everywhere that render is used.
 * Renders carry caption "Illustrative visualisation"; your own photos shouldn't (leave caption out).
 */
const R = "Illustrative visualisation";

const CDN = (process.env.NEXT_PUBLIC_IMAGE_CDN_URL ?? "").replace(/\/$/, "");

/**
 * Photo hosted on the CDN: cdn("projects/tower-01.jpg") → "<CDN URL>/projects/tower-01.jpg".
 * Without NEXT_PUBLIC_IMAGE_CDN_URL set, it falls back to /public/images/<path> (handy for local testing).
 */
export const cdn = (path: string) => `${CDN || "/images"}/${path.replace(/^\//, "")}`;

export const renders = {
  /** Hero stage posters (also used as fallbacks for the 3D hero). */
  drawing: { src: "/images/posters/stage-0.jpg", alt: "Coordinated site and building layout drawing — illustrative visualisation", caption: R },
  massing: { src: "/images/posters/stage-1.jpg", alt: "Building massing set out on a site plan — illustrative visualisation", caption: R },
  model: { src: "/images/posters/stage-2.jpg", alt: "Coordinated floor plates and building services model — illustrative visualisation", caption: R },
  construction: { src: "/images/posters/stage-3.jpg", alt: "Structure under construction with tower crane and site teams — illustrative visualisation", caption: R },
  interior: { src: "/images/posters/stage-4.jpg", alt: "Fitted-out workplace interior — illustrative visualisation", caption: R },
  completed: { src: "/images/posters/stage-5.jpg", alt: "Completed commercial building at dusk — illustrative visualisation", caption: R },

  /** One per business vertical. */
  telecom: { src: "/images/verticals/telecom.jpg", alt: "Lattice telecom tower — illustrative visualisation", caption: R },
  solar: { src: "/images/verticals/solar.jpg", alt: "Rows of ground-mounted solar arrays — illustrative visualisation", caption: R },
  civil: { src: "/images/verticals/civil.jpg", alt: "Steel-framed industrial shed on RCC pedestals — illustrative visualisation", caption: R },
  interiors: { src: "/images/verticals/interiors.jpg", alt: "Open commercial floor with glazed meeting room — illustrative visualisation", caption: R },
} satisfies Record<string, ImageAsset>;

/** Image shown for each vertical on the homepage panels, About matrix, etc. */
export const verticalImages: Record<VerticalKey, ImageAsset> = {
  telecom: renders.telecom,
  solar: renders.solar,
  civil: renders.civil,
  interiors: renders.interiors,
};

/** Labels shown over illustrative imagery. */
export const mediaLabels = {
  render: R,
  diagram: "Illustrative diagram",
};
