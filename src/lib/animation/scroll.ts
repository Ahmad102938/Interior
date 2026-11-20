import { PROGRESS_DAMPING } from "@/config/experience";

/**
 * The single source of truth for the cinematic hero. ScrollTrigger writes
 * `target`; one ticker damps it into `value`; every consumer (camera, scene,
 * story track, indicator) reads `value`. Mutable object — never React state.
 */
export type ProgressController = {
  target: number;
  value: number;
  pointer: { x: number; y: number };
  /** DOM annotation callouts positioned by the 3D scene each frame. */
  tags: (HTMLElement | null)[];
  /**
   * Scene-only progress override used by the hidden warm-up pass. The 3D scene
   * reads `sceneProgress()`; the HTML story keeps following `value`.
   */
  override: number | null;
  /** True once the canvas has been revealed (the blueprint draws itself from here). */
  revealed: boolean;
};

export function createProgressController(): ProgressController {
  return { target: 0, value: 0, pointer: { x: 0, y: 0 }, tags: [], override: null, revealed: false };
}

/** Frame-rate independent exponential damping. */
export function dampProgress(ctrl: ProgressController, dt: number) {
  const k = 1 - Math.exp(-PROGRESS_DAMPING * Math.min(dt, 0.1));
  ctrl.value += (ctrl.target - ctrl.value) * k;
  if (Math.abs(ctrl.target - ctrl.value) < 1e-5) ctrl.value = ctrl.target;
}

/** Progress the 3D scene should render (warm-up override, else the live value). */
export const sceneProgress = (ctrl: ProgressController) => ctrl.override ?? ctrl.value;
