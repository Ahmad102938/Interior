"use client";

import { BoxInstances, Members, latticeSegments, unitCylinder, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { getMaterials } from "../models/materials";

const H = 30;
const BASE = 3.2;
const TOP = 0.95;
const PANELS = 11;

/**
 * SCENE 01 — Telecom infrastructure (procedural prototype).
 * Galvanised self-supporting lattice tower with three antenna sectors,
 * radome microwave dishes, platform, foundations, cabinets, DG set and fence.
 * Replaceable with a client GLB at public/models/telecom/.
 */
export function TelecomScene({ position }: { position: V3 }) {
  const m = getMaterials();

  const tower = useConst(() => latticeSegments({ height: H, baseHalf: BASE, topHalf: TOP, panels: PANELS }));

  const mast = useConst(() => {
    // Antenna mounting pipes, sector arms and the lightning finial.
    const pipes: Segment[] = [];
    const panels: BoxItem[] = [];
    const arms: Segment[] = [];
    [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].forEach((a) => {
      const dx = Math.sin(a);
      const dz = Math.cos(a);
      const r = 1.9;
      const cx = dx * r;
      const cz = dz * r;
      arms.push([[dx * 0.9, H - 2.2, dz * 0.9], [cx, H - 2.2, cz]]);
      arms.push([[dx * 0.9, H - 0.3, dz * 0.9], [cx, H - 0.3, cz]]);
      // Two panels per sector, side by side.
      [-0.45, 0.45].forEach((off) => {
        const px = cx + Math.cos(a) * off;
        const pz = cz - Math.sin(a) * off;
        pipes.push([[px, H - 3.2, pz], [px, H + 0.6, pz]]);
        panels.push({ p: [px + dx * 0.18, H - 1.2, pz + dz * 0.18], s: [0.32, 2.5, 0.12], r: [0, a, 0] });
        // Remote radio units behind the panels.
        panels.push({ p: [px - dx * 0.05, H - 2.7, pz - dz * 0.05], s: [0.28, 0.45, 0.16], r: [0, a, 0] });
      });
    });
    pipes.push([[0, H, 0], [0, H + 3.2, 0]]);
    return { pipes, panels, arms };
  });

  const platform = useConst(() => {
    const items: Segment[] = [];
    const levels = [H - 2.2, H - 9];
    levels.forEach((y) => {
      const t = y / H;
      const h = BASE + (TOP - BASE) * t + 0.9;
      const c: V3[] = [[-h, y, -h], [h, y, -h], [h, y, h], [-h, y, h]];
      for (let i = 0; i < 4; i++) {
        const a = c[i];
        const b = c[(i + 1) % 4];
        items.push([a, b]);
        items.push([[a[0], a[1] + 1.05, a[2]], [b[0], b[1] + 1.05, b[2]]]);
        items.push([a, [a[0], a[1] + 1.05, a[2]]]);
      }
    });
    return items;
  });

  const dishes = useConst<BoxItem[]>(() => [
    { p: [1.7, H - 8.2, 1.2], s: [1.25, 0.42, 1.25], r: [Math.PI / 2, 0, -0.6] },
    { p: [-1.6, H - 7.4, 1.5], s: [0.95, 0.38, 0.95], r: [Math.PI / 2, 0, 0.7] },
    { p: [1.4, H - 12.5, -1.6], s: [0.95, 0.38, 0.95], r: [Math.PI / 2, 0, -2.4] },
  ]);

  const ground = useConst(() => {
    const pedestals: BoxItem[] = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) pedestals.push({ p: [sx * BASE, 0.45, sz * BASE], s: [1.3, 0.9, 1.3] });
    const cabinets: BoxItem[] = [
      { p: [8.2, 1.05, -2.2], s: [1.2, 1.9, 0.9] },
      { p: [8.2, 1.05, -0.6], s: [1.2, 1.9, 0.9] },
      { p: [8.2, 1.05, 1.0], s: [1.2, 1.9, 0.9] },
      { p: [7.6, 0.95, 5.2], s: [3.0, 1.6, 1.4] }, // DG set enclosure
    ];
    const plinths: BoxItem[] = [
      { p: [8.2, 0.08, -0.6], s: [2.0, 0.16, 5.4] },
      { p: [7.6, 0.08, 5.2], s: [3.6, 0.16, 2.0] },
    ];
    // Cable bridge from cabinets to the tower leg.
    const bridge: Segment[] = [
      [[7.4, 2.4, -0.6], [BASE + 0.1, 2.4, -0.6]],
      [[7.4, 2.4, -0.2], [BASE + 0.1, 2.4, -0.2]],
      [[6.2, 0, -0.4], [6.2, 2.4, -0.4]],
      [[4.6, 0, -0.4], [4.6, 2.4, -0.4]],
    ];
    // Perimeter fence: posts and mesh panels, gate gap on the camera side.
    const posts: Segment[] = [];
    const meshes: BoxItem[] = [];
    const half = 11;
    const step = 2.75;
    const edges: [V3, V3][] = [
      [[-half, 0, -half], [half, 0, -half]],
      [[half, 0, -half], [half, 0, half]],
      [[half, 0, half], [-half, 0, half]],
      [[-half, 0, half], [-half, 0, -half]],
    ];
    edges.forEach(([a, b], e) => {
      const len = Math.hypot(b[0] - a[0], b[2] - a[2]);
      const n = Math.round(len / step);
      for (let i = 0; i < n; i++) {
        const t0 = i / n;
        const t1 = (i + 1) / n;
        const x0 = a[0] + (b[0] - a[0]) * t0;
        const z0 = a[2] + (b[2] - a[2]) * t0;
        const x1 = a[0] + (b[0] - a[0]) * t1;
        const z1 = a[2] + (b[2] - a[2]) * t1;
        posts.push([[x0, 0, z0], [x0, 2.4, z0]]);
        const gate = e === 2 && i >= 3 && i <= 4;
        if (!gate) meshes.push({ p: [(x0 + x1) / 2, 1.2, (z0 + z1) / 2], s: [Math.abs(x1 - x0) || 0.02, 2.3, Math.abs(z1 - z0) || 0.02] });
      }
    });
    // Restrained gold inlay framing the compound — a brand cue, not a light show.
    const inlay: BoxItem[] = [
      { p: [0, 0.03, half + 0.6], s: [2 * half + 1.2, 0.02, 0.07] },
      { p: [0, 0.03, -half - 0.6], s: [2 * half + 1.2, 0.02, 0.07] },
      { p: [half + 0.6, 0.03, 0], s: [0.07, 0.02, 2 * half + 1.2] },
      { p: [-half - 0.6, 0.03, 0], s: [0.07, 0.02, 2 * half + 1.2] },
    ];
    return { pedestals, cabinets, plinths, bridge, posts, meshes, inlay };
  });

  return (
    <group position={position}>
      {/* Tower */}
      <Members segments={tower.legs} thickness={0.24} material={m.galvanised} round />
      <Members segments={tower.horizontals} thickness={0.09} material={m.galvanised} />
      <Members segments={tower.diagonals} thickness={0.07} material={m.galvanised} />
      <Members segments={platform} thickness={0.06} material={m.galvanised} />
      <Members segments={mast.pipes} thickness={0.09} material={m.steelDark} round />
      <Members segments={mast.arms} thickness={0.08} material={m.galvanised} />
      <BoxInstances items={mast.panels} material={m.antennaPanel} />
      <BoxInstances items={dishes} material={m.dish} geometry={unitCylinder} />
      {/* Platform gratings */}
      {[H - 2.2, H - 9].map((y) => {
        const h = BASE + (TOP - BASE) * (y / H) + 0.9;
        return (
          <mesh key={y} position={[0, y - 0.02, 0]} castShadow receiveShadow material={m.steelDark}>
            <boxGeometry args={[h * 2, 0.05, h * 2]} />
          </mesh>
        );
      })}
      <mesh position={[0, H + 3.3, 0]} material={m.aviationLight}>
        <sphereGeometry args={[0.13, 12, 12]} />
      </mesh>

      {/* Ground infrastructure */}
      <mesh position={[0, 0.02, 0]} receiveShadow material={m.gravel}>
        <boxGeometry args={[22, 0.04, 22]} />
      </mesh>
      <BoxInstances items={ground.pedestals} material={m.concrete} />
      <BoxInstances items={ground.plinths} material={m.concrete} />
      <BoxInstances items={ground.cabinets} material={m.cabinet} />
      <Members segments={ground.bridge} thickness={0.1} material={m.galvanised} />
      <Members segments={ground.posts} thickness={0.08} material={m.galvanised} round />
      <BoxInstances items={ground.meshes} material={m.fence} castShadow={false} />
      <BoxInstances items={ground.inlay} material={m.goldGuide} castShadow={false} />
    </group>
  );
}
