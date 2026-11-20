"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, CylinderGeometry, MeshStandardMaterial, type Group } from "three";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { getMaterials } from "../models/materials";
import { blocks } from "../models/textures";
import { BoxInstances, Members, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { plot } from "./building";
import { window01 } from "./stage";
import { Worker } from "./Worker";

const wheelGeo = new CylinderGeometry(0.55, 0.55, 0.45, 16);
wheelGeo.rotateX(Math.PI / 2);
const drumGeo = new CylinderGeometry(1.25, 0.8, 4.4, 20);
drumGeo.rotateZ(Math.PI / 2);

/** Walking routes for site crew: from → to (ping-pong). */
const walkers: { a: V3; b: V3; speed: number }[] = [
  { a: [-14, 0, 18], b: [-2, 0, 18], speed: 0.09 },
  { a: [12, 0, 16], b: [12, 0, 26], speed: 0.07 },
  { a: [-26, 0, -6], b: [-26, 0, 8], speed: 0.06 },
  { a: [22, 0, -4], b: [30, 0, 6], speed: 0.08 },
  { a: [-8, 0, 24], b: [4, 0, 27], speed: 0.05 },
  { a: [26, 0, 18], b: [18, 0, 12], speed: 0.07 },
];
const standing: { p: V3; f: number }[] = [
  { p: [-22.5, 0, 16.5], f: 0.4 },
  { p: [16.5, 0, 19.5], f: -1.2 },
  { p: [-28, 0, -12], f: 2.2 },
  { p: [27, 0, 12.5], f: 2.8 },
];

/**
 * Build stage: the working site around the rising building — hoarding, site
 * cabins, plant (excavator, mixer, tipper), material laydown, floodlight masts
 * and crew moving about. Rises in with construction, struck for handover.
 */
export function ConstructionSite({ progress }: { progress: React.RefObject<ProgressController> }) {
  const lib = getMaterials();
  const M = useConst(() => ({
    hoarding: new MeshStandardMaterial({ color: "#172c48", roughness: 0.7 }),
    stripe: new MeshStandardMaterial({ color: "#af8958", metalness: 0.6, roughness: 0.35 }),
    cabin: new MeshStandardMaterial({ color: "#dfe2e3", roughness: 0.6 }),
    window: new MeshStandardMaterial({ color: "#1c2733", roughness: 0.15, metalness: 0.4 }),
    plywood: new MeshStandardMaterial({ color: "#b8893e", roughness: 0.8 }),
    blocks: new MeshStandardMaterial({ map: blocks(1), roughness: 0.95 }),
    rubber: new MeshStandardMaterial({ color: "#151515", roughness: 0.9 }),
    lamp: new MeshStandardMaterial({ color: "#fff7e6", emissive: new Color("#fff1d0"), emissiveIntensity: 1.2 }),
    vest: new MeshStandardMaterial({ color: "#c96f2c", roughness: 0.8, transparent: true }),
    trousers: new MeshStandardMaterial({ color: "#2c3138", roughness: 0.9, transparent: true }),
    skin: new MeshStandardMaterial({ color: "#9b7055", roughness: 0.8, transparent: true }),
    helmet: new MeshStandardMaterial({ color: "#ece7dc", roughness: 0.4, transparent: true }),
  }));
  useEffect(() => () => Object.values(M).forEach((m) => m.dispose()), [M]);

  const kit = useConst(() => {
    const h = 2.4;
    const [x0, x1] = plot.x;
    const [z0, z1] = plot.z;
    const [g0, g1] = plot.gate;
    const hoard: BoxItem[] = [
      { p: [(x0 + x1) / 2, h / 2, z0], s: [x1 - x0, h, 0.12] },
      { p: [x0, h / 2, (z0 + z1) / 2], s: [0.12, h, z1 - z0] },
      { p: [x1, h / 2, (z0 + z1) / 2], s: [0.12, h, z1 - z0] },
      { p: [(x0 + g0) / 2, h / 2, z1], s: [g0 - x0, h, 0.12] },
      { p: [(g1 + x1) / 2, h / 2, z1], s: [x1 - g1, h, 0.12] },
    ];
    const stripes: BoxItem[] = hoard.map((b) => ({ p: [b.p[0], h - 0.25, b.p[2]], s: [b.s[0] + 0.02, 0.12, b.s[2] + 0.02] }));
    const cabins: BoxItem[] = [
      { p: [-28.5, 1.3, -16], s: [6, 2.6, 2.5] },
      { p: [-28.5, 3.95, -16], s: [6, 2.6, 2.5] },
      { p: [-21.8, 1.3, -16], s: [6, 2.6, 2.5] },
    ];
    const cabinWindows: BoxItem[] = cabins.map((c) => ({ p: [c.p[0], c.p[1] + 0.2, c.p[2] + 1.26], s: [4.6, 0.9, 0.04] }));
    // Material laydown
    const stacks: BoxItem[] = [];
    for (let k = 0; k < 6; k++) stacks.push({ p: [27, 0.12 + k * 0.1, 22], s: [2.4, 0.08, 1.2] });
    for (let k = 0; k < 5; k++) stacks.push({ p: [27, 0.12 + k * 0.1, 19.6], s: [2.4, 0.08, 1.2] });
    const pallets: BoxItem[] = [
      ...[0, 1, 2].flatMap((i) => [0, 1].map<BoxItem>((j) => ({ p: [-30 + i * 1.4, 0.45, 3 + j * 1.6], s: [1.2, 0.9, 1.2] }))),
    ];
    const rebar: Segment[] = [];
    for (let i = 0; i < 9; i++) rebar.push([[18, 0.12 + (i % 3) * 0.08, 24 + Math.floor(i / 3) * 0.1], [30, 0.12 + (i % 3) * 0.08, 24 + Math.floor(i / 3) * 0.1]]);
    const pipes: Segment[] = [0, 1, 2, 3].map((i) => [[-31, 0.25 + (i % 2) * 0.3, -6 + i * 0.32], [-23, 0.25 + (i % 2) * 0.3, -6 + i * 0.32]]);
    // Floodlight masts
    const masts: Segment[] = [
      [[-34, 0, -20], [-34, 14, -20]],
      [[34, 0, 28], [34, 14, 28]],
      [[34, 0, -20], [34, 14, -20]],
    ];
    const lamps: BoxItem[] = masts.flatMap(([, top]) => [-0.6, 0.6].map<BoxItem>((dx) => ({ p: [top[0] + dx, top[1] + 0.3, top[2]], s: [1, 0.6, 0.35], r: [0.5, 0, 0] })));
    return { hoard, stripes, cabins, cabinWindows, stacks, pallets, rebar, pipes, masts, lamps };
  });

  const root = useRef<Group>(null);
  const crew = useRef<Group>(null);
  const walkerRefs = useRef<(Group | null)[]>([]);
  const drum = useRef<Group>(null);
  const exBody = useRef<Group>(null);
  const exBoom = useRef<Group>(null);

  useFrame((state) => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    const k = window01(s, T.site.in, T.site.fadeOut);
    if (root.current) {
      root.current.visible = k > 0.001;
      root.current.scale.y = Math.max(0.001, k);
    }
    for (const m of [M.vest, M.trousers, M.skin, M.helmet]) m.opacity = k;
    if (crew.current) crew.current.visible = k > 0.01;
    if (k <= 0.001) return;
    const t = state.clock.elapsedTime;
    walkerRefs.current.forEach((g, i) => {
      if (!g) return;
      const w = walkers[i];
      const u = (Math.sin(t * w.speed * 2 * Math.PI + i) + 1) / 2;
      const dir = Math.cos(t * w.speed * 2 * Math.PI + i) >= 0 ? 1 : -1;
      g.position.set(w.a[0] + (w.b[0] - w.a[0]) * u, Math.abs(Math.sin(t * 6 + i)) * 0.04, w.a[2] + (w.b[2] - w.a[2]) * u);
      g.rotation.y = Math.atan2((w.b[0] - w.a[0]) * dir, (w.b[2] - w.a[2]) * dir);
    });
    if (drum.current) drum.current.rotation.x = t * 1.6;
    if (exBody.current) exBody.current.rotation.y = 0.6 + Math.sin(t * 0.5) * 0.5;
    if (exBoom.current) exBoom.current.rotation.z = -0.35 + Math.sin(t * 0.8) * 0.18;
  });

  return (
    <>
      <group ref={root} visible={false}>
        {/* Hoarding with brand stripe */}
        <BoxInstances items={kit.hoard} material={M.hoarding} />
        <BoxInstances items={kit.stripes} material={M.stripe} castShadow={false} />
        {/* Site cabins */}
        <BoxInstances items={kit.cabins} material={M.cabin} />
        <BoxInstances items={kit.cabinWindows} material={M.window} castShadow={false} />
        {/* Laydown */}
        <BoxInstances items={kit.stacks} material={M.plywood} />
        <BoxInstances items={kit.pallets} material={M.blocks} />
        <Members segments={kit.rebar} thickness={0.06} material={lib.rebar} round />
        <Members segments={kit.pipes} thickness={0.3} material={lib.galvanised} round />
        {/* Floodlights */}
        <Members segments={kit.masts} thickness={0.25} material={lib.galvanised} round />
        <BoxInstances items={kit.lamps} material={M.lamp} castShadow={false} />

        {/* Concrete mixer truck */}
        <group position={[15, 0, 22]} rotation={[0, Math.PI, 0]}>
          <mesh position={[0, 1.15, 0]} material={lib.steelDark} castShadow>
            <boxGeometry args={[8, 0.5, 2.3]} />
          </mesh>
          <mesh position={[3.4, 2.1, 0]} material={M.cabin} castShadow>
            <boxGeometry args={[1.9, 2.1, 2.3]} />
          </mesh>
          <mesh position={[4.36, 2.4, 0]} material={M.window}>
            <boxGeometry args={[0.04, 0.9, 2]} />
          </mesh>
          <group ref={drum} position={[-0.8, 2.75, 0]} rotation={[0, 0, -0.18]}>
            <mesh geometry={drumGeo} material={lib.craneYellow} castShadow />
          </group>
          {[-2.8, -1.6, 3.2].flatMap((x) => [-1.15, 1.15].map((z) => (
            <mesh key={`${x}${z}`} geometry={wheelGeo} material={M.rubber} position={[x, 0.55, z]} />
          )))}
        </group>

        {/* Excavator */}
        <group position={[-23, 0, 13]}>
          <mesh position={[0, 0.45, -1]} material={M.rubber} castShadow>
            <boxGeometry args={[4.4, 0.9, 0.8]} />
          </mesh>
          <mesh position={[0, 0.45, 1]} material={M.rubber} castShadow>
            <boxGeometry args={[4.4, 0.9, 0.8]} />
          </mesh>
          <group ref={exBody} position={[0, 1.1, 0]}>
            <mesh position={[-0.3, 0.8, 0]} material={lib.craneYellow} castShadow>
              <boxGeometry args={[3.2, 1.5, 2.4]} />
            </mesh>
            <mesh position={[0.9, 1.4, 0.7]} material={M.window}>
              <boxGeometry args={[1, 1.4, 0.9]} />
            </mesh>
            <group ref={exBoom} position={[1.2, 1.3, -0.3]}>
              <mesh position={[2.3, 0.9, 0]} rotation={[0, 0, 0.45]} material={lib.craneYellow} castShadow>
                <boxGeometry args={[4.8, 0.5, 0.5]} />
              </mesh>
              <mesh position={[4.9, 0.6, 0]} rotation={[0, 0, -0.9]} material={lib.craneYellow} castShadow>
                <boxGeometry args={[3, 0.4, 0.4]} />
              </mesh>
              <mesh position={[5.7, -0.6, 0]} material={lib.steelDark} castShadow>
                <boxGeometry args={[0.9, 0.8, 1]} />
              </mesh>
            </group>
          </group>
        </group>

        {/* Tipper truck */}
        <group position={[25, 0, -14]} rotation={[0, 0.4, 0]}>
          <mesh position={[0, 1.1, 0]} material={lib.steelDark} castShadow>
            <boxGeometry args={[7, 0.5, 2.3]} />
          </mesh>
          <mesh position={[2.8, 2, 0]} material={M.cabin} castShadow>
            <boxGeometry args={[1.6, 1.9, 2.3]} />
          </mesh>
          <mesh position={[-0.9, 2.1, 0]} rotation={[0, 0, 0.12]} material={lib.craneYellow} castShadow>
            <boxGeometry args={[4.6, 1.5, 2.4]} />
          </mesh>
          {[-2.4, -1.2, 2.6].flatMap((x) => [-1.15, 1.15].map((z) => (
            <mesh key={`${x}${z}`} geometry={wheelGeo} material={M.rubber} position={[x, 0.55, z]} />
          )))}
        </group>
      </group>

      {/* Crew */}
      <group ref={crew} visible={false}>
        {walkers.map((_, i) => (
          <group
            key={`w${i}`}
            ref={(el) => {
              walkerRefs.current[i] = el;
            }}
          >
            <Worker M={M} />
          </group>
        ))}
        {standing.map((w, i) => (
          <group key={`s${i}`} position={w.p} rotation={[0, w.f, 0]}>
            <Worker M={M} />
          </group>
        ))}
      </group>
    </>
  );
}
