import type { VerticalKey } from "./theme";

/**
 * Cinematic hero configuration. One master progress value p ∈ [0, 1] drives
 * everything; "story position" s = p * STORY_PANELS-1 maps to panels:
 *   s = 0 → opening frame, s = 1 → Telecom, 2 → Solar, 3 → Civil, 4 → Interiors.
 */
export const STORY_PANELS = 5;

/** Scroll distance of the pinned section, in viewport heights (beyond the first). */
export const SCROLL_LENGTH_VH = 520;
/** Phones: shorter journey — thumb scrolling covers less distance per gesture. */
export const SCROLL_LENGTH_VH_PORTRAIT = 440;

/** Below this width the hero uses the portrait layout (vertical story, portrait camera). */
export const PORTRAIT_QUERY = "(max-width: 767px)";

export type Layout = "landscape" | "portrait";

/** Damping applied to the scroll target (higher = snappier). Per second. */
export const PROGRESS_DAMPING = 5.5;

/**
 * Fraction of each panel interval during which text stays parked before the
 * horizontal track starts moving to the next chapter.
 */
export const STORY_HOLD = 0.42;

/** World-space centres of each environment, laid out along +X. */
export const zones: Record<VerticalKey, [number, number, number]> = {
  telecom: [0, 0, 0],
  solar: [78, 0, -6],
  civil: [158, 0, -4],
  interiors: [238, 0, -6],
};

type V3 = [number, number, number];

/**
 * Camera keyframes evenly spaced in progress (index / (n-1)). Interpolated with
 * a centripetal Catmull–Rom curve so motion stays continuous between zones.
 * Targets are biased left of each subject so the HTML copy (left side) and the
 * model (right side) do not compete.
 */
export const cameraKeys: { pos: V3; target: V3 }[] = [
  // s = 0.0 — opening establishing shot of the telecom site
  { pos: [-34, 7, 54], target: [-9, 13, 0] },
  // s = 0.5 — approach
  { pos: [-28, 5.5, 42], target: [-7, 13.5, 0] },
  // s = 1.0 — TELECOM: low, close, looking up the lattice
  { pos: [-21, 3.6, 31], target: [-5.5, 13, 0] },
  // s = 1.5 — lateral glide out towards the solar field
  { pos: [22, 10, 40], target: [48, 3, -4] },
  // s = 2.0 — SOLAR: elevated view across the arrays
  { pos: [54, 15, 30], target: [74, 0, -10] },
  // s = 2.5 — traverse the arrays towards the industrial site
  { pos: [104, 9, 38], target: [128, 4, -4] },
  // s = 3.0 — CIVIL: past the foundations, tilting up to the steel frame
  { pos: [128, 4.5, 30], target: [148, 9, -6] },
  // s = 3.5 — approach the glazed facade of the workplace
  { pos: [214, 3.4, 30], target: [234, 2.6, -4] },
  // s = 4.0 — INTERIORS: inside the completed workplace
  { pos: [234.5, 2.3, 1.5], target: [244, 1.5, -15] },
];

/**
 * Portrait (phone) camera path. Same world, same order — re-framed so each
 * subject sits in the upper part of a tall frame and the copy owns the bottom.
 */
export const cameraKeysPortrait: { pos: V3; target: V3 }[] = [
  // s = 0.0 — whole tower in frame, standing above the headline
  { pos: [-7, 3, 78], target: [0, 1.5, 0] },
  // s = 0.5 — approach
  { pos: [-6, 2.5, 56], target: [0.5, 5, 0] },
  // s = 1.0 — TELECOM: low angle up the lattice
  { pos: [-7, 2, 40], target: [0, 9.5, 0] },
  // s = 1.5 — rise and glide towards the solar field
  { pos: [40, 13, 46], target: [56, 2, -4] },
  // s = 2.0 — SOLAR: high view down the rows
  { pos: [72, 26, 40], target: [78, -6, -6] },
  // s = 2.5 — traverse towards the industrial site
  { pos: [118, 11, 46], target: [140, 5, -4] },
  // s = 3.0 — CIVIL: frame, crane and footings
  { pos: [151, 8, 50], target: [157, 1, -4] },
  // s = 3.5 — approach the glazed facade
  { pos: [226, 4, 34], target: [233, 3, -4] },
  // s = 4.0 — INTERIORS: inside, looking to the meeting room
  { pos: [233, 2.4, 2], target: [241, 0.4, -14] },
];

/** Environment mood per panel (opening shares the telecom mood). */
export const atmospheres: {
  background: string;
  fog: [near: number, far: number];
  sun: string;
  sunIntensity: number;
  sky: string;
  ground: string;
  hemiIntensity: number;
  accent: string;
  exposure: number;
}[] = [
  { background: "#0d1a2c", fog: [40, 150], sun: "#dfe7f2", sunIntensity: 2.1, sky: "#5b7394", ground: "#1a1f26", hemiIntensity: 0.55, accent: "#af8958", exposure: 1.0 },
  { background: "#11213a", fog: [40, 150], sun: "#e8eef6", sunIntensity: 2.4, sky: "#6a84a8", ground: "#1d2229", hemiIntensity: 0.6, accent: "#af8958", exposure: 1.02 },
  { background: "#123526", fog: [45, 170], sun: "#ffe4bf", sunIntensity: 3.0, sky: "#8fb0a0", ground: "#2a2a1f", hemiIntensity: 0.7, accent: "#d8c398", exposure: 1.05 },
  { background: "#1b1c1e", fog: [38, 150], sun: "#f1ece4", sunIntensity: 2.5, sky: "#7d8288", ground: "#222224", hemiIntensity: 0.6, accent: "#af8958", exposure: 1.0 },
  { background: "#2a1218", fog: [30, 120], sun: "#ffdcb8", sunIntensity: 1.6, sky: "#c9a99a", ground: "#2a1a18", hemiIntensity: 0.55, accent: "#d8c398", exposure: 1.08 },
];

export const chapterKeys: VerticalKey[] = ["telecom", "solar", "civil", "interiors"];

export type Quality = "high" | "medium" | "low";

export const qualitySettings: Record<Quality, { dpr: [number, number]; shadowMap: number; solarRows: number; envResolution: number }> = {
  high: { dpr: [1, 1.75], shadowMap: 2048, solarRows: 9, envResolution: 256 },
  medium: { dpr: [1, 1.25], shadowMap: 1024, solarRows: 6, envResolution: 128 },
  // Phones: high-DPI screens, smaller GPUs — cap pixels, keep shadows modest.
  low: { dpr: [1, 1.5], shadowMap: 1024, solarRows: 6, envResolution: 64 },
};

/** Pointer parallax applied to the camera (world units). */
export const POINTER_PARALLAX = { x: 1.6, y: 0.8 };
