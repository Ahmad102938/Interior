"use client";

import { BoxInstances, Members, latticeSegments, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { getMaterials } from "../models/materials";

const TILT = 0.38; // ~22° fixed-tilt
const TABLE_W = 17;
const TABLE_D = 4.4;

/**
 * SCENE 02 — Utility-scale solar (procedural prototype).
 * Fixed-tilt tables with realistic dark PV modules and aluminium framing,
 * driven-pile posts, inverter stations and a small pooling substation.
 */
export function SolarScene({ position, rows = 9 }: { position: V3; rows?: number }) {
  const m = getMaterials();

  const field = useConst(() => {
    const tables: BoxItem[] = [];
    const posts: Segment[] = [];
    const beams: BoxItem[] = [];
    const cols = [-36, -18, 0, 18, 36];
    for (let r = 0; r < rows; r++) {
      const z = 10 - r * 6.4;
      for (const cx of cols) {
        // Low edge faces +z (towards the camera and the sun).
        const yMid = 1.0 + (Math.sin(TILT) * TABLE_D) / 2;
        tables.push({ p: [cx, yMid, z], s: [TABLE_W, 0.05, TABLE_D], r: [TILT, 0, 0] });
        for (let i = 0; i < 5; i++) {
          const x = cx - TABLE_W / 2 + 1 + (i * (TABLE_W - 2)) / 4;
          const front = z + (Math.cos(TILT) * TABLE_D) / 2 - 0.5;
          const back = z - (Math.cos(TILT) * TABLE_D) / 2 + 0.5;
          posts.push([[x, -0.2, front], [x, 1.0 + 0.2, front]]);
          posts.push([[x, -0.2, back], [x, 1.0 + Math.sin(TILT) * TABLE_D - 0.4, back]]);
        }
        beams.push({ p: [cx, yMid - 0.12, z], s: [TABLE_W - 0.2, 0.12, 0.1], r: [TILT, 0, 0] });
      }
    }
    return { tables, posts, beams };
  });

  const bos = useConst(() => {
    const inverters: BoxItem[] = [
      { p: [48, 1.3, 6], s: [3.4, 2.6, 2.2] },
      { p: [48, 1.3, -14], s: [3.4, 2.6, 2.2] },
    ];
    const pads: BoxItem[] = [
      { p: [48, 0.08, 6], s: [4.4, 0.16, 3.2] },
      { p: [48, 0.08, -14], s: [4.4, 0.16, 3.2] },
      { p: [56, 0.1, -4], s: [9, 0.2, 7] },
    ];
    const transformer: BoxItem[] = [
      { p: [55, 1.4, -4], s: [2.6, 2.6, 1.8] },
      ...[-1.1, -0.55, 0, 0.55, 1.1].map<BoxItem>((dx) => ({ p: [55 + dx, 1.3, -2.85], s: [0.18, 2.0, 0.5] })),
    ];
    const g1 = latticeSegments({ height: 7, baseHalf: 0.35, topHalf: 0.35, panels: 5, origin: [52, 0, -7] });
    const g2 = latticeSegments({ height: 7, baseHalf: 0.35, topHalf: 0.35, panels: 5, origin: [60, 0, -7] });
    const gantry: Segment[] = [...g1.legs, ...g1.diagonals, ...g2.legs, ...g2.diagonals, [[52, 7, -7], [60, 7, -7]], [[52, 6.4, -7], [60, 6.4, -7]]];
    const insulators: Segment[] = [53.8, 56, 58.2].map((x) => [[x, 6.4, -7], [x, 5.4, -7]]);
    return { inverters, pads, transformer, gantry, insulators };
  });

  return (
    <group position={position}>
      <mesh position={[0, 0.015, -12]} receiveShadow rotation={[-Math.PI / 2, 0, 0]} material={m.earth}>
        <planeGeometry args={[130, 80]} />
      </mesh>
      <BoxInstances items={field.tables} material={m.pv} />
      <BoxInstances items={field.beams} material={m.aluminium} />
      <Members segments={field.posts} thickness={0.12} material={m.galvanised} />
      <BoxInstances items={bos.pads} material={m.concrete} />
      <BoxInstances items={bos.inverters} material={m.cabinet} />
      <BoxInstances items={bos.transformer} material={m.steelDark} />
      <Members segments={bos.gantry} thickness={0.08} material={m.galvanised} />
      <Members segments={bos.insulators} thickness={0.16} material={m.antennaPanel} round />
    </group>
  );
}
