"use client";

import { BoxInstances, Members, latticeSegments, unitCylinder, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { getMaterials } from "../models/materials";

const LEN = 42;
const BAY = 6;
const SPAN = 24;
const EAVE = 9;
const RIDGE = 11.4;

/**
 * SCENE 03 — Civil / industrial (procedural prototype).
 * Pre-engineered warehouse mid-construction: RCC pedestals, portal frames,
 * purlins, partial cladding, foreground footings with starter bars and a
 * tower crane. Steel and concrete keep their real-world identities.
 */
export function CivilScene({ position }: { position: V3 }) {
  const m = getMaterials();

  const frame = useConst(() => {
    const columns: BoxItem[] = [];
    const rafters: BoxItem[] = [];
    const pedestals: BoxItem[] = [];
    const purlins: BoxItem[] = [];
    const bracing: Segment[] = [];
    const half = SPAN / 2;
    const rafterLen = Math.hypot(half, RIDGE - EAVE);
    const pitch = Math.atan2(RIDGE - EAVE, half);
    for (let i = 0; i <= LEN / BAY; i++) {
      const x = -LEN / 2 + i * BAY;
      for (const sz of [-1, 1]) {
        columns.push({ p: [x, EAVE / 2 + 0.5, sz * half], s: [0.32, EAVE, 0.62] });
        pedestals.push({ p: [x, 0.35, sz * half], s: [1.1, 0.7, 1.3] });
        rafters.push({
          p: [x, (EAVE + RIDGE) / 2 + 0.5, (sz * half) / 2],
          s: [0.3, 0.6, rafterLen],
          r: [sz * pitch, 0, 0],
        });
      }
    }
    // Roof purlins along the full length.
    for (let k = 0; k <= 7; k++) {
      const t = k / 7;
      for (const sz of [-1, 1]) {
        purlins.push({ p: [0, EAVE + 0.95 + t * (RIDGE - EAVE), sz * half * (1 - t)], s: [LEN, 0.2, 0.08] });
      }
    }
    // Wall girts on the back wall.
    for (let k = 1; k <= 4; k++) purlins.push({ p: [0, k * 2.1, -half - 0.1], s: [LEN, 0.16, 0.08] });
    // Rod bracing in the two end bays.
    for (const x0 of [-LEN / 2, LEN / 2 - BAY]) {
      bracing.push([[x0, 0.6, -half], [x0 + BAY, EAVE + 0.5, -half]]);
      bracing.push([[x0 + BAY, 0.6, -half], [x0, EAVE + 0.5, -half]]);
    }
    return { columns, rafters, pedestals, purlins, bracing, pitch, rafterLen };
  });

  const envelope = useConst(() => {
    const half = SPAN / 2;
    const covered = 4 * BAY; // roofed bays at the far end
    const x0 = -LEN / 2 + covered / 2;
    const roof: BoxItem[] = [-1, 1].map((sz) => ({
      p: [x0, (EAVE + RIDGE) / 2 + 1.05, (sz * half) / 2],
      s: [covered, 0.04, frame.rafterLen + 0.6],
      r: [sz * frame.pitch, 0, 0],
    }));
    const walls: BoxItem[] = [
      { p: [x0, EAVE / 2 + 0.5, -half - 0.25], s: [covered, EAVE, 0.04] },
      { p: [-LEN / 2 - 0.25, EAVE / 2 + 0.5, 0], s: [0.04, EAVE, SPAN] },
    ];
    return { roof, walls };
  });

  const site = useConst(() => {
    // Foreground extension footings with starter bars — "past the foundations".
    const footings: BoxItem[] = [];
    const bars: Segment[] = [];
    for (let i = 0; i < 6; i++) {
      const x = -LEN / 2 + 3 + i * 7.2;
      footings.push({ p: [x, 0.3, 19], s: [1.8, 0.6, 1.8] });
      for (const dx of [-0.5, -0.17, 0.17, 0.5]) for (const dz of [-0.5, 0.5]) bars.push([[x + dx, 0.6, 19 + dz], [x + dx, 2.1, 19 + dz]]);
    }
    // Steel stock.
    const stock: BoxItem[] = [];
    for (let k = 0; k < 3; k++) for (let j = 0; j < 4 - k; j++) stock.push({ p: [22 + j * 0.5 + k * 0.25, 0.15 + k * 0.32, 15], s: [0.32, 0.3, 9], r: [0, 0.2, 0] });

    // Tower crane.
    const mast = latticeSegments({ height: 30, baseHalf: 0.8, topHalf: 0.8, panels: 12, origin: [-30, 0, 6] });
    const jib: Segment[] = [];
    const y0 = 30;
    const jibLen = 34;
    const n = 14;
    for (let i = 0; i < n; i++) {
      const xa = -30 + (i * jibLen) / n;
      const xb = -30 + ((i + 1) * jibLen) / n;
      jib.push([[xa, y0, 5.4], [xb, y0, 5.4]], [[xa, y0, 6.6], [xb, y0, 6.6]], [[xa, y0 + 1.4, 6], [xb, y0 + 1.4, 6]]);
      jib.push([[xa, y0, 5.4], [xb, y0 + 1.4, 6]], [[xa, y0, 6.6], [xb, y0 + 1.4, 6]], [[xb, y0, 5.4], [xb, y0, 6.6]]);
    }
    jib.push([[-30, y0, 5.4], [-40, y0, 5.4]], [[-30, y0, 6.6], [-40, y0, 6.6]], [[-30, y0 + 5, 6], [-40, y0, 6]], [[-30, y0 + 5, 6], [-10, y0 + 1.4, 6]]);
    jib.push([[-30, y0, 6], [-30, y0 + 5, 6]]);
    const crane = [...mast.legs, ...mast.diagonals, ...mast.horizontals, ...jib];
    const craneBlocks: BoxItem[] = [
      { p: [-38.5, y0 - 0.6, 6], s: [2.4, 2.2, 1.8] }, // counterweight
      { p: [-28.8, y0 - 1.1, 7.2], s: [1.6, 1.8, 1.4] }, // cab
      { p: [-30, 0.6, 6], s: [4, 1.2, 4] }, // base ballast
    ];
    const hook: Segment[] = [[[-4, y0, 6], [-4, 13, 6]]];
    const load: BoxItem[] = [{ p: [-4, 12.6, 6], s: [6, 0.3, 0.32], r: [0, 0.3, 0] }];
    return { footings, bars, stock, crane, craneBlocks, hook, load };
  });

  return (
    <group position={position}>
      {/* Industrial ground slab */}
      <mesh position={[0, 0.02, 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.concreteDark}>
        <planeGeometry args={[90, 56]} />
      </mesh>
      <mesh position={[0, 0.06, 0]} receiveShadow material={m.concrete}>
        <boxGeometry args={[LEN + 2, 0.08, SPAN + 2]} />
      </mesh>
      <BoxInstances items={frame.pedestals} material={m.concrete} />
      <BoxInstances items={frame.columns} material={m.structuralSteel} />
      <BoxInstances items={frame.rafters} material={m.structuralSteel} />
      <BoxInstances items={frame.purlins} material={m.galvanised} />
      <Members segments={frame.bracing} thickness={0.05} material={m.steelDark} round />
      <BoxInstances items={envelope.roof} material={m.roofSheet} />
      <BoxInstances items={envelope.walls} material={m.wallSheet} />

      <BoxInstances items={site.footings} material={m.concrete} />
      <Members segments={site.bars} thickness={0.035} material={m.rebar} round castShadow={false} />
      <BoxInstances items={site.stock} material={m.primedSteel} />
      <Members segments={site.crane} thickness={0.11} material={m.craneYellow} />
      <BoxInstances items={site.craneBlocks} material={m.concreteDark} />
      <Members segments={site.hook} thickness={0.03} material={m.steelDark} round castShadow={false} />
      <BoxInstances items={site.load} material={m.primedSteel} />
      <BoxInstances
        geometry={unitCylinder}
        items={[{ p: [-4, 13.2, 6], s: [0.5, 0.8, 0.5] }]}
        material={m.craneYellow}
      />
    </group>
  );
}
