"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are animated in useFrame */
import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  Color,
  CylinderGeometry,
  DoubleSide,
  Euler,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Quaternion,
  RingGeometry,
  Vector3,
  type BufferGeometry,
  type Group,
  type InstancedMesh,
  type Material,
  type Mesh,
} from "three";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { getMaterials } from "../models/materials";
import { solarModule } from "../models/textures";
import { BoxInstances, Members, latticeSegments, unitBox, unitCylinder, useConst, type BoxItem, type Segment, type V3 } from "../models/primitives";
import { contextBlocks, roads, type Vol } from "./building";
import { ramp, window01 } from "./stage";

/*
 * Traces of the other two verticals around the civil/interiors story. A telecom
 * tower and a ground-mounted solar farm (with a solar carport and EV chargers)
 * follow the same life as the building: drawn in Design, set out in Plan, built
 * piece by piece through Build, live at dusk. Neighbouring roofs carry solar,
 * EVs use the streets. Supporting cast only — none of it stands in front of
 * the building or the copy.
 */

/** Telecom tower base — in the sky gap right of the building on the main camera path. */
const TOWER: V3 = [65.5, 0, -6];
const TOWER_H = 42;
/** Rooftop mast on neighbour n4 (roof at +16 m); joins the dusk city so it never reads as part of the build. */
const ROOF_MAST: V3 = [77, 16, -30];
/** Solar farm: the strip between the plot hoarding (x 36) and the east street (x 50). */
const FARM = { x: [38.6, 49] as [number, number], rows: [-7, -4.1, -1.2, 1.7, 4.6, 7.5, 10.4] };
const FARM_TILT = 0.42;
/** Solar carport + EV chargers at the south end of the same strip. */
const HUB: V3 = [43.8, 0, 20];

/** Neighbours carrying rooftop solar (by name in `contextBlocks`). */
const SOLAR_ROOFS = ["n1", "n4", "n5", "n6", "n8"];

const wheelGeo = new CylinderGeometry(0.36, 0.36, 0.26, 14);
wheelGeo.rotateX(Math.PI / 2);
const ringGeo = new RingGeometry(0.94, 1, 64);
ringGeo.rotateX(-Math.PI / 2);

/* ---------- Instance helpers ---------- */

const UP = new Vector3(0, 1, 0);

function segMatrix([p0, p1]: Segment, thickness: number) {
  const a = new Vector3(...p0);
  const b = new Vector3(...p1);
  const dir = new Vector3().subVectors(b, a);
  const len = dir.length();
  const q = new Quaternion().setFromUnitVectors(UP, dir.normalize());
  return new Matrix4().compose(a.add(b).multiplyScalar(0.5), q, new Vector3(thickness, len, thickness));
}

function boxMatrix(b: BoxItem) {
  return new Matrix4().compose(new Vector3(...b.p), new Quaternion().setFromEuler(new Euler(...(b.r ?? [0, 0, 0]))), new Vector3(...b.s));
}

const lowestY = ([a, b]: Segment) => Math.min(a[1], b[1]);

/**
 * Instances that appear one after another as `frac` goes 0 → 1. The piece
 * being placed is lowered the last `drop` metres into position, so arrays and
 * lattices read as assembled rather than faded in.
 */
function Staged({
  items,
  frac,
  material,
  geometry = unitBox,
  drop = 1.2,
  castShadow = false,
}: {
  items: Matrix4[];
  frac: () => number;
  material: Material;
  geometry?: BufferGeometry;
  drop?: number;
  castShadow?: boolean;
}) {
  const ref = useRef<InstancedMesh>(null);
  const s = useConst(() => ({ last: -1, m: new Matrix4(), t: new Matrix4() }));
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    items.forEach((m, i) => mesh.setMatrixAt(i, m));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [items]);
  useFrame(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const f = Math.min(1, Math.max(0, frac())) * items.length;
    const n = Math.ceil(f - 1e-6);
    mesh.count = n;
    mesh.visible = n > 0;
    if (s.last >= 0 && s.last !== n - 1) {
      if (s.last < items.length) mesh.setMatrixAt(s.last, items[s.last]);
      mesh.instanceMatrix.needsUpdate = true;
      s.last = -1;
    }
    const k = f - (n - 1);
    if (n > 0 && drop > 0 && k < 1) {
      mesh.setMatrixAt(n - 1, s.m.multiplyMatrices(s.t.makeTranslation(0, (1 - k) * drop, 0), items[n - 1]));
      mesh.instanceMatrix.needsUpdate = true;
      s.last = n - 1;
    }
  });
  return <instancedMesh ref={ref} args={[geometry, material, items.length]} castShadow={castShadow} receiveShadow frustumCulled={false} />;
}

/** Three sectors of paired panel antennas around a mast, facing outward. */
function sectors(cx: number, cz: number, y: number, h: number, r: number): BoxItem[] {
  const out: BoxItem[] = [];
  for (let k = 0; k < 3; k++) {
    const a = (k / 3) * Math.PI * 2 + 0.4;
    for (const off of [-0.45, 0.45]) {
      out.push({ p: [cx + Math.cos(a) * r - Math.sin(a) * off, y, cz + Math.sin(a) * r + Math.cos(a) * off], s: [0.12, h, 0.34], r: [0, -a, 0] });
    }
  }
  return out;
}

/** Tilted modules in rows over a rectangle at height y (one module = 1 × 1.7 m). */
function moduleRows(x: [number, number], z: [number, number], y: number, tilt = 0.32, rowGap = 2.7): BoxItem[] {
  const out: BoxItem[] = [];
  for (let zz = z[0] + 1; zz <= z[1] - 1; zz += rowGap) {
    for (let xx = x[0] + 0.6; xx <= x[1] - 0.6; xx += 1.06) out.push({ p: [xx, y + 0.55, zz], s: [1, 0.05, 1.7], r: [tilt, 0, 0] });
  }
  return out;
}

function roofSolar(v: Vol) {
  const m = 2.2;
  return moduleRows([v.x[0] + m, v.x[1] - m], [v.z[0] + m, v.z[1] - m], v.y[1]);
}

/* ---------- EVs ---------- */

/** Car parts in car-local space: length along +x, front at +x. */
const CAR_PARTS = {
  body: { p: [0, 0.66, 0], s: [4.6, 0.62, 1.86] },
  cabin: { p: [-0.3, 1.2, 0], s: [2.5, 0.48, 1.64] },
  head: { p: [2.31, 0.84, 0], s: [0.04, 0.06, 1.6] },
  tail: { p: [-2.31, 0.88, 0], s: [0.04, 0.07, 1.7] },
} as const;
const WHEELS: V3[] = [
  [1.45, 0.36, 0.86],
  [1.45, 0.36, -0.86],
  [-1.45, 0.36, 0.86],
  [-1.45, 0.36, -0.86],
];
const CAR_COLOURS = ["#e6e7e9", "#2a3342", "#9aa1a8", "#d9dbde", "#1f3d33", "#5a1f2b", "#c4c8cc", "#3c4656"];

type Car = { road: number; lane: 1 | -1; offset: number; speed: number } | { park: V3; yaw: number };

/** Lanes run either side of each road's centreline; the front street is left clear of the low handover camera. */
const MOVING_ROADS = roads.map((r, i) => ({ ...r, i })).filter((r) => r.z[0] < 58);
const CARS: Car[] = [
  ...MOVING_ROADS.flatMap((r, k) => [
    { road: r.i, lane: 1 as const, offset: 0.1 + k * 0.23, speed: 0.022 + k * 0.004 },
    { road: r.i, lane: -1 as const, offset: 0.55 + k * 0.17, speed: 0.026 - k * 0.003 },
    { road: r.i, lane: 1 as const, offset: 0.7 + k * 0.11, speed: 0.024 },
  ]),
  // Parked at the chargers
  { park: [HUB[0] - 2.9, 0, HUB[2] + 0.4], yaw: Math.PI / 2 },
  { park: [HUB[0] + 2.9, 0, HUB[2] + 0.4], yaw: Math.PI / 2 },
];

function carPose(car: Car, t: number, parked: boolean, out: Matrix4, q: Quaternion, e: Euler, v: Vector3, sc: Vector3) {
  if ("park" in car) return out.compose(v.set(...car.park), q.setFromEuler(e.set(0, car.yaw, 0)), sc.setScalar(parked ? 1 : 0));
  const r = roads[car.road];
  const along = r.dir === "x" ? r.x : r.z;
  const len = along[1] - along[0];
  let u = (car.offset + t * car.speed) % 1;
  if (car.lane < 0) u = 1 - u;
  const a = along[0] + u * len;
  const mid = r.dir === "x" ? (r.z[0] + r.z[1]) / 2 : (r.x[0] + r.x[1]) / 2;
  const c = mid + car.lane * 2.6;
  // Heading: +x for x-roads (lane +1), +z for z-roads (lane +1); reversed for the other lane.
  const yaw = r.dir === "x" ? (car.lane > 0 ? 0 : Math.PI) : car.lane > 0 ? -Math.PI / 2 : Math.PI / 2;
  return out.compose(r.dir === "x" ? v.set(a, 0, c) : v.set(c, 0, a), q.setFromEuler(e.set(0, yaw, 0)), sc.setScalar(1));
}

function EVs({
  M,
  visibleRef,
  parkedRef,
}: {
  M: Record<"carBody" | "carGlass" | "head" | "tail" | "tyre", MeshStandardMaterial>;
  visibleRef: React.RefObject<number>;
  parkedRef: React.RefObject<boolean>;
}) {
  const body = useRef<InstancedMesh>(null);
  const cabin = useRef<InstancedMesh>(null);
  const head = useRef<InstancedMesh>(null);
  const tail = useRef<InstancedMesh>(null);
  const wheels = useRef<InstancedMesh>(null);
  const s = useConst(() => ({
    car: new Matrix4(),
    m: new Matrix4(),
    q: new Quaternion(),
    e: new Euler(),
    v: new Vector3(),
    sc: new Vector3(),
    parts: Object.fromEntries(
      Object.entries(CAR_PARTS).map(([k, p]) => [k, new Matrix4().compose(new Vector3(...p.p), new Quaternion(), new Vector3(...p.s))]),
    ) as Record<keyof typeof CAR_PARTS, Matrix4>,
    wheels: WHEELS.map((w) => new Matrix4().makeTranslation(...w)),
  }));

  useLayoutEffect(() => {
    const c = new Color();
    CARS.forEach((_, i) => body.current?.setColorAt(i, c.set(CAR_COLOURS[i % CAR_COLOURS.length])));
    if (body.current?.instanceColor) body.current.instanceColor.needsUpdate = true;
  }, []);

  useFrame((state) => {
    if ((visibleRef.current ?? 0) <= 0.01) return;
    const t = state.clock.elapsedTime;
    const meshes = { body: body.current, cabin: cabin.current, head: head.current, tail: tail.current };
    CARS.forEach((car, i) => {
      carPose(car, t, parkedRef.current ?? false, s.car, s.q, s.e, s.v, s.sc);
      for (const k of Object.keys(meshes) as (keyof typeof meshes)[]) meshes[k]?.setMatrixAt(i, s.m.multiplyMatrices(s.car, s.parts[k]));
      s.wheels.forEach((w, j) => wheels.current?.setMatrixAt(i * 4 + j, s.m.multiplyMatrices(s.car, w)));
    });
    for (const mesh of [...Object.values(meshes), wheels.current]) if (mesh) mesh.instanceMatrix.needsUpdate = true;
  });

  const n = CARS.length;
  return (
    <>
      <instancedMesh ref={body} args={[unitBox, M.carBody, n]} castShadow frustumCulled={false} />
      <instancedMesh ref={cabin} args={[unitBox, M.carGlass, n]} frustumCulled={false} />
      <instancedMesh ref={head} args={[unitBox, M.head, n]} frustumCulled={false} />
      <instancedMesh ref={tail} args={[unitBox, M.tail, n]} frustumCulled={false} />
      <instancedMesh ref={wheels} args={[wheelGeo, M.tyre, n * 4]} frustumCulled={false} />
    </>
  );
}

/* ---------- Scene ---------- */

export function VerticalTraces({ progress }: { progress: React.RefObject<ProgressController> }) {
  const lib = getMaterials();
  const M = useConst(() => {
    const cell = solarModule();
    return {
      wire: new MeshBasicMaterial({ color: "#8fa6c6", transparent: true, opacity: 0, depthWrite: false }),
      pvWire: new MeshBasicMaterial({ color: "#6fb291", transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }),
      farmWire: new MeshBasicMaterial({ color: "#7cc4a0", transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }),
      mark: new MeshBasicMaterial({ color: "#e6c88c", transparent: true, opacity: 0, depthWrite: false }),
      pv: new MeshStandardMaterial({ map: cell, emissiveMap: cell, emissive: new Color("#ffffff"), emissiveIntensity: 0.06, metalness: 0.25, roughness: 0.22, envMapIntensity: 1.6 }),
      pile: new MeshStandardMaterial({ color: "#a9afb4", metalness: 0.8, roughness: 0.4 }),
      footing: new MeshStandardMaterial({ map: lib.concrete.map, color: "#cfcac1", roughness: 0.9 }),
      beacon: new MeshStandardMaterial({ color: "#5a0d0d", emissive: new Color("#ff2a1a"), emissiveIntensity: 0 }),
      charger: new MeshStandardMaterial({ color: "#e4e6e8", roughness: 0.45, metalness: 0.2 }),
      charge: new MeshStandardMaterial({ color: "#0f3a28", emissive: new Color("#3fd18f"), emissiveIntensity: 0 }),
      carBody: new MeshStandardMaterial({ color: "#ffffff", metalness: 0.55, roughness: 0.32 }),
      carGlass: new MeshStandardMaterial({ color: "#0d131b", metalness: 0.6, roughness: 0.12 }),
      head: new MeshStandardMaterial({ color: "#f4f6ff", emissive: new Color("#eaf1ff"), emissiveIntensity: 0.4 }),
      tail: new MeshStandardMaterial({ color: "#5a0f12", emissive: new Color("#ff2b2b"), emissiveIntensity: 0.3 }),
      tyre: new MeshStandardMaterial({ color: "#161718", roughness: 0.9 }),
      rings: [0, 1, 2].map(() => new MeshBasicMaterial({ color: "#efe2c2", transparent: true, opacity: 0, depthWrite: false, side: DoubleSide })),
    };
  });
  useEffect(() => () => Object.values(M).flat().forEach((m) => m.dispose()), [M]);

  const geo = useConst(() => {
    /* Telecom tower: footing, tapering lattice, headframe with three sectors, dishes */
    const lat = latticeSegments({ height: TOWER_H, baseHalf: 2.4, topHalf: 0.7, panels: 12, origin: TOWER });
    const [tx, , tz] = TOWER;
    const top = TOWER_H;
    const byHeight = (a: Segment, b: Segment) => lowestY(a) - lowestY(b);
    const legs = [...lat.legs, [[tx, top, tz], [tx, top + 5, tz]] as Segment].sort(byHeight);
    const bracing = [...lat.horizontals, ...lat.diagonals].sort(byHeight);
    const fitOut: BoxItem[] = [
      { p: [tx, top - 5.2, tz], s: [3.2, 0.12, 3.2] },
      ...sectors(tx, tz, top - 4, 1.8, 1.7),
      { p: [tx, top - 0.2, tz], s: [3.6, 0.14, 3.6] },
      ...sectors(tx, tz, top + 1.2, 2.6, 1.7),
    ];
    // Microwave dishes face the city (−x) and the street (+z)
    const dishes: BoxItem[] = [
      { p: [tx - 1.4, top - 14, tz], s: [1.5, 0.35, 1.5], r: [0, 0, Math.PI / 2] },
      { p: [tx, top - 10, tz + 1.5], s: [1.2, 0.3, 1.2], r: [Math.PI / 2, 0, 0] },
    ];
    const beacons: BoxItem[] = [
      { p: [tx, top + 5.2, tz], s: [0.38, 0.38, 0.38] },
      { p: [tx + 1.2, top * 0.5, tz + 1.2], s: [0.3, 0.3, 0.3] },
    ];
    const towerFooting: BoxItem[] = [
      { p: [tx, 0.25, tz], s: [6.4, 0.5, 6.4] },
      { p: [tx - 4.6, 1.3, tz + 1], s: [2.6, 2.6, 3.4] }, // equipment shelter
    ];
    const towerMarks: BoxItem[] = [
      ...lat.legs.filter((l) => lowestY(l) === 0).map<BoxItem>(([a]) => ({ p: [a[0], 0.04, a[2]], s: [0.7, 0.04, 0.7] })),
      { p: [tx, 0.03, tz], s: [6.6, 0.02, 0.12] },
      { p: [tx, 0.03, tz], s: [0.12, 0.02, 6.6] },
    ];

    // Rooftop site on a neighbour — the telecom trace the phone camera sees at handover
    const [rx, ry, rz] = ROOF_MAST;
    const roofSite = {
      pole: [[[rx, ry, rz], [rx, ry + 14, rz]]] as Segment[],
      stays: [0.3, 2.4, 4.5].map<Segment>((a) => [[rx + Math.cos(a) * 2.2, ry, rz + Math.sin(a) * 2.2], [rx, ry + 5, rz]]),
      antennas: sectors(rx, rz, ry + 11.6, 2.2, 0.9),
      beacon: [{ p: [rx, ry + 14.2, rz], s: [0.34, 0.34, 0.34] }] as BoxItem[],
    };

    /* Solar farm: piles → rails → modules, row by row (far row first) */
    const piles: Segment[] = [];
    const rails: Segment[] = [];
    const modules: BoxItem[] = [];
    const farmMarks: BoxItem[] = [];
    const [fx0, fx1] = FARM.x;
    const half = 0.85 * Math.cos(FARM_TILT);
    const rise = 0.85 * Math.sin(FARM_TILT);
    for (const z of FARM.rows) {
      for (let x = fx0 + 0.4; x <= fx1 - 0.3; x += 2.4) {
        piles.push([[x, 0, z - half], [x, 1.25 + rise, z - half]], [[x, 0, z + half], [x, 1.25 - rise, z + half]]);
        farmMarks.push({ p: [x, 0.04, z - half], s: [0.32, 0.04, 0.32] }, { p: [x, 0.04, z + half], s: [0.32, 0.04, 0.32] });
      }
      rails.push([[fx0, 1.25 + rise, z - half + 0.1], [fx1, 1.25 + rise, z - half + 0.1]], [[fx0, 1.25 - rise, z + half - 0.1], [fx1, 1.25 - rise, z + half - 0.1]]);
      for (let x = fx0 + 0.5; x <= fx1 - 0.4; x += 1.04) modules.push({ p: [x, 1.32, z], s: [1, 0.05, 1.75], r: [FARM_TILT, 0, 0] });
    }
    const inverter: BoxItem[] = [{ p: [fx1 - 1.2, 1.1, 13.2], s: [2.2, 2.2, 1.2] }];

    /* Solar carport: posts → beams → modules, then chargers */
    const [hx, , hz] = HUB;
    const posts: Segment[] = [-5.6, 0, 5.6].flatMap<Segment>((dx) => [
      [[hx + dx, 0, hz - 2.2], [hx + dx, 3.1, hz - 2.2]],
      [[hx + dx, 0, hz + 2.4], [hx + dx, 2.7, hz + 2.4]],
    ]);
    const beams: Segment[] = [
      [[hx - 6, 3.1, hz - 2.2], [hx + 6, 3.1, hz - 2.2]],
      [[hx - 6, 2.7, hz + 2.4], [hx + 6, 2.7, hz + 2.4]],
    ];
    const canopyPv: BoxItem[] = [];
    for (const z of [hz - 1.6, hz + 0.2, hz + 2]) for (let x = hx - 5.5; x <= hx + 5.5; x += 1.06) canopyPv.push({ p: [x, 3.06 - (z - hz) * 0.09, z], s: [1, 0.05, 1.7], r: [0.09, 0, 0] });
    const chargers: BoxItem[] = [
      { p: [hx - 2.9, 0.8, hz - 3.4], s: [0.42, 1.6, 0.3] },
      { p: [hx + 2.9, 0.8, hz - 3.4], s: [0.42, 1.6, 0.3] },
    ];
    const chargeLights: BoxItem[] = chargers.map((c) => ({ p: [c.p[0], 1.15, c.p[2] + 0.16], s: [0.26, 0.5, 0.02] }));
    const bayLines: BoxItem[] = [-5.6, 0, 5.6].map((dx) => ({ p: [hx + dx, 0.03, hz + 0.4], s: [0.1, 0.02, 5] }));

    // Rooftop solar on the neighbours, and the site cabins (cabins live in ConstructionSite)
    const roofPv = contextBlocks
      .filter((v) => SOLAR_ROOFS.includes(v.name))
      .flatMap(roofSolar)
      .filter((m) => Math.hypot(m.p[0] - ROOF_MAST[0], m.p[2] - ROOF_MAST[2]) > 4);
    const cabinPv = [
      ...moduleRows([-31.3, -25.7], [-17.3, -14.7], 4.7, 0.3, 1.3),
      ...moduleRows([-24.6, -19], [-17.3, -14.7], 2.05, 0.3, 1.3),
    ];

    const segs = (list: Segment[], th: number) => list.map((sg) => segMatrix(sg, th));
    const boxes = (list: BoxItem[]) => list.map(boxMatrix);
    return {
      tower: { legs: segs(legs, 0.22), bracing: segs(bracing, 0.08), fitOut: boxes(fitOut), dishes: boxes(dishes) },
      beacons,
      towerFooting,
      towerMarks,
      roofSite,
      farm: { piles: segs(piles, 0.12), rails: segs(rails, 0.1), modules: boxes(modules) },
      farmMarks,
      inverter,
      carport: { frame: segs([...posts, ...beams], 0.22), modules: boxes(canopyPv), chargers: boxes(chargers) },
      chargeLights,
      bayLines,
      roofPv: boxes(roofPv),
      roofPvItems: roofPv,
      cabinPv,
    };
  });

  /* Build state, written once per frame and read by the staged meshes */
  const P = useConst(() => ({ draw: 0, rise: 0, fitOut: 0, piles: 0, rails: 0, modules: 0, frame: 0, canopy: 0, chargers: 0, roof: 0 }));
  const get = useConst(() => Object.fromEntries(Object.keys(P).map((k) => [k, () => P[k as keyof typeof P]])) as Record<keyof typeof P, () => number>);

  const wire = useRef<Group>(null);
  const roofWire = useRef<Group>(null);
  const marks = useRef<Group>(null);
  const footing = useRef<Group>(null);
  const beacons = useRef<Group>(null);
  const rings = useRef<(Mesh | null)[]>([]);
  const neighbours = useRef<Group>(null);
  const roofSite = useRef<Group>(null);
  const cabins = useRef<Group>(null);
  const streets = useRef<Group>(null);
  const hubExtras = useRef<Group>(null);
  const traffic = useRef(0);
  const parked = useRef(false);

  useFrame((state) => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    const t = state.clock.elapsedTime;
    const lit = ramp(s, T.lights.in);
    const lin = (r: readonly [number, number]) => Math.min(1, Math.max(0, (s - r[0]) / (r[1] - r[0])));

    // Design: the tower and the farm are drawn in, then stay as the brief while they're built
    P.draw = lin(T.tracesDraw.in);
    // The outline gives way as the real parts go in (the solar farm goes in first)
    const w = window01(s, T.tracesDraw.in, T.tracesDraw.out);
    const wf = window01(s, T.tracesDraw.in, T.solarFarm.modules);
    M.wire.opacity = w * 0.34;
    M.farmWire.opacity = wf * 0.18;
    if (wire.current) wire.current.visible = w > 0.01;
    // Neighbours' roof arrays follow the context massing
    const rw = window01(s, T.context.in, T.context.wireOut);
    M.pvWire.opacity = rw * 0.13;
    if (roofWire.current) roofWire.current.visible = rw > 0.01;

    // Plan: setting-out marks on the ground
    const so = window01(s, T.tracesSetOut.in, T.tracesSetOut.out);
    M.mark.opacity = so * 0.85;
    if (marks.current) marks.current.visible = so > 0.01;

    // Build: footing → lattice → fit-out; piles → rails → modules; carport
    const ft = ramp(s, T.tower.footing);
    if (footing.current) {
      footing.current.visible = ft > 0.01;
      footing.current.scale.y = Math.max(0.001, ft);
    }
    P.rise = lin(T.tower.rise);
    P.fitOut = lin(T.tower.fitOut);
    P.piles = lin(T.solarFarm.piles);
    P.rails = lin(T.solarFarm.rails);
    P.modules = lin(T.solarFarm.modules);
    P.frame = lin(T.carport.frame);
    P.canopy = lin(T.carport.modules);
    P.chargers = lin(T.carport.chargers);
    P.roof = lin(T.roofSolar.install);
    if (neighbours.current) {
      const k = ramp(s, T.context.solidIn);
      neighbours.current.visible = k > 0.01;
      neighbours.current.scale.y = Math.max(0.001, k);
    }

    // Live: aviation lights blink, signal rings radiate from the headframe
    const live = ramp(s, T.tower.live);
    if (beacons.current) beacons.current.visible = live > 0.01;
    const blink = Math.max(0, Math.sin(t * 2.2)) ** 6;
    M.beacon.emissiveIntensity = live * (0.4 + lit * 5) * (0.25 + 0.75 * blink);
    rings.current.forEach((r, i) => {
      if (!r) return;
      const u = (t * 0.3 + i / 3) % 1;
      r.scale.setScalar(3 + u * 16);
      M.rings[i].opacity = live * (1 - u) * (1 - u) * (0.28 + lit * 0.2);
    });

    // Panels catch a little sky at dusk
    M.pv.emissiveIntensity = 0.06 + lit * 0.22;

    const dusk = ramp(s, T.sky.in);
    if (roofSite.current) roofSite.current.visible = dusk > 0.01;

    // Site cabins carry their own solar while the site is up
    const site = window01(s, T.site.in, T.site.fadeOut);
    if (cabins.current) {
      cabins.current.visible = site > 0.001;
      cabins.current.scale.y = Math.max(0.001, site);
    }

    // EVs use the streets once they exist; two park at the chargers once those are in
    const st = ramp(s, T.roads.in);
    traffic.current = st;
    parked.current = P.chargers >= 1;
    if (streets.current) streets.current.visible = st > 0.01;
    M.head.emissiveIntensity = 0.4 + lit * 3.2;
    M.tail.emissiveIntensity = 0.3 + lit * 2.4;
    if (hubExtras.current) hubExtras.current.visible = P.chargers > 0;
    M.charge.emissiveIntensity = P.chargers * (0.8 + lit * 2.2) * (0.6 + 0.4 * Math.sin(t * 1.6));
  });

  return (
    <group>
      {/* Design: drawn in as wire, kept as the outline while the real thing goes up */}
      <group ref={wire} visible={false}>
        <Staged items={geo.tower.legs} frac={get.draw} material={M.wire} drop={0} />
        <Staged items={geo.tower.bracing} frac={get.draw} material={M.wire} drop={0} />
        <Staged items={geo.tower.fitOut} frac={get.draw} material={M.wire} drop={0} />
        <Staged items={geo.farm.modules} frac={get.draw} material={M.farmWire} drop={0} />
        <Staged items={geo.carport.modules} frac={get.draw} material={M.farmWire} drop={0} />
      </group>
      <group ref={roofWire} visible={false}>
        <BoxInstances items={geo.roofPvItems} material={M.pvWire} castShadow={false} receiveShadow={false} />
      </group>

      {/* Plan: setting-out on the ground */}
      <group ref={marks} visible={false}>
        <BoxInstances items={[...geo.towerMarks, ...geo.farmMarks]} material={M.mark} castShadow={false} receiveShadow={false} />
      </group>

      {/* Build: telecom tower */}
      <group ref={footing} visible={false}>
        <BoxInstances items={geo.towerFooting} material={M.footing} castShadow={false} />
      </group>
      <Staged items={geo.tower.legs} frac={get.rise} material={lib.galvanised} drop={1.5} />
      <Staged items={geo.tower.bracing} frac={get.rise} material={lib.galvanised} drop={1.5} />
      <Staged items={geo.tower.fitOut} frac={get.fitOut} material={lib.antennaPanel} drop={2} />
      <Staged items={geo.tower.dishes} frac={get.fitOut} material={lib.dish} geometry={unitCylinder} drop={2} />
      <group ref={beacons} visible={false}>
        <BoxInstances items={geo.beacons} material={M.beacon} castShadow={false} receiveShadow={false} />
        {M.rings.map((m, i) => (
          <mesh
            key={i}
            ref={(el) => {
              rings.current[i] = el;
            }}
            geometry={ringGeo}
            material={m}
            position={[TOWER[0], TOWER_H + 1.2, TOWER[2]]}
            renderOrder={2}
          />
        ))}
      </group>

      {/* Build: solar farm */}
      <Staged items={geo.farm.piles} frac={get.piles} material={M.pile} drop={0.8} />
      <Staged items={geo.farm.rails} frac={get.rails} material={M.pile} drop={0.6} />
      <Staged items={geo.farm.modules} frac={get.modules} material={M.pv} drop={1.4} castShadow />

      {/* Build: solar carport + chargers */}
      <Staged items={geo.carport.frame} frac={get.frame} material={lib.blackMetal} drop={1} castShadow />
      <Staged items={geo.carport.modules} frac={get.canopy} material={M.pv} drop={1.2} />
      <Staged items={geo.carport.chargers} frac={get.chargers} material={M.charger} drop={0.6} />
      <group ref={hubExtras} visible={false}>
        <BoxInstances items={geo.chargeLights} material={M.charge} castShadow={false} receiveShadow={false} />
        <BoxInstances items={geo.bayLines} material={M.charger} castShadow={false} />
        <BoxInstances items={geo.inverter} material={lib.cabinet} castShadow={false} />
      </group>

      {/* Neighbours' roofs go solar as the city around the site is built */}
      <group ref={neighbours} visible={false}>
        <Staged items={geo.roofPv} frac={get.roof} material={M.pv} drop={0} />
      </group>

      <group ref={roofSite} visible={false}>
        <Members segments={geo.roofSite.pole} thickness={0.26} material={lib.galvanised} castShadow={false} />
        <Members segments={geo.roofSite.stays} thickness={0.08} material={lib.galvanised} castShadow={false} />
        <BoxInstances items={geo.roofSite.antennas} material={lib.antennaPanel} castShadow={false} />
        <BoxInstances items={geo.roofSite.beacon} material={M.beacon} castShadow={false} receiveShadow={false} />
      </group>

      <group ref={cabins} visible={false}>
        <BoxInstances items={geo.cabinPv} material={M.pv} castShadow={false} />
      </group>

      <group ref={streets} visible={false}>
        <EVs M={M} visibleRef={traffic} parkedRef={parked} />
      </group>
    </group>
  );
}
