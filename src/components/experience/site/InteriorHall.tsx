"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are animated in useFrame */
import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  OctahedronGeometry,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  TorusGeometry,
  Vector3,
  type Group,
} from "three";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { getMaterials } from "../models/materials";
import { carpet, corrugated } from "../models/textures";
import { BoxInstances, Members, unitCylinder, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { ramp } from "./stage";
import { Silhouette } from "./Worker";

/** The hall occupies level 2 of the building (floor +8.4 m). */
const Y0 = 8.4;
const YC = 12.45; // underside of the exposed soffit
const X0 = -19;
const X1 = 21;
const Z0 = -13;
const Z1 = 10.3;

/** Ring pendants (centre x, z, outer radius) — the hall's signature light. */
const RINGS: [number, number, number][] = [
  [-5, -1, 2.1],
  [3, -1, 2.1],
  [11, -1, 2.1],
  [-13, -1, 1.7],
  [-5, 6, 2.1],
  [3, 6, 2.1],
  [11, 6, 2.1],
];
const RING_Y = 11.45;

/** Where the building's six soffit lights relocate once the camera is inside. */
export const INTERIOR_LIGHTS: V3[] = [
  [-5, 10.6, -1],
  [3, 10.6, -1],
  [11, 10.6, -1],
  [3, 10.6, 6],
  [11, 10.6, 6],
  [-13, 10.6, 3],
];

/** Desk clusters (centre x, z): two rows of bench desks around a planted storage spine. */
const CLUSTERS: [number, number][] = [
  [-13, -1],
  [-5, -1],
  [3, -1],
  [11, -1],
  [-5, 6],
  [3, 6],
  [11, 6],
];
const COLUMNS: [number, number][] = [
  [-9, 2.5],
  [-1, 2.5],
  [7, 2.5],
  [15, 2.5],
  [-9, -7],
  [7, -7],
];

const ringGeo = new TorusGeometry(1, 0.045, 10, 128);
ringGeo.rotateX(Math.PI / 2);
const ductGeo = new CylinderGeometry(0.32, 0.32, 1, 20, 1, true);
ductGeo.rotateZ(Math.PI / 2);
// Slim pointed leaf: a flattened octahedron reads as a lanceolate tropical leaf.
const leafGeo = new OctahedronGeometry(1, 0);
const chairBaseGeo = new CylinderGeometry(0.03, 0.03, 0.4, 6);

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

/** Tropical planting: arching leaves around each plant centre, one InstancedMesh per tone. */
function Plants({ centres, material, material2 }: { centres: V3[]; material: MeshStandardMaterial; material2: MeshStandardMaterial }) {
  const a = useRef<InstancedMesh>(null);
  const b = useRef<InstancedMesh>(null);
  const leaves = useConst(() => {
    const out: [Matrix4[], Matrix4[]] = [[], []];
    const rand = rng(77);
    const q = new Quaternion();
    const e = new Euler();
    for (const c of centres) {
      const n = 11 + Math.floor(rand() * 5);
      for (let i = 0; i < n; i++) {
        const yaw = (i / n) * Math.PI * 2 + rand() * 0.6;
        const tilt = 0.25 + rand() * 0.85;
        const len = 0.42 + rand() * 0.34;
        e.set(0, yaw, 0);
        const yawQ = new Quaternion().setFromEuler(e);
        q.setFromEuler(new Euler(tilt, 0, 0)).premultiply(yawQ);
        const dir = new Vector3(0, len * 0.85, 0).applyQuaternion(q);
        const m = new Matrix4().compose(new Vector3(c[0] + dir.x, c[1] + dir.y + 0.05, c[2] + dir.z), q, new Vector3(0.11, len, 0.018));
        out[i % 3 === 0 ? 1 : 0].push(m);
      }
    }
    return out;
  });
  useLayoutEffect(() => {
    [a.current, b.current].forEach((mesh, k) => {
      if (!mesh) return;
      leaves[k].forEach((m, i) => mesh.setMatrixAt(i, m));
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    });
  }, [leaves]);
  return (
    <>
      <instancedMesh ref={a} args={[leafGeo, material, leaves[0].length]} />
      <instancedMesh ref={b} args={[leafGeo, material2, leaves[1].length]} />
    </>
  );
}

/**
 * INTERIOR — a finished open-plan office hall on level 2: exposed dark soffit
 * with spiral ducts and ring pendants, full-height glazing over the plaza and
 * city, oak-and-black bench desks around planted storage spines, glass meeting
 * rooms, kitchen island, lounge and an oak-slat feature wall.
 */
export function InteriorHall({ progress }: { progress: React.RefObject<ProgressController> }) {
  const lib = getMaterials();
  const M = useConst(() => {
    const floor = carpet();
    floor.repeat.set(20, 11.5);
    const duct = corrugated("#b8bec4", 1);
    duct.repeat.set(30, 1);
    return {
      carpet: new MeshStandardMaterial({ map: floor, roughness: 0.95 }),
      soffit: new MeshStandardMaterial({ color: "#26292d", roughness: 0.9 }),
      duct: new MeshStandardMaterial({ map: duct, metalness: 0.75, roughness: 0.35 }),
      ring: new MeshStandardMaterial({ color: "#fff7ea", emissive: new Color("#ffe6c2"), emissiveIntensity: 0 }),
      downlight: new MeshStandardMaterial({ color: "#fff7ea", emissive: new Color("#ffe9cc"), emissiveIntensity: 0 }),
      black: new MeshStandardMaterial({ color: "#1b1c1e", roughness: 0.55, metalness: 0.2 }),
      plaster: new MeshStandardMaterial({ color: "#efebe4", roughness: 0.9 }),
      glass: new MeshStandardMaterial({ color: "#a9c2d6", metalness: 0.2, roughness: 0.05, transparent: true, opacity: 0.14, depthWrite: false, side: DoubleSide, envMapIntensity: 1.6 }),
      screen: new MeshStandardMaterial({ color: "#0e1520", emissive: new Color("#7fa6cc"), emissiveIntensity: 0 }),
      chair: new MeshStandardMaterial({ color: "#232528", roughness: 0.75 }),
      leaf: new MeshStandardMaterial({ color: "#2f6b34", roughness: 0.7, side: DoubleSide }),
      leaf2: new MeshStandardMaterial({ color: "#4f8a3c", roughness: 0.7, side: DoubleSide }),
      soil: new MeshStandardMaterial({ color: "#2a2018", roughness: 1 }),
      sofa: new MeshStandardMaterial({ color: "#b9b2a6", roughness: 0.95 }),
    };
  });
  useEffect(() => () => Object.values(M).forEach((m) => m.dispose()), [M]);

  const kit = useConst(() => {
    const cx = (X0 + X1) / 2;
    const cz = (Z0 + Z1) / 2;
    const W = X1 - X0;
    const D = Z1 - Z0;
    const walls: BoxItem[] = [
      { p: [X0 - 0.15, (Y0 + YC) / 2, cz], s: [0.3, YC - Y0, D] },
      { p: [cx, (Y0 + YC) / 2, Z0 - 0.15], s: [W, YC - Y0, 0.3] },
    ];
    const cols: BoxItem[] = COLUMNS.map(([x, z]) => ({ p: [x, (Y0 + YC) / 2, z], s: [0.7, YC - Y0, 0.7] }));

    // Exposed services: spiral ducts, hangers, cable trays
    const ducts: BoxItem[] = [-8.5, -1.5, 5.2].map((z) => ({ p: [cx, 12.0, z], s: [W - 1, 1, 1] }));
    const hangers: Segment[] = [];
    for (const z of [-8.5, -1.5, 5.2]) for (let x = X0 + 2; x < X1; x += 4) hangers.push([[x, 12.32, z], [x, YC, z]]);
    const trays: BoxItem[] = [2.2, 9.2].map((z) => ({ p: [cx, 12.2, z], s: [W - 1, 0.06, 0.4] }));

    // Ring pendants: outer + inner concentric rings, three suspension wires each
    const rings: BoxItem[] = [];
    const wires: Segment[] = [];
    for (const [x, z, r] of RINGS) {
      rings.push({ p: [x, RING_Y, z], s: [r, 1, r] }, { p: [x, RING_Y - 0.28, z], s: [r * 0.62, 1, r * 0.62] });
      for (let k = 0; k < 3; k++) {
        const a = (k / 3) * Math.PI * 2;
        wires.push([[x + Math.cos(a) * r, RING_Y, z + Math.sin(a) * r], [x + Math.cos(a) * r * 0.4, YC, z + Math.sin(a) * r * 0.4]]);
      }
    }
    const downlights: BoxItem[] = [];
    for (let x = X0 + 2; x < X1 - 1; x += 3) for (const z of [-11, 2.6, 9.2]) downlights.push({ p: [x, YC - 0.02, z], s: [0.32, 0.03, 0.32] });

    // Curtain wall: front + right
    const glass: BoxItem[] = [
      { p: [cx, (Y0 + YC) / 2, Z1], s: [W, YC - Y0, 0.03] },
      { p: [X1, (Y0 + YC) / 2, cz], s: [0.03, YC - Y0, D] },
    ];
    const mullions: Segment[] = [];
    for (let x = X0; x <= X1 + 0.01; x += 1.6) mullions.push([[x, Y0, Z1], [x, YC, Z1]]);
    for (let z = Z0; z <= Z1 + 0.01; z += 1.6) mullions.push([[X1, Y0, z], [X1, YC, z]]);
    for (const y of [Y0 + 0.06, Y0 + 2.7, YC - 0.05]) {
      mullions.push([[X0, y, Z1], [X1, y, Z1]], [[X1, y, Z0], [X1, y, Z1]]);
    }

    // Workstations
    const tops: BoxItem[] = [];
    const legs: BoxItem[] = [];
    const spines: BoxItem[] = [];
    const fronts: BoxItem[] = [];
    const troughs: BoxItem[] = [];
    const soil: BoxItem[] = [];
    const screens: BoxItem[] = [];
    const seats: BoxItem[] = [];
    const backs: BoxItem[] = [];
    const chairBases: Segment[] = [];
    const plants: V3[] = [];
    for (const [ccx, ccz] of CLUSTERS) {
      for (const side of [-1, 1]) {
        for (const i of [-1, 0, 1]) {
          const x = ccx + i * 1.65;
          const z = ccz + side * 0.72;
          tops.push({ p: [x, Y0 + 0.74, z], s: [1.6, 0.04, 0.8] });
          screens.push({ p: [x, Y0 + 1.06, ccz + side * 0.42], s: [0.62, 0.38, 0.03] });
          const sz = ccz + side * 1.5;
          seats.push({ p: [x, Y0 + 0.48, sz], s: [0.52, 0.07, 0.5] });
          backs.push({ p: [x, Y0 + 0.86, sz + side * 0.25], s: [0.5, 0.6, 0.05] });
          chairBases.push([[x, Y0 + 0.06, sz], [x, Y0 + 0.46, sz]]);
        }
        legs.push({ p: [ccx - 2.45, Y0 + 0.37, ccz + side * 0.72], s: [0.05, 0.74, 0.7] }, { p: [ccx + 2.45, Y0 + 0.37, ccz + side * 0.72], s: [0.05, 0.74, 0.7] });
      }
      // Planted storage spine (black carcass, oak fronts) + end cap
      spines.push({ p: [ccx, Y0 + 0.42, ccz], s: [5, 0.84, 0.46] });
      fronts.push({ p: [ccx, Y0 + 0.42, ccz - 0.235], s: [4.9, 0.74, 0.01] }, { p: [ccx, Y0 + 0.42, ccz + 0.235], s: [4.9, 0.74, 0.01] });
      troughs.push({ p: [ccx, Y0 + 0.98, ccz], s: [5, 0.28, 0.46] });
      soil.push({ p: [ccx, Y0 + 1.11, ccz], s: [4.9, 0.02, 0.38] });
      for (const dx of [-1.9, -0.65, 0.65, 1.9]) plants.push([ccx + dx, Y0 + 1.12, ccz]);
      spines.push({ p: [ccx - 2.8, Y0 + 0.55, ccz], s: [0.55, 1.1, 2.1] });
      fronts.push({ p: [ccx - 3.08, Y0 + 0.55, ccz], s: [0.01, 1, 2] });
      troughs.push({ p: [ccx - 2.8, Y0 + 1.22, ccz], s: [0.55, 0.26, 2.1] });
      for (const dz of [-0.6, 0.6]) plants.push([ccx - 2.8, Y0 + 1.35, ccz + dz]);
    }

    // Meeting rooms (glass) along the back
    const rooms: [number, number][] = [
      [-18.6, -10],
      [14, 20.8],
    ];
    const roomGlass: BoxItem[] = [];
    const roomTables: BoxItem[] = [];
    const roomChairs: BoxItem[] = [];
    for (const [a, b] of rooms) {
      roomGlass.push({ p: [(a + b) / 2, (Y0 + YC) / 2, -8.2], s: [b - a, YC - Y0, 0.03] });
      roomGlass.push({ p: [a === -18.6 ? b : a, (Y0 + YC) / 2, -10.6], s: [0.03, YC - Y0, 4.8] });
      roomTables.push({ p: [(a + b) / 2, Y0 + 0.75, -10.6], s: [3.8, 0.06, 1.4] });
      for (let k = 0; k < 4; k++) for (const sz of [-1, 1]) roomChairs.push({ p: [(a + b) / 2 - 1.35 + k * 0.9, Y0 + 0.5, -10.6 + sz * 1.05], s: [0.5, 0.08, 0.5] });
    }

    // Kitchen island + oak shelving on the back wall
    const island: BoxItem[] = [{ p: [2.5, Y0 + 0.48, -10.2], s: [6, 0.96, 1.2] }];
    const shelving: BoxItem[] = [];
    for (let k = 0; k < 5; k++) shelving.push({ p: [2.5, Y0 + 0.5 + k * 0.6, -12.75], s: [10, 0.04, 0.4] });
    for (const x of [-2.5, 2.5, 7.5]) shelving.push({ p: [x, Y0 + 1.6, -12.75], s: [0.04, 3.2, 0.4] });

    // Lounge (front-left, by the window)
    const sofa: BoxItem[] = [
      { p: [-16.6, Y0 + 0.24, 6.5], s: [1, 0.48, 4.2] },
      { p: [-17.05, Y0 + 0.62, 6.5], s: [0.22, 0.6, 4.2] },
      { p: [-14.6, Y0 + 0.24, 8.8], s: [3.2, 0.48, 1] },
    ];
    const coffee: BoxItem[] = [{ p: [-14.4, Y0 + 0.2, 6.2], s: [1.4, 0.4, 1.4] }];
    const rug: BoxItem[] = [{ p: [-15, Y0 + 0.012, 6.6], s: [5.2, 0.01, 5] }];

    // Feature wall: oak slats over maroon, left wall
    const slats: BoxItem[] = [];
    for (let z = -6; z <= 4; z += 0.22) slats.push({ p: [X0 + 0.06, (Y0 + YC) / 2, z], s: [0.06, YC - Y0, 0.08] });

    return {
      walls, cols, ducts, hangers, trays, rings, wires, downlights, glass, mullions, tops, legs, spines, fronts, troughs, soil, screens, seats, backs, chairBases, plants,
      roomGlass, roomTables, roomChairs, island, shelving, sofa, coffee, rug, slats,
    };
  });

  const root = useRef<Group>(null);
  useFrame(() => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    const vis = ramp(s, T.interior.in) * (1 - ramp(s, T.interior.out));
    if (root.current) root.current.visible = vis > 0.001;
    if (vis <= 0.001) return;
    const lit = ramp(s, T.interior.lights);
    M.ring.emissiveIntensity = 0.5 + lit * 2;
    M.downlight.emissiveIntensity = 0.4 + lit * 2.2;
    M.screen.emissiveIntensity = 0.15 + lit * 0.35;
  });

  const people: { p: V3; r: number }[] = [
    { p: [1.2, Y0, -8.6], r: 0.4 },
    { p: [3.4, Y0, -8.8], r: -2.6 },
    { p: [-9.6, Y0, 7.6], r: 1.2 },
    { p: [-1.4, Y0, 3.6], r: -1.8 },
  ];

  return (
    <group ref={root} visible={false}>
      {/* Floor, soffit, enclosure */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[(X0 + X1) / 2, Y0 + 0.01, (Z0 + Z1) / 2]} material={M.carpet} receiveShadow>
        <planeGeometry args={[X1 - X0, Z1 - Z0]} />
      </mesh>
      <mesh position={[(X0 + X1) / 2, YC + 0.1, (Z0 + Z1) / 2]} material={M.soffit}>
        <boxGeometry args={[X1 - X0, 0.2, Z1 - Z0]} />
      </mesh>
      <BoxInstances items={kit.walls} material={M.plaster} castShadow={false} />
      <BoxInstances items={kit.cols} material={M.plaster} castShadow={false} />
      <mesh position={[X0 + 0.02, (Y0 + YC) / 2, -1]} material={lib.maroonAccent}>
        <boxGeometry args={[0.02, YC - Y0, 10.4]} />
      </mesh>
      <BoxInstances items={kit.slats} material={lib.oak} castShadow={false} />

      {/* Exposed services */}
      <BoxInstances items={kit.ducts} material={M.duct} geometry={ductGeo} castShadow={false} receiveShadow={false} />
      <BoxInstances items={kit.trays} material={lib.galvanised} castShadow={false} />
      <Members segments={kit.hangers} thickness={0.03} material={lib.blackMetal} castShadow={false} />

      {/* Lighting */}
      <BoxInstances items={kit.rings} material={M.ring} geometry={ringGeo} castShadow={false} receiveShadow={false} />
      <Members segments={kit.wires} thickness={0.008} material={lib.blackMetal} castShadow={false} />
      <BoxInstances items={kit.downlights} material={M.downlight} geometry={unitCylinder} castShadow={false} receiveShadow={false} />

      {/* Curtain wall */}
      <BoxInstances items={kit.glass} material={M.glass} castShadow={false} receiveShadow={false} />
      <Members segments={kit.mullions} thickness={0.08} material={lib.blackMetal} castShadow={false} />

      {/* Workstations & planting */}
      <BoxInstances items={kit.tops} material={lib.oak} castShadow={false} />
      <BoxInstances items={kit.legs} material={M.black} castShadow={false} />
      <BoxInstances items={kit.spines} material={M.black} castShadow={false} />
      <BoxInstances items={kit.fronts} material={lib.oak} castShadow={false} />
      <BoxInstances items={kit.troughs} material={M.black} castShadow={false} />
      <BoxInstances items={kit.soil} material={M.soil} castShadow={false} />
      <BoxInstances items={kit.screens} material={M.screen} castShadow={false} />
      <BoxInstances items={kit.seats} material={M.chair} castShadow={false} />
      <BoxInstances items={kit.backs} material={M.chair} castShadow={false} />
      <BoxInstances items={kit.chairBases.map(([a, b]) => ({ p: [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2, a[2]], s: [1, b[1] - a[1], 1] }))} material={M.chair} geometry={chairBaseGeo} castShadow={false} />
      <Plants centres={kit.plants} material={M.leaf} material2={M.leaf2} />

      {/* Meeting rooms, kitchen, lounge */}
      <BoxInstances items={kit.roomGlass} material={M.glass} castShadow={false} receiveShadow={false} />
      <BoxInstances items={kit.roomTables} material={lib.oak} castShadow={false} />
      <BoxInstances items={kit.roomChairs} material={M.chair} castShadow={false} />
      <BoxInstances items={kit.island} material={lib.stone} castShadow={false} />
      <BoxInstances items={kit.shelving} material={lib.oak} castShadow={false} />
      <BoxInstances items={kit.rug} material={lib.maroonFabric} castShadow={false} />
      <BoxInstances items={kit.sofa} material={M.sofa} castShadow={false} />
      <BoxInstances items={kit.coffee} material={lib.stone} castShadow={false} />

      {people.map((h, i) => (
        <group key={i} position={h.p} rotation={[0, h.r, 0]}>
          <Silhouette material={M.chair} />
        </group>
      ))}
    </group>
  );
}
