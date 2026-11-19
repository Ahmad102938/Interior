import { STORY_HOLD, STORY_PANELS } from "@/config/experience";

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
export const smoothstep = (t: number) => t * t * (3 - 2 * t);
export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Continuous story position s ∈ [0, STORY_PANELS-1]. */
export const storyPosition = (p: number) => clamp01(p) * (STORY_PANELS - 1);

/**
 * Story track position with "holds": text parks on each panel for STORY_HOLD
 * of the interval, then eases to the next one. The 3D camera does not hold —
 * it keeps travelling, which is what makes the sequence feel cinematic.
 */
export function heldStoryPosition(p: number) {
  const s = storyPosition(p);
  const i = Math.min(Math.floor(s), STORY_PANELS - 2);
  const f = s - i;
  const half = STORY_HOLD / 2;
  // Hold at both ends of each interval, transition in the middle.
  const t = clamp01((f - half) / (1 - STORY_HOLD));
  return i + easeInOutCubic(t);
}

/** Active chapter index: 0 = opening, 1..4 = verticals. */
export const activePanel = (p: number) => Math.round(heldStoryPosition(p));
