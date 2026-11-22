/**
 * Cinematic hero configuration — "From Blueprint to Building".
 * One master progress value p ∈ [0, 1] drives everything; story position
 * s = p × (STORY_PANELS − 1) maps to the stages of one site transforming:
 *   s = 0 → blueprint (hook) · 1 → Design · 2 → Plan · 3 → Build
 *   · 4 → Interior (camera flies through the new curtain wall into level 2)
 *   · 5 → Handover (back out through the glass to the finished building at dusk)
 */
export const STORY_PANELS = 6;

/** Scroll distance of the pinned section, in viewport heights (beyond the first). */
export const SCROLL_LENGTH_VH = 500;
/** Phones: shorter journey — thumb scrolling covers less distance per gesture. */
export const SCROLL_LENGTH_VH_PORTRAIT = 450;

/** Below this width the hero uses the portrait layout (vertical story, portrait camera). */
export const PORTRAIT_QUERY = "(max-width: 767px)";

export type Layout = "landscape" | "portrait";

/** Damping applied to the scroll target (higher = snappier). Per second. */
export const PROGRESS_DAMPING = 5;

/** Fraction of each stage interval the copy stays parked before moving on. */
export const STORY_HOLD = 0.42;

/** Seconds the opening blueprint takes to draw itself (the 5-second hook). */
export const BLUEPRINT_DRAW_SECONDS = 2.6;

/**
 * Stage timeline in story-position units. Each element of the site fades,
 * grows or morphs across its [from, to] window, so the transformation is
 * continuous and fully reversible.
 */
/*
 * Choreography. Copy parks on each stage for s ∈ [k − 0.21, k + 0.21]
 * (STORY_HOLD), so every stage is fully "in" before its hold starts and only
 * leaves after it ends; hand-offs happen in the gaps between holds.
 *
 *   0 Blueprint ─┐ ┌─ 1 Design ─┐ ┌─ 2 Plan ─┐ ┌─ 3 Build ─┐ ┌─ 4 Interior ─┐ ┌─ 5 Handover
 *
 * While the camera is inside (Interior), the exterior finishes out of view —
 * site struck, landscape, dusk — so stepping back out reveals the result.
 */
export const stageTimeline = {
  // 0 → 1: the drawing lifts into a massing model; context and tools arrive
  blueprint: { fadeOut: [2.25, 2.6] },
  wireWalls: { rise: [0.24, 0.72], fadeOut: [2.3, 2.6] },
  wireFurniture: { in: [0.5, 0.76], fadeOut: [1.24, 1.42] },
  context: { in: [0.28, 0.72], wireOut: [2.26, 2.5], solidIn: [2.32, 2.66] },
  designTools: { in: [0.5, 0.76], out: [1.4, 1.58] },
  // 1 → 2: the section plane sweeps up through the model and the floors separate behind it
  sectionSweep: { rise: [1.22, 1.5] },
  floors: { in: [1.26, 1.5], explode: [1.36, 1.74], collapse: [2.23, 2.48], out: [2.42, 2.62] },
  ghost: { in: [1.28, 1.56], out: [2.22, 2.42] },
  // 2 → 3: floors re-assemble, then frame → slabs → concrete masses; the site mobilises
  columns: { rise: [2.3, 2.5] },
  slab: { in: [2.34, 2.72] },
  masonry: { rise: [2.44, 2.78] },
  risers: { in: [2.36, 2.56], fadeOut: [2.9, 3.1] },
  site: { in: [2.26, 2.56], fadeOut: [3.85, 4.1] },
  scaffold: { in: [2.58, 2.78], fadeOut: [3.8, 4.05] },
  roads: { in: [2.26, 2.56] },
  // 3 → 4: glazing goes in, the camera flies to level 2 and through it.
  // `enter`/`exit` are the moments the camera crosses the glass: while inside,
  // the exterior shell is switched off and its lights move under the pendants.
  glass: { in: [3.3, 3.55] },
  interior: { in: [3.3, 3.42], enter: 3.72, lights: [3.45, 3.85], exit: 4.27, out: [4.6, 4.75] },
  // Out of view while inside: site struck, landscape, dusk, lights on
  furniture: { in: [3.8, 4.0] },
  landscape: { in: [3.8, 4.2] },
  sky: { in: [3.6, 4.15] },
  lights: { in: [3.85, 4.25] },
  // Telecom + solar alongside the building: drawn in Design, set out in Plan,
  // built through Build (the Build hold is s ∈ [2.79, 3.21]), live at dusk.
  tracesDraw: { in: [0.3, 0.95], out: [3.05, 3.4] },
  tracesSetOut: { in: [1.55, 2.0], out: [2.5, 2.8] },
  tower: { footing: [2.28, 2.42], rise: [2.36, 3.08], fitOut: [3.0, 3.24], live: [3.2, 3.36] },
  solarFarm: { piles: [2.36, 2.6], rails: [2.52, 2.78], modules: [2.7, 3.22] },
  carport: { frame: [2.46, 2.7], modules: [2.74, 3.08], chargers: [2.98, 3.12] },
  roofSolar: { install: [2.62, 3.4] },
} as const;

type V3 = [number, number, number];

/**
 * Camera keyframes evenly spaced in progress. Landscape frames keep the site
 * right of centre so the copy (left) and the model never compete.
 */
export const cameraKeys: { pos: V3; target: V3 }[] = [
  // s = 0.0 — top-down on the site plan, like a design canvas
  { pos: [-24, 105, 14], target: [-24, 0, 10] },
  // s = 0.5 — the drawing tilts
  { pos: [-40, 82, 66], target: [-16, 0, 6] },
  // s = 1.0 — DESIGN: three-quarter view of the massing model
  { pos: [-72, 46, 74], target: [-12, 9, 0] },
  // s = 1.5 — orbit across the front
  { pos: [-26, 40, 92], target: [-10, 10, 0] },
  // s = 2.0 — PLAN: from the other corner, services inside the model
  { pos: [70, 62, 112], target: [-6, 23, -2] },
  // s = 2.5 — swing back as construction starts
  { pos: [-12, 30, 88], target: [-10, 12, 0] },
  // s = 3.0 — BUILD: wide site view with crane
  { pos: [-66, 26, 66], target: [-10, 14, 0] },
  // s = 3.5 — rise to level 2 and line up with the new curtain wall
  { pos: [14, 10.8, 27], target: [13, 10.2, 4] },
  // s = 4.0 — INTERIOR: inside the hall, looking across the floor to the glazing
  { pos: [19.2, 10.05, -6.4], target: [-5, 9.5, 7.5] },
  // s = 4.5 — back out through the glass, pulling away from the façade
  { pos: [12, 9.5, 31], target: [2, 12, 2] },
  // s = 5.0 — HANDOVER: low plaza view up the finished building at dusk
  { pos: [-46, 2.6, 58], target: [-2, 12.5, 4] },
];

/**
 * Portrait (phone) path. The opening looks down from the +x side so the plan's
 * long axis runs up the tall screen; the camera then orbits round to the front.
 * Targets sit nearer the camera than the site so the site rides in the upper frame.
 */
export const cameraKeysPortrait: { pos: V3; target: V3 }[] = [
  { pos: [24, 120, 6], target: [20, 0, 6] },
  { pos: [42, 96, 30], target: [16, 0, 10] },
  { pos: [56, 62, 64], target: [6, 6, 12] },
  { pos: [14, 58, 92], target: [2, 6, 16] },
  { pos: [66, 78, 122], target: [2, 20, 14] },
  { pos: [6, 42, 96], target: [0, 8, 18] },
  { pos: [-58, 40, 86], target: [-6, 6, 20] },
  { pos: [13, 10.8, 32], target: [13, 9.6, 2] },
  { pos: [19.2, 10.05, -6.4], target: [2, 9.4, 6] },
  { pos: [12, 9.5, 36], target: [2, 11, 4] },
  { pos: [-44, 5, 74], target: [-1, 3, 16] },
];

/** Environment mood per stage — software canvas → site → finished space. */
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
  // Blueprint: deep navy design canvas
  { background: "#0b1626", fog: [140, 360], sun: "#dfe7f2", sunIntensity: 0.6, sky: "#3b5272", ground: "#0d1520", hemiIntensity: 0.35, accent: "#c9a46e", exposure: 0.95 },
  // Design: navy, model glowing gold
  { background: "#0e1c30", fog: [140, 360], sun: "#dfe7f2", sunIntensity: 0.9, sky: "#4a6283", ground: "#111a26", hemiIntensity: 0.45, accent: "#c9a46e", exposure: 1.0 },
  // Plan: cooler, technical
  { background: "#102238", fog: [140, 360], sun: "#e3eaf3", sunIntensity: 1.2, sky: "#5b7394", ground: "#151d27", hemiIntensity: 0.5, accent: "#af8958", exposure: 1.0 },
  // Build: overcast daylight on site
  { background: "#3a4656", fog: [120, 360], sun: "#fff1dc", sunIntensity: 2.6, sky: "#a9b4c2", ground: "#3a3632", hemiIntensity: 0.85, accent: "#af8958", exposure: 1.05 },
  // Interior: warm hall, blue-hour city through the glass
  { background: "#16294a", fog: [90, 320], sun: "#9fb6d8", sunIntensity: 0.35, sky: "#b8b2a8", ground: "#4a3a2e", hemiIntensity: 1.05, accent: "#d8c398", exposure: 1.18 },
  // Handover: blue-hour dusk, warm architectural lighting
  { background: "#1a2f50", fog: [90, 300], sun: "#9fb6d8", sunIntensity: 0.55, sky: "#4f6f9e", ground: "#2a2622", hemiIntensity: 0.75, accent: "#d8c398", exposure: 1.1 },
];

export type Quality = "high" | "medium" | "low";

export const qualitySettings: Record<Quality, { dpr: [number, number]; shadowMap: number; envResolution: number }> = {
  high: { dpr: [1, 1.75], shadowMap: 2048, envResolution: 256 },
  medium: { dpr: [1, 1.25], shadowMap: 1024, envResolution: 128 },
  // Phones: high-DPI screens, smaller GPUs — cap pixels, keep shadows modest.
  low: { dpr: [1, 1.5], shadowMap: 1024, envResolution: 64 },
};

/** Pointer parallax applied to the camera (world units). */
export const POINTER_PARALLAX = { x: 1.2, y: 0.6 };
