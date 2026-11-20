"use client";

/* eslint-disable react-hooks/immutability -- uniforms/materials are animated in useFrame */
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { BackSide, Color, IcosahedronGeometry, MeshStandardMaterial, ShaderMaterial, type Group } from "three";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { BoxInstances, useConst, type BoxItem } from "../models/primitives";
import { cityWindows } from "../models/textures";

const domeGeo = new IcosahedronGeometry(0.5, 2);

const ramp = (s: number, [a, b]: readonly [number, number]) => {
  const t = Math.min(1, Math.max(0, (s - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/**
 * Dusk sky dome and a distant lit city. Both fade in as the building nears
 * completion — earlier stages stay on the flat "design canvas" background.
 */
export function Backdrop({ progress }: { progress: React.RefObject<ProgressController> }) {
  const sky = useConst(
    () =>
      new ShaderMaterial({
        side: BackSide,
        depthWrite: false,
        transparent: true,
        fog: false,
        uniforms: {
          uTop: { value: new Color("#0b1d3a") },
          uMid: { value: new Color("#27497a") },
          uHorizon: { value: new Color("#6d86a8") },
          uMix: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec3 vDir;
          void main() {
            vDir = normalize(position);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }`,
        fragmentShader: /* glsl */ `
          uniform vec3 uTop; uniform vec3 uMid; uniform vec3 uHorizon; uniform float uMix;
          varying vec3 vDir;
          void main() {
            float h = clamp(vDir.y, -0.1, 1.0);
            vec3 c = mix(uHorizon, uMid, smoothstep(0.0, 0.18, h));
            c = mix(c, uTop, smoothstep(0.18, 0.75, h));
            // faint cloud banding
            float band = sin(vDir.x * 9.0 + vDir.y * 30.0) * 0.5 + 0.5;
            c += vec3(0.03, 0.04, 0.06) * band * smoothstep(0.05, 0.4, h) * (1.0 - smoothstep(0.4, 0.8, h));
            gl_FragColor = vec4(c, uMix);
          }`,
      }),
  );

  const cityMat = useConst(() => {
    const map = cityWindows();
    map.repeat.set(1, 2);
    return new MeshStandardMaterial({ color: "#0b111b", emissive: new Color("#ffffff"), emissiveMap: map, emissiveIntensity: 0, roughness: 0.6, metalness: 0.4 });
  });
  const towers = useConst<BoxItem[]>(() => {
    const out: BoxItem[] = [];
    let seed = 9;
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 26; i++) {
      const h = 25 + r() * 75;
      const w = 10 + r() * 16;
      out.push({ p: [-260 + i * 21 + r() * 8, h / 2, -230 - r() * 60], s: [w, h, 12 + r() * 10] });
    }
    return out;
  });

  // Dark treeline ring to break the horizon
  const treeline = useConst<BoxItem[]>(() => {
    const out: BoxItem[] = [];
    let seed = 21;
    const r = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
    for (let i = 0; i < 220; i++) {
      const a = Math.PI * 0.55 + (i / 220) * Math.PI * 1.9;
      const d = 190 + r() * 80;
      const h = 7 + r() * 9;
      const w = 12 + r() * 14;
      out.push({ p: [Math.cos(a) * d, h * 0.3, Math.sin(a) * d - 20], s: [w, h, w] });
    }
    return out;
  });
  const treeMat = useConst(() => new MeshStandardMaterial({ color: "#070b0a", roughness: 1 }));
  const city = useRef<Group>(null);
  useEffect(() => () => [sky, cityMat, treeMat].forEach((m) => m.dispose()), [sky, cityMat, treeMat]);

  useFrame(() => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    const k = ramp(s, T.sky.in);
    sky.uniforms.uMix.value = k;
    cityMat.emissiveIntensity = ramp(s, T.lights.in) * 0.9;
    if (city.current) city.current.visible = k > 0.01;
  });

  return (
    <>
      <mesh material={sky} renderOrder={-1} frustumCulled={false}>
        <sphereGeometry args={[480, 32, 16]} />
      </mesh>
      <group ref={city} visible={false}>
        <BoxInstances items={towers} material={cityMat} castShadow={false} receiveShadow={false} />
        <BoxInstances items={treeline} material={treeMat} geometry={domeGeo} castShadow={false} receiveShadow={false} />
      </group>
    </>
  );
}
