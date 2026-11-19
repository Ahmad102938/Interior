import { CatmullRomCurve3, Color, Vector3 } from "three";
import { atmospheres, cameraKeys, cameraKeysPortrait, type Layout } from "@/config/experience";
import { storyPosition } from "./transitions";

const curves = (keys: typeof cameraKeys) => ({
  pos: new CatmullRomCurve3(keys.map((k) => new Vector3(...k.pos)), false, "centripetal"),
  target: new CatmullRomCurve3(keys.map((k) => new Vector3(...k.target)), false, "centripetal"),
});
const paths: Record<Layout, ReturnType<typeof curves>> = {
  landscape: curves(cameraKeys),
  portrait: curves(cameraKeysPortrait),
};

/**
 * Samples camera position/target for master progress p. getPoint() is
 * parameterised by control-point index, so evenly spaced keyframes map
 * linearly to progress. Writes into the provided vectors (no allocation).
 */
export function sampleCamera(p: number, outPos: Vector3, outTarget: Vector3, layout: Layout = "landscape") {
  const t = Math.min(1, Math.max(0, p));
  paths[layout].pos.getPoint(t, outPos);
  paths[layout].target.getPoint(t, outTarget);
}

export type AtmosphereSample = {
  background: Color;
  sun: Color;
  sky: Color;
  ground: Color;
  accent: Color;
  sunIntensity: number;
  hemiIntensity: number;
  fogNear: number;
  fogFar: number;
  exposure: number;
};

const palette = atmospheres.map((a) => ({
  ...a,
  background: new Color(a.background),
  sun: new Color(a.sun),
  sky: new Color(a.sky),
  ground: new Color(a.ground),
  accent: new Color(a.accent),
}));

export function createAtmosphereSample(): AtmosphereSample {
  const a = palette[0];
  return {
    background: a.background.clone(),
    sun: a.sun.clone(),
    sky: a.sky.clone(),
    ground: a.ground.clone(),
    accent: a.accent.clone(),
    sunIntensity: a.sunIntensity,
    hemiIntensity: a.hemiIntensity,
    fogNear: a.fog[0],
    fogFar: a.fog[1],
    exposure: a.exposure,
  };
}

/** Interpolates the environment mood between adjacent panels. */
export function sampleAtmosphere(p: number, out: AtmosphereSample) {
  const s = storyPosition(p);
  const i = Math.min(Math.floor(s), palette.length - 2);
  const f = s - i;
  // Bias the blend towards the destination late in the transition.
  const t = f * f * (3 - 2 * f);
  const a = palette[i];
  const b = palette[i + 1];
  out.background.copy(a.background).lerp(b.background, t);
  out.sun.copy(a.sun).lerp(b.sun, t);
  out.sky.copy(a.sky).lerp(b.sky, t);
  out.ground.copy(a.ground).lerp(b.ground, t);
  out.accent.copy(a.accent).lerp(b.accent, t);
  out.sunIntensity = a.sunIntensity + (b.sunIntensity - a.sunIntensity) * t;
  out.hemiIntensity = a.hemiIntensity + (b.hemiIntensity - a.hemiIntensity) * t;
  out.fogNear = a.fog[0] + (b.fog[0] - a.fog[0]) * t;
  out.fogFar = a.fog[1] + (b.fog[1] - a.fog[1]) * t;
  out.exposure = a.exposure + (b.exposure - a.exposure) * t;
  return out;
}
