"use client";

import { IcosahedronGeometry } from "three";
import { BoxInstances, Members, unitCylinder, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { getMaterials } from "../models/materials";

const foliageGeometry = new IcosahedronGeometry(0.5, 1);

const X0 = -15;
const X1 = 15;
const Z0 = -16;
const Z1 = 10;
const CH = 4.2; // clear height
const DOOR: [number, number] = [-10, -2.5]; // entrance gap in the front glazing

/**
 * SCENE 04 — Commercial interior & fit-out (procedural prototype).
 * Completed workplace: oak and stone floors, timber-slat feature wall with a
 * wine-maroon accent, glass meeting room, bench workstations, lounge, linear
 * lighting and HVAC diffusers. The camera enters through the glazed facade.
 */
export function InteriorScene({ position }: { position: V3 }) {
  const m = getMaterials();
  const W = X1 - X0;
  const D = Z1 - Z0;
  const cx = (X0 + X1) / 2;
  const cz = (Z0 + Z1) / 2;

  const shell = useConst(() => {
    const walls: BoxItem[] = [
      { p: [cx, CH / 2, Z0 - 0.15], s: [W + 0.6, CH + 0.4, 0.3] },
      { p: [X0 - 0.15, CH / 2, cz], s: [0.3, CH + 0.4, D] },
    ];
    const slab: BoxItem[] = [{ p: [cx, CH + 0.3, cz], s: [W + 0.6, 0.6, D + 0.6] }];
    // Curtain wall mullions: front (with entrance gap) and right side.
    const mullions: Segment[] = [];
    const glass: BoxItem[] = [];
    for (let x = X0; x <= X1 + 0.01; x += 2.5) {
      const inDoor = x > DOOR[0] + 0.01 && x < DOOR[1] - 0.01;
      if (!inDoor) mullions.push([[x, 0, Z1], [x, CH, Z1]]);
      const xn = x + 2.5;
      if (xn <= X1 + 0.01 && !(x >= DOOR[0] - 0.01 && xn <= DOOR[1] + 0.01)) glass.push({ p: [x + 1.25, CH / 2, Z1], s: [2.5, CH, 0.02] });
    }
    for (let z = Z0; z <= Z1 + 0.01; z += 2.6) {
      mullions.push([[X1, 0, z], [X1, CH, z]]);
      if (z + 2.6 <= Z1 + 0.01) glass.push({ p: [X1, CH / 2, z + 1.3], s: [0.02, CH, 2.6] });
    }
    mullions.push([[X0, CH, Z1], [X1, CH, Z1]], [[X0, 0.02, Z1], [DOOR[0], 0.02, Z1]], [[DOOR[1], 0.02, Z1], [X1, 0.02, Z1]]);
    mullions.push([[X1, CH, Z0], [X1, CH, Z1]], [[X1, 0.02, Z0], [X1, 0.02, Z1]]);
    return { walls, slab, mullions, glass };
  });

  const featureWall = useConst(() => {
    // Vertical oak slats over a wine-maroon backing behind reception.
    const slats: BoxItem[] = [];
    for (let i = 0; i < 34; i++) slats.push({ p: [-11 + i * 0.24, CH / 2, Z0 + 0.12], s: [0.09, CH, 0.06] });
    return { slats };
  });

  const ceiling = useConst(() => {
    const lights: BoxItem[] = [];
    const diffusers: BoxItem[] = [];
    for (let x = -12; x <= 12; x += 4) for (const z of [-11, -4.5, 2]) lights.push({ p: [x, CH - 0.02, z], s: [0.12, 0.03, 4.2] });
    for (const z of [-14, 8]) diffusers.push({ p: [0, CH - 0.01, z], s: [26, 0.02, 0.1] });
    return { lights, diffusers };
  });

  const meeting = useConst(() => {
    const mx0 = 4;
    const mz1 = -6;
    const glass: BoxItem[] = [
      { p: [(mx0 + X1) / 2, CH / 2, mz1], s: [X1 - mx0, CH, 0.02] },
      { p: [mx0, CH / 2, (Z0 + mz1) / 2], s: [0.02, CH, mz1 - Z0] },
    ];
    const frames: Segment[] = [];
    for (let x = mx0; x <= X1; x += 1.8) frames.push([[x, 0, mz1], [x, CH, mz1]]);
    frames.push([[mx0, 0, Z0], [mx0, CH, Z0]], [[mx0, CH - 0.02, mz1], [X1, CH - 0.02, mz1]], [[mx0, CH - 0.02, Z0], [mx0, CH - 0.02, mz1]]);
    const table: BoxItem[] = [{ p: [9.5, 0.76, -11], s: [5.4, 0.06, 1.7] }];
    const tableLegs: BoxItem[] = [
      { p: [7.6, 0.38, -11], s: [0.08, 0.76, 1.2] },
      { p: [11.4, 0.38, -11], s: [0.08, 0.76, 1.2] },
    ];
    const chairs: BoxItem[] = [];
    const backs: BoxItem[] = [];
    for (let i = 0; i < 4; i++) {
      const x = 7.6 + i * 1.27;
      for (const sz of [-1, 1]) {
        chairs.push({ p: [x, 0.46, -11 + sz * 1.25], s: [0.55, 0.08, 0.55] });
        backs.push({ p: [x, 0.8, -11 + sz * 1.52], s: [0.55, 0.62, 0.07] });
      }
    }
    const pendant: BoxItem[] = [{ p: [9.5, CH - 1.3, -11], s: [4.2, 0.05, 0.12] }];
    const wires: Segment[] = [[[8, CH - 1.3, -11], [8, CH, -11]], [[11, CH - 1.3, -11], [11, CH, -11]]];
    return { glass, frames, table, tableLegs, chairs, backs, pendant, wires };
  });

  const work = useConst(() => {
    const tops: BoxItem[] = [];
    const legs: BoxItem[] = [];
    const screens: BoxItem[] = [];
    const seats: BoxItem[] = [];
    const backs: BoxItem[] = [];
    for (let r = 0; r < 3; r++) {
      const z = -7 + r * 4.4;
      for (let c = 0; c < 3; c++) {
        const x = -12.6 + c * 3.4;
        tops.push({ p: [x, 0.74, z], s: [3.2, 0.04, 1.6] });
        legs.push({ p: [x - 1.5, 0.37, z], s: [0.06, 0.74, 1.4] }, { p: [x + 1.5, 0.37, z], s: [0.06, 0.74, 1.4] });
        screens.push({ p: [x, 1.0, z], s: [3.2, 0.48, 0.04] });
        for (const sz of [-1, 1])
          for (const dx of [-0.8, 0.8]) {
            seats.push({ p: [x + dx, 0.47, z + sz * 1.15], s: [0.52, 0.08, 0.52] });
            backs.push({ p: [x + dx, 0.82, z + sz * 1.42], s: [0.5, 0.6, 0.06] });
          }
      }
    }
    return { tops, legs, screens, seats, backs };
  });

  const lounge = useConst(() => ({
    sofa: [
      { p: [8, 0.25, 5.6], s: [4, 0.5, 1.0] },
      { p: [8, 0.65, 6.0], s: [4, 0.5, 0.2] },
      { p: [6.1, 0.45, 5.6], s: [0.2, 0.4, 1.0] },
      { p: [9.9, 0.45, 5.6], s: [0.2, 0.4, 1.0] },
    ] as BoxItem[],
    table: [{ p: [8, 0.22, 3.8], s: [1.3, 0.44, 1.3] }] as BoxItem[],
    rug: [{ p: [8, 0.012, 4.6], s: [6, 0.01, 4] }] as BoxItem[],
    reception: [{ p: [-6.5, 0.55, -12.4], s: [4.4, 1.1, 1.0] }] as BoxItem[],
    receptionTrim: [{ p: [-6.5, 1.11, -12.4], s: [4.45, 0.02, 1.05] }] as BoxItem[],
    planters: [
      { p: [-13.6, 0.35, 8.4], s: [0.8, 0.7, 0.8] },
      { p: [2.6, 0.35, -14.6], s: [0.8, 0.7, 0.8] },
      { p: [13.2, 0.35, 8.6], s: [0.8, 0.7, 0.8] },
      { p: [-2.4, 0.35, 8.4], s: [0.8, 0.7, 0.8] },
    ] as BoxItem[],
    columns: [
      { p: [0.5, CH / 2, -2.5], s: [0.6, CH, 0.6] },
      { p: [0.5, CH / 2, 5.5], s: [0.6, CH, 0.6] },
    ] as BoxItem[],
  }));

  const foliage: BoxItem[] = lounge.planters.map((p) => ({ p: [p.p[0], 1.25, p.p[2]], s: [1.1, 1.3, 1.1] }));

  return (
    <group position={position}>
      {/* Approach plaza */}
      <mesh position={[cx, 0.02, Z1 + 9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.stoneFloor}>
        <planeGeometry args={[W + 8, 18]} />
      </mesh>
      {/* Floors: oak in workspace, stone at the entrance and reception */}
      <mesh position={[cx, 0.03, cz]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.oakFloor}>
        <planeGeometry args={[W, D]} />
      </mesh>
      <mesh position={[-7.5, 0.035, -9]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow material={m.stoneFloor}>
        <planeGeometry args={[15, 14]} />
      </mesh>
      <mesh position={[cx, CH - 0.001, cz]} rotation={[Math.PI / 2, 0, 0]} material={m.ceiling}>
        <planeGeometry args={[W, D]} />
      </mesh>

      <BoxInstances items={shell.walls} material={m.plaster} />
      <BoxInstances items={shell.slab} material={m.concreteDark} />
      <BoxInstances items={shell.glass} material={m.glass} castShadow={false} receiveShadow={false} />
      <Members segments={shell.mullions} thickness={0.08} material={m.mullion} />

      {/* Feature wall */}
      <mesh position={[-7, CH / 2, Z0 + 0.04]} material={m.maroonAccent}>
        <boxGeometry args={[9, CH, 0.04]} />
      </mesh>
      <BoxInstances items={featureWall.slats} material={m.oak} />

      <BoxInstances items={ceiling.lights} material={m.lightPanel} castShadow={false} />
      <BoxInstances items={ceiling.diffusers} material={m.blackMetal} castShadow={false} />

      {/* Meeting room */}
      <BoxInstances items={meeting.glass} material={m.glass} castShadow={false} receiveShadow={false} />
      <Members segments={meeting.frames} thickness={0.05} material={m.blackMetal} />
      <BoxInstances items={meeting.table} material={m.oak} />
      <BoxInstances items={meeting.tableLegs} material={m.blackMetal} />
      <BoxInstances items={meeting.chairs} material={m.upholsteryDark} />
      <BoxInstances items={meeting.backs} material={m.upholsteryDark} />
      <BoxInstances items={meeting.pendant} material={m.lightPanel} castShadow={false} />
      <Members segments={meeting.wires} thickness={0.01} material={m.blackMetal} castShadow={false} />

      {/* Workstations */}
      <BoxInstances items={work.tops} material={m.oak} />
      <BoxInstances items={work.legs} material={m.blackMetal} />
      <BoxInstances items={work.screens} material={m.maroonFabric} />
      <BoxInstances items={work.seats} material={m.upholstery} />
      <BoxInstances items={work.backs} material={m.upholstery} />

      {/* Lounge, reception, planting */}
      <BoxInstances items={lounge.rug} material={m.maroonFabric} castShadow={false} />
      <BoxInstances items={lounge.sofa} material={m.upholstery} />
      <BoxInstances items={lounge.table} material={m.stone} />
      <BoxInstances items={lounge.reception} material={m.stone} />
      <BoxInstances items={lounge.receptionTrim} material={m.goldTrim} castShadow={false} />
      <BoxInstances items={lounge.columns} material={m.plaster} geometry={unitCylinder} />
      <BoxInstances items={lounge.planters} material={m.planter} geometry={unitCylinder} />
      <BoxInstances items={foliage} material={m.foliage} geometry={foliageGeometry} />

      {/* Warm interior fill — no shadows, kept cheap */}
      <pointLight position={[-6, CH - 0.4, -4]} intensity={18} distance={16} decay={2} color="#ffe2bd" />
      <pointLight position={[8, CH - 0.4, 2]} intensity={14} distance={14} decay={2} color="#ffe2bd" />
      <pointLight position={[9.5, CH - 1.5, -11]} intensity={10} distance={9} decay={2} color="#ffd9ad" />
      <pointLight position={[-8, CH - 0.4, -12]} intensity={10} distance={10} decay={2} color="#ffd9ad" />
    </group>
  );
}

