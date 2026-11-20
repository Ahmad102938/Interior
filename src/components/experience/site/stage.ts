import { stageTimeline as T } from "@/config/experience";

/** Shared easing for every staged element of the hero building. */
export const smooth = (t: number) => t * t * (3 - 2 * t);
export const ramp = (s: number, [a, b]: readonly [number, number]) => smooth(Math.min(1, Math.max(0, (s - a) / (b - a))));
/** 0→1→0 window: fades in across `inn`, out across `out`. */
export const window01 = (s: number, inn: readonly [number, number], out: readonly [number, number]) => ramp(s, inn) * (1 - ramp(s, out));

/** Vertical gap between floor plates when the building is fully exploded (m). */
export const EXPLODE_GAP = 5.5;

/** 0 (assembled) → 1 (fully exploded) → 0 (re-assembled for construction). */
export const explodeFactor = (s: number) => ramp(s, T.floors.explode) * (1 - ramp(s, T.floors.collapse));
