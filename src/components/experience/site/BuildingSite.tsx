"use client";

/*
 * Animated three.js objects are mutated inside useFrame (outside React render),
 * which the React Compiler immutability rule does not model.
 */
/* eslint-disable react-hooks/immutability */
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import {
  BoxGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  LineBasicMaterial,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  Vector3,
  BufferGeometry,
  Float32BufferAttribute,
  type Group,
  type Material,
  type Mesh,
  type PointLight,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { Line2 } from "three-stdlib";
import { BLUEPRINT_DRAW_SECONDS, STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { EXPLODE_GAP, explodeFactor, window01 } from "./stage";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { getMaterials } from "../models/materials";
import { concretePanels } from "../models/textures";
import { BoxInstances, Members, latticeSegments, unitCylinder, useConst, type BoxItem, type Segment } from "../models/primitives";
import {
  FLOOR_H,
  LEVELS,
  ROOF,
  bays,
  blueprintLines,
  concrete,
  footprint,
  gridX,
  gridZ,
  slot,
  stairFlights,
  tagsAt,
  volCenter,
  volSize,
  type V3,
} from "./building";
import { worldBox } from "./geometry";
import { Silhouette, Worker } from "./Worker";
import { INTERIOR_LIGHTS } from "./InteriorHall";

const SOFFIT_LIGHTS: V3[] = [
  [11, 15.5, 11.4],
  [17, 15.5, 11.4],
  [-12, 15, 9.4],
  [-6, 15, 9.4],
  [13, 6, 5],
  [-9, 7, 3],
];

const smooth = (t: number) => t * t * (3 - 2 * t);
const ramp = (s: number, [a, b]: readonly [number, number]) => smooth(Math.min(1, Math.max(0, (s - a) / (b - a))));
const show = (o: { visible: boolean } | null, v: boolean) => {
  if (o) o.visible = v;
};

function edgesOf(boxes: { p: V3; s: V3 }[]) {
  const geos = boxes.map((b) => {
    const g = new BoxGeometry(...b.s);
    g.applyMatrix4(new Matrix4().makeTranslation(...b.p));
    const e = new EdgesGeometry(g);
    g.dispose();
    return e;
  });
  const merged = mergeGeometries(geos)!;
  geos.forEach((g) => g.dispose());
  return merged;
}

/** Slab footprint at one level, leaving the atrium as a full-height void. */
function slabParts(y: number): BoxItem[] {
  const t = 0.35;
  const a = bays.atrium;
  return [
    { p: [(footprint.x[0] + a.x[0]) / 2, y, (footprint.z[0] + footprint.z[1]) / 2], s: [a.x[0] - footprint.x[0], t, footprint.z[1] - footprint.z[0]] },
    { p: [(a.x[0] + a.x[1]) / 2, y, (footprint.z[0] + a.z[0]) / 2], s: [a.x[1] - a.x[0], t, a.z[0] - footprint.z[0]] },
    { p: [(a.x[1] + footprint.x[1]) / 2, y, (footprint.z[0] + footprint.z[1]) / 2], s: [footprint.x[1] - a.x[1], t, footprint.z[1] - footprint.z[0]] },
  ];
}

export function BuildingSite({ progress }: { progress: React.RefObject<ProgressController> }) {
  const lib = getMaterials();
  const drawT = useRef(0);

  const M = useConst(() => {
    const gold = new Color("#d8b77a");
    return {
      facade: new MeshStandardMaterial({ map: concretePanels(), color: "#f2eee8", roughness: 0.82, metalness: 0, envMapIntensity: 0.8 }),
      wireLine: new LineBasicMaterial({ color: gold, transparent: true, opacity: 0.9 }),
      wireFill: new MeshBasicMaterial({ color: gold, transparent: true, opacity: 0.06, depthWrite: false, side: DoubleSide }),
      slabLine: new LineBasicMaterial({ color: "#9fb6d4", transparent: true, opacity: 0.7 }),
      duct: new MeshStandardMaterial({ color: "#9fb3c4", metalness: 0.7, roughness: 0.35, transparent: true }),
      tray: new MeshStandardMaterial({ color: "#c9a46e", metalness: 0.6, roughness: 0.4, transparent: true }),
      pipe: new MeshStandardMaterial({ color: "#3f8f68", metalness: 0.4, roughness: 0.45, transparent: true }),
      glass: new MeshStandardMaterial({ color: "#9fb6cc", metalness: 0.3, roughness: 0.04, transparent: true, opacity: 0, depthWrite: false, side: DoubleSide, envMapIntensity: 2 }),
      glow: new MeshStandardMaterial({ color: "#2a2520", emissive: new Color("#ffd29a"), emissiveIntensity: 0 }),
      lightStrip: new MeshStandardMaterial({ color: "#fff8ee", emissive: new Color("#ffe9c8"), emissiveIntensity: 0 }),
      downlight: new MeshStandardMaterial({ color: "#fff4e0", emissive: new Color("#ffd9a0"), emissiveIntensity: 0 }),
      interiorFloor: new MeshStandardMaterial({ color: "#b89a7a", roughness: 0.5 }),
      silhouette: new MeshStandardMaterial({ color: "#16181c", roughness: 1 }),
      balustrade: new MeshStandardMaterial({ color: "#cfe0ea", transparent: true, opacity: 0.18, roughness: 0.05, depthWrite: false }),
      slot: new MeshStandardMaterial({ color: "#2a2016", emissive: new Color("#ffcf8a"), emissiveIntensity: 0 }),
      plywood: new MeshStandardMaterial({ color: "#b8893e", roughness: 0.8 }),
      netting: new MeshStandardMaterial({ color: "#1f3b2c", transparent: true, opacity: 0.55, side: DoubleSide, depthWrite: false, roughness: 1 }),
      wireGrid: new LineBasicMaterial({ color: "#c9d8ea", transparent: true, opacity: 0 }),
      vest: new MeshStandardMaterial({ color: "#c96f2c", roughness: 0.8, transparent: true }),
      trousers: new MeshStandardMaterial({ color: "#2c3138", roughness: 0.9, transparent: true }),
      skin: new MeshStandardMaterial({ color: "#9b7055", roughness: 0.8, transparent: true }),
      helmet: new MeshStandardMaterial({ color: "#ece7dc", roughness: 0.4, transparent: true }),
    };
  });
  useEffect(() => () => Object.values(M).forEach((m) => m.dispose()), [M]);

  /* ----- Static geometry descriptions ----- */

  const blueprint = useConst(() => blueprintLines());
  const blueprintRef = useRef<Line2>(null);

  const volumes = useConst(() =>
    concrete.map((v) => {
      const c = volCenter(v);
      const s = volSize(v);
      return { name: v.name, geo: worldBox(s[0], s[1], s[2], 9.6), base: [c[0], v.y[0], c[2]] as V3, h: s[1] };
    }),
  );
  useEffect(() => () => volumes.forEach((v) => v.geo.dispose()), [volumes]);

  const wire = useConst(() => {
    const boxes = [
      ...concrete.map((v) => ({ p: volCenter(v), s: volSize(v) })),
      ...Object.values(bays).map((b) => ({ p: [(b.x[0] + b.x[1]) / 2, (b.y[0] + b.y[1]) / 2, (b.z[0] + b.z[1]) / 2] as V3, s: [b.x[1] - b.x[0], b.y[1] - b.y[0], b.z[1] - b.z[0]] as V3 })),
    ];
    const slabs = LEVELS.slice(1)
      .concat(ROOF)
      .flatMap((y) => slabParts(y).map((b) => ({ p: b.p, s: [b.s[0], 0.02, b.s[2]] as V3 })));
    return { volumes: edgesOf(boxes), slabs: edgesOf(slabs), fills: boxes.map<BoxItem>((b) => ({ p: b.p, s: b.s })) };
  });
  useEffect(() => () => [wire.volumes, wire.slabs].forEach((g) => g.dispose()), [wire]);

  const structure = useConst(() => {
    const cols: BoxItem[] = [];
    for (const x of gridX) for (const z of gridZ) cols.push({ p: [x, ROOF / 2, z], s: [0.7, ROOF, 0.7] });
    const slabs = LEVELS.slice(1).concat(ROOF).map((y) => slabParts(y));
    return { cols, slabs };
  });

  const mepItems = useConst(() => {
    // Vertical risers (horizontal services live on the exploded floor plates)
    const ducts: BoxItem[] = [
      { p: [-6, 12.5, -8.5], s: [1.4, 25, 1.4] },
      { p: [12, 12.5, -8.5], s: [1.4, 25, 1.4] },
    ];
    const trays: BoxItem[] = [{ p: [-4.6, 12, -8.5], s: [0.5, 24, 0.12] }];
    const pipes: Segment[] = [
      [[-17.5, 0, -6], [-17.5, 24, -6]],
      [[-16.8, 0, -6], [-16.8, 24, -6]],
    ];
    return { ducts, trays, pipes };
  });

  const glazing = useConst(() => {
    const panes: BoxItem[] = [];
    const mullions: Segment[] = [];
    for (const b of Object.values(bays)) {
      panes.push({ p: [(b.x[0] + b.x[1]) / 2, (b.y[0] + b.y[1]) / 2, b.front], s: [b.x[1] - b.x[0], b.y[1] - b.y[0], 0.04] });
      for (let x = b.x[0]; x <= b.x[1] + 0.01; x += 1.5) mullions.push([[x, b.y[0], b.front + 0.06], [x, b.y[1], b.front + 0.06]]);
      for (let y = 0; y <= b.y[1] + 0.01; y += FLOOR_H / 2) mullions.push([[b.x[0], Math.min(y, b.y[1]), b.front + 0.06], [b.x[1], Math.min(y, b.y[1]), b.front + 0.06]]);
    }
    return { panes, mullions };
  });

  const interior = useConst(() => {
    const o = bays.office;
    const a = bays.atrium;
    const floors: BoxItem[] = LEVELS.slice(1, 4).map((L) => ({ p: [(o.x[0] + o.x[1]) / 2, L, (o.z[0] + o.z[1]) / 2 - 0.2], s: [o.x[1] - o.x[0], 0.32, o.z[1] - o.z[0] - 0.4] }));
    const strips: BoxItem[] = [];
    const desks: BoxItem[] = [];
    for (const L of LEVELS.slice(0, 4)) {
      for (let x = 8.6; x < 18.5; x += 2.6) for (let z = -0.5; z < 9.5; z += 2.4) strips.push({ p: [x, L + 3.82, z], s: [1.8, 0.04, 0.16] });
      for (let x = 9; x < 18; x += 3.2) for (let z = 1; z < 8.5; z += 3) desks.push({ p: [x, L + 0.75, z], s: [2.2, 0.06, 1.2] });
    }
    const backGlow: BoxItem[] = [
      { p: [(o.x[0] + o.x[1]) / 2, o.y[1] / 2, -1.9], s: [o.x[1] - o.x[0], o.y[1], 0.05] },
      { p: [(a.x[0] + a.x[1]) / 2, a.y[1] / 2, -1.9], s: [a.x[1] - a.x[0], a.y[1], 0.05] },
    ];
    const atriumCeiling: BoxItem[] = [{ p: [(a.x[0] + a.x[1]) / 2, a.y[1] - 0.1, (a.z[0] + a.z[1]) / 2], s: [a.x[1] - a.x[0], 0.1, a.z[1] - a.z[0]] }];
    // Feature stair
    const { flights, landings } = stairFlights();
    const treads: BoxItem[] = [];
    const stringers: BoxItem[] = [];
    const rails: BoxItem[] = [];
    for (const f of flights) {
      const dx = f.b[0] - f.a[0];
      const dy = f.b[1] - f.a[1];
      const len = Math.hypot(dx, dy);
      const ang = Math.atan2(dy, dx);
      const mid: V3 = [(f.a[0] + f.b[0]) / 2, (f.a[1] + f.b[1]) / 2, f.a[2]];
      treads.push({ p: mid, s: [len, 0.22, f.width], r: [0, 0, ang] });
      for (const side of [-1, 1]) {
        stringers.push({ p: [mid[0], mid[1] - 0.1, mid[2] + side * (f.width / 2)], s: [len, 0.45, 0.08], r: [0, 0, ang] });
        rails.push({ p: [mid[0], mid[1] + 0.6, mid[2] + side * (f.width / 2)], s: [len, 1.0, 0.03], r: [0, 0, ang] });
      }
    }
    const lobby: BoxItem[] = [{ p: [-10.5, 0.55, 1.6], s: [4, 1.1, 1.2] }];
    const pendants: BoxItem[] = [-12, -9, -6].flatMap((x) => [1.5, 5].map<BoxItem>((z) => ({ p: [x, 12.5, z], s: [0.5, 0.5, 0.5] })));
    const people: V3[] = [
      [-11.5, LEVELS[0] + 0.55, 6.3],
      [-8.2, LEVELS[1] + 1.6, 4.5],
      [-12.8, LEVELS[2], 5.4],
      [-7.6, LEVELS[2] + 1.0, 6.3],
      [-10, LEVELS[3] + 1.1, 4.5],
      [10.5, LEVELS[1], 7],
      [15.5, LEVELS[2], 6],
      [12.5, LEVELS[0], 8.8],
      [17, LEVELS[3], 3],
    ];
    return { floors, strips, desks, backGlow, atriumCeiling, treads, stringers, rails, landings: landings.map<BoxItem>((l) => ({ p: l.p, s: l.s })), lobby, pendants, people };
  });

  // Curtain-wall grid drawn into the design model
  const wireGrid = useConst(() => {
    const pts: number[] = [];
    for (const [[a0, a1, a2], [b0, b1, b2]] of glazing.mullions) pts.push(a0, a1, a2, b0, b1, b2);
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    return g;
  });
  useEffect(() => () => wireGrid.dispose(), [wireGrid]);

  // Construction kit: formwork band per rising mass, shoring under fresh slabs, netting
  const formwork = useConst(() => concrete.map((v) => volSize(v)));
  const shoring = useConst(() => {
    const out: Segment[] = [];
    for (const L of LEVELS.slice(0, 4)) for (let x = 8; x <= 18; x += 2.5) for (let z = -1; z <= 9; z += 2.5) out.push([[x, L, z], [x, L + FLOOR_H - 0.2, z]]);
    for (const L of LEVELS.slice(0, 4)) for (let x = -14; x <= -4; x += 2.5) for (let z = -1; z <= 7; z += 4) out.push([[x, L, z], [x, L + FLOOR_H - 0.2, z]]);
    return out;
  });

  const soffit = useConst(() => {
    const lights: BoxItem[] = [];
    for (let x = 8; x <= 20; x += 2) for (const z of [10.9, 12]) lights.push({ p: [x, 17.47, z], s: [0.28, 0.04, 0.28] });
    for (let x = -14; x <= -4; x += 2) for (const z of [9, 10.1]) lights.push({ p: [x, 16.97, z], s: [0.28, 0.04, 0.28] });
    return lights;
  });

  const site = useConst(() => {
    // Mast is fixed; the jib assembly is built around the mast axis so it can slew.
    const mast = latticeSegments({ height: 38, baseHalf: 1, topHalf: 1, panels: 15, origin: [29, 0, -8] });
    const jib: Segment[] = [];
    const y0 = 38;
    const n = 16;
    for (let i = 0; i < n; i++) {
      const xa = -(i * 40) / n;
      const xb = -((i + 1) * 40) / n;
      jib.push([[xa, y0, -0.7], [xb, y0, -0.7]], [[xa, y0, 0.7], [xb, y0, 0.7]], [[xa, y0 + 1.8, 0], [xb, y0 + 1.8, 0]]);
      jib.push([[xa, y0, -0.7], [xb, y0 + 1.8, 0]], [[xa, y0, 0.7], [xb, y0 + 1.8, 0]]);
    }
    jib.push([[0, y0, -0.7], [12, y0, -0.7]], [[0, y0, 0.7], [12, y0, 0.7]], [[0, y0 + 6, 0], [12, y0, 0]], [[0, y0 + 6, 0], [-24, y0 + 1.8, 0]], [[0, y0, 0], [0, y0 + 6, 0]]);
    const jibBlocks: BoxItem[] = [
      { p: [10.5, y0 - 0.8, 0], s: [3, 2.6, 2.2] },
      { p: [1.6, y0 - 1.2, 1.4], s: [1.8, 2, 1.6] },
    ];
    const blocks: BoxItem[] = [{ p: [29, 0.8, -8], s: [5, 1.6, 5] }];
    const hook: Segment[] = [[[-27, y0, 0], [-27, 25, 0]]];
    const load: BoxItem[] = [{ p: [-27, 24.6, 0], s: [8, 0.4, 0.4], r: [0, 0.4, 0] }];
    // Scaffold on the tower's plaza face
    const sc: Segment[] = [];
    const planks: BoxItem[] = [];
    for (let x = -3.5; x <= 7.6; x += 2.2) for (const z of [13.6, 14.8]) sc.push([[x, 0, z], [x, 26, z]]);
    for (let y = 2; y <= 26; y += 2) for (const z of [13.6, 14.8]) sc.push([[-3.5, y, z], [7.5, y, z]]);
    for (let y = 2; y < 26; y += 4) sc.push([[-3.5, y, 14.8], [-1.3, y + 4, 14.8]], [[3.1, y, 14.8], [5.3, y + 4, 14.8]]);
    for (let y = 4; y <= 24; y += 4) planks.push({ p: [2, y + 0.05, 14.2], s: [11, 0.06, 1.15] });
    const netting: BoxItem[] = [{ p: [2, 13, 15.3], s: [11.4, 26, 0.02] }];
    return { mast: [...mast.legs, ...mast.horizontals, ...mast.diagonals], jib, jibBlocks, blocks, hook, load, sc, planks, netting };
  });

  const workers: { p: V3; f: number }[] = [
    [-6, 0, 16, 0.6],
    [10, 0, 15, -0.4],
    [1, 8.05, 14.2, Math.PI],
    [4.5, 16.05, 14.2, Math.PI],
    [24, 0, 6, 1.6],
  ].map(([x, y, z, f]) => ({ p: [x, y, z], f }));

  /* ----- Refs ----- */
  const gWire = useRef<Group>(null);
  const gSlabWire = useRef<Group>(null);
  const gMep = useRef<Group>(null);
  const gCols = useRef<Group>(null);
  const slabRefs = useRef<(Group | null)[]>([]);
  const volRefs = useRef<(Group | null)[]>([]);
  const gGlass = useRef<Group>(null);
  const gShell = useRef<Group>(null);
  const slotRef = useRef<Mesh>(null);
  const gMullions = useRef<Group>(null);
  const gInterior = useRef<Group>(null);
  const gCrane = useRef<Group>(null);
  const gJib = useRef<Group>(null);
  const gGrid = useRef<Group>(null);
  const gShoring = useRef<Group>(null);
  const formRefs = useRef<(Mesh | null)[]>([]);
  const gScaffold = useRef<Group>(null);
  const gCrew = useRef<Group>(null);
  const crewRefs = useRef<(Group | null)[]>([]);
  const points = useRef<(PointLight | null)[]>([]);
  const tagWorld = useConst(() => tagsAt.map((t) => new Vector3(...t.pos)));
  const tagLift = useConst(() => new Vector3());
  const tmp = useConst(() => new Vector3());

  // Build order of the concrete masses (back first, framing elements last).
  const volOrder = useConst(() => {
    const order = ["back", "leftPier", "rightPier", "tower", "leftCanopy", "rightFrame", "roofBox"];
    return concrete.map((v) => order.indexOf(v.name));
  });

  useFrame((state, dt) => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);

    // Hook: the plan draws itself on load; complete as soon as scrolling begins.
    // The drawing starts only once the canvas is on screen, so the visitor sees it begin.
    if (progress.current.revealed) drawT.current += Math.min(dt, 0.05);
    const line = blueprintRef.current;
    if (line) {
      const total = blueprint.pts.length / 2;
      const t = Math.max(Math.min(1, drawT.current / BLUEPRINT_DRAW_SECONDS), Math.min(1, s / 0.3));
      line.geometry.instanceCount = Math.ceil(total * (1 - Math.pow(1 - t, 2)));
      const bp = 1 - ramp(s, T.blueprint.fadeOut);
      (line.material as Material).opacity = bp;
      line.visible = bp > 0.01;
    }

    // DESIGN — massing model rises from the drawing
    const rise = ramp(s, T.wireWalls.rise);
    const wireOut = 1 - ramp(s, T.wireWalls.fadeOut);
    if (gWire.current) {
      gWire.current.scale.y = Math.max(0.0001, rise);
      show(gWire.current, rise > 0.001 && wireOut > 0.01);
    }
    // While the floors are exploded, the massing ghosts back so the plates read clearly.
    const ghost = 1 - 0.85 * window01(s, T.ghost.in, T.ghost.out);
    M.wireLine.opacity = 0.9 * wireOut * ghost;
    M.wireFill.opacity = 0.06 * wireOut * ghost;
    const slabW = ramp(s, T.wireFurniture.in) * (1 - ramp(s, T.wireFurniture.fadeOut)) * ghost;
    M.slabLine.opacity = 0.7 * slabW;
    show(gSlabWire.current, slabW > 0.01);
    M.wireGrid.opacity = 0.45 * wireOut * ghost;
    if (gGrid.current) {
      gGrid.current.scale.y = Math.max(0.0001, rise);
      show(gGrid.current, rise > 0.001 && wireOut > 0.01);
    }

    // PLAN — services and annotations
    const risers = window01(s, T.risers.in, T.risers.fadeOut);
    for (const m of [M.duct, M.tray, M.pipe]) m.opacity = risers;
    show(gMep.current, risers > 0.01);

    // Annotations: each has its own window; plan tags ride their exploded floor.
    const ex = explodeFactor(s);
    const { width, height } = state.size;
    // Never show callouts while the hidden warm-up is fast-forwarding the story.
    const warming = progress.current.override !== null;
    progress.current.tags.forEach((el, i) => {
      if (warming) {
        if (el) el.style.opacity = "0";
        return;
      }
      if (!el) return;
      const tag = tagsAt[i];
      const o = window01(s, [tag.when[0], tag.when[1]], [tag.when[2], tag.when[3]]);
      // `--o` drives the marker, leader draw-on and label fade in CSS.
      el.style.setProperty("--o", o.toFixed(3));
      el.style.opacity = o > 0.001 ? "1" : "0";
      if (o <= 0.001) return;
      tagLift.set(0, tag.level ? tag.level * ex * EXPLODE_GAP : 0, 0);
      tmp.copy(tagWorld[i]).add(tagLift).project(state.camera);
      el.style.transform = `translate3d(${(tmp.x * 0.5 + 0.5) * width}px,${(-tmp.y * 0.5 + 0.5) * height}px,0)`;
    });

    // BUILD — frame, slabs floor by floor, concrete masses, crane, scaffold, crew
    const cols = ramp(s, T.columns.rise);
    if (gCols.current) {
      gCols.current.scale.y = Math.max(0.0001, cols);
      show(gCols.current, cols > 0.001);
    }
    const [sa, sb] = T.slab.in;
    slabRefs.current.forEach((g, i) => {
      if (!g) return;
      const n = slabRefs.current.length;
      const k = ramp(s, [sa + ((sb - sa) * i) / n, sa + ((sb - sa) * (i + 1.5)) / n]);
      g.position.y = (1 - k) * 4;
      g.visible = k > 0.001;
    });
    const [ma, mb] = T.masonry.rise;
    volRefs.current.forEach((g, i) => {
      if (!g) return;
      const rank = volOrder[i] / (concrete.length - 1);
      const k = ramp(s, [ma + rank * (mb - ma) * 0.6, ma + rank * (mb - ma) * 0.6 + (mb - ma) * 0.4]);
      g.scale.y = Math.max(0.0001, k);
      g.visible = k > 0.001;
    });
    // Formwork band rides the top of each rising concrete mass.
    volRefs.current.forEach((g, i) => {
      const fw = formRefs.current[i];
      if (!g || !fw) return;
      const k = g.scale.y;
      const v = concrete[i];
      fw.visible = g.visible && k > 0.02 && k < 0.985;
      fw.position.y = v.y[0] + (v.y[1] - v.y[0]) * k + 0.1;
    });
    const crane = ramp(s, T.site.in) * (1 - ramp(s, T.site.fadeOut));
    if (gShoring.current) show(gShoring.current, crane > 0.01 && ramp(s, T.glass.in) < 0.5);
    if (gJib.current) gJib.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.18) * 0.45;
    if (gCrane.current) {
      gCrane.current.scale.y = Math.max(0.0001, crane);
      show(gCrane.current, crane > 0.001);
    }
    const scaffold = window01(s, T.scaffold.in, T.scaffold.fadeOut);
    if (gScaffold.current) {
      gScaffold.current.scale.y = Math.max(0.0001, scaffold);
      show(gScaffold.current, scaffold > 0.001);
    }
    for (const m of [M.vest, M.trousers, M.skin, M.helmet]) m.opacity = crane;
    show(gCrew.current, crane > 0.01);
    crewRefs.current.forEach((w, i) => {
      if (!w) return;
      const t = state.clock.elapsedTime + i * 1.3;
      w.rotation.y = workers[i].f + Math.sin(t * 0.6) * 0.3;
    });

    // HANDOVER — glazing, lit interiors, downlights
    const glass = ramp(s, T.glass.in);
    M.glass.opacity = glass * 0.32;
    M.balustrade.opacity = glass * 0.18;
    show(gGlass.current, glass > 0.001);
    if (gMullions.current) {
      gMullions.current.scale.y = Math.max(0.0001, glass);
      show(gMullions.current, glass > 0.001);
    }
    const inside = ramp(s, T.furniture.in);
    show(gInterior.current, inside > 0.001);
    const lit = ramp(s, T.lights.in);
    M.glow.emissiveIntensity = 0.1 + lit * 0.42;
    M.lightStrip.emissiveIntensity = lit * 2.2;
    M.downlight.emissiveIntensity = lit * 6;
    M.slot.emissiveIntensity = lit * 1.1;
    // The slot is an opaque light box — only show it once it is actually lit.
    show(slotRef.current, lit > 0.05);
    // Inside: hide the shell (camera has crossed the glass) and bring the lights indoors.
    const indoors = s >= T.interior.enter && s < T.interior.exit;
    show(gShell.current, !indoors);
    // The level-2 hall replaces the simple bay interior while it is in play.
    if (s > T.interior.in[0] && s < T.interior.out[1]) show(gInterior.current, false);
    const hall = ramp(s, T.interior.lights);
    points.current.forEach((l, i) => {
      if (!l) return;
      if (indoors) {
        l.position.set(...INTERIOR_LIGHTS[i]);
        l.intensity = 10 + hall * 42;
        l.distance = 15;
      } else {
        l.position.set(...SOFFIT_LIGHTS[i]);
        l.intensity = lit * [70, 70, 60, 60, 30, 90][i];
        l.distance = 16;
      }
    });
  });

  return (
    <group>
      {/* Exterior shell — switched off once the camera is inside the hall */}
      <group ref={gShell}>
      <Line ref={blueprintRef} points={blueprint.pts} vertexColors={blueprint.cols} segments lineWidth={1.3} transparent depthWrite={false} toneMapped={false} />

      {/* Massing model */}
      <group ref={gWire} visible={false}>
        <lineSegments geometry={wire.volumes} material={M.wireLine} />
        <BoxInstances items={wire.fills} material={M.wireFill} castShadow={false} receiveShadow={false} />
      </group>
      <group ref={gGrid} visible={false}>
        <lineSegments geometry={wireGrid} material={M.wireGrid} />
      </group>
      <group ref={gSlabWire} visible={false}>
        <lineSegments geometry={wire.slabs} material={M.slabLine} />
      </group>

      {/* Services */}
      <group ref={gMep} visible={false}>
        <BoxInstances items={mepItems.ducts} material={M.duct} castShadow={false} />
        <BoxInstances items={mepItems.trays} material={M.tray} castShadow={false} />
        <Members segments={mepItems.pipes} thickness={0.35} material={M.pipe} round castShadow={false} />
      </group>

      {/* Structure */}
      <group ref={gCols} visible={false}>
        <BoxInstances items={structure.cols} material={lib.concrete} />
      </group>
      {structure.slabs.map((parts, i) => (
        <group
          key={i}
          ref={(el) => {
            slabRefs.current[i] = el;
          }}
          visible={false}
        >
          <BoxInstances items={parts} material={lib.concrete} />
        </group>
      ))}

      {/* Board-formed concrete masses */}
      {volumes.map((v, i) => (
        <group
          key={v.name}
          ref={(el) => {
            volRefs.current[i] = el;
          }}
          position={v.base}
          visible={false}
        >
          <mesh geometry={v.geo} material={M.facade} position={[0, v.h / 2, 0]} castShadow receiveShadow />
        </group>
      ))}

      {/* Formwork bands (follow the top of each rising mass) */}
      {concrete.map((v, i) => (
        <mesh
          key={`fw-${v.name}`}
          ref={(el) => {
            formRefs.current[i] = el;
          }}
          position={[volCenter(v)[0], 0, volCenter(v)[2]]}
          material={M.plywood}
          visible={false}
          castShadow
        >
          <boxGeometry args={[formwork[i][0] + 0.5, 1.4, formwork[i][2] + 0.5]} />
        </mesh>
      ))}
      <group ref={gShoring} visible={false}>
        <Members segments={shoring} thickness={0.09} material={lib.galvanised} round castShadow={false} />
      </group>

      {/* Crane (slewing jib), scaffold with netting, crew */}
      <group ref={gCrane} visible={false}>
        <Members segments={site.mast} thickness={0.16} material={lib.craneYellow} />
        <BoxInstances items={site.blocks} material={lib.concreteDark} />
        <group ref={gJib} position={[29, 0, -8]}>
          <Members segments={site.jib} thickness={0.16} material={lib.craneYellow} />
          <BoxInstances items={site.jibBlocks} material={lib.concreteDark} />
          <Members segments={site.hook} thickness={0.05} material={lib.steelDark} round castShadow={false} />
          <BoxInstances items={site.load} material={lib.primedSteel} />
        </group>
      </group>
      <group ref={gScaffold} visible={false}>
        <Members segments={site.sc} thickness={0.07} material={lib.galvanised} round />
        <BoxInstances items={site.planks} material={lib.oak} />
        <BoxInstances items={site.netting} material={M.netting} castShadow={false} receiveShadow={false} />
      </group>
      <group ref={gCrew} visible={false}>
        {workers.map((w, i) => (
          <group
            key={i}
            ref={(el) => {
              crewRefs.current[i] = el;
            }}
            position={w.p}
            rotation={[0, w.f, 0]}
          >
            <Worker M={M} />
          </group>
        ))}
      </group>

      {/* Curtain walls */}
      <group ref={gGlass} visible={false}>
        <BoxInstances items={glazing.panes} material={M.glass} castShadow={false} receiveShadow={false} />
        <mesh ref={slotRef} position={[(slot.x[0] + slot.x[1]) / 2, (slot.y[0] + slot.y[1]) / 2, slot.z]} material={M.slot}>
          <boxGeometry args={[slot.x[1] - slot.x[0], slot.y[1] - slot.y[0], 0.05]} />
        </mesh>
      </group>
      <group ref={gMullions} visible={false}>
        <Members segments={glazing.mullions} thickness={0.1} material={lib.blackMetal} />
      </group>

      {/* Interiors seen through the glass */}
      <group ref={gInterior} visible={false}>
        <BoxInstances items={interior.backGlow} material={M.glow} castShadow={false} />
        <BoxInstances items={interior.floors} material={M.interiorFloor} />
        <BoxInstances items={interior.strips} material={M.lightStrip} castShadow={false} />
        <BoxInstances items={interior.desks} material={M.silhouette} castShadow={false} />
        <BoxInstances items={interior.atriumCeiling} material={M.interiorFloor} castShadow={false} />
        <BoxInstances items={interior.treads} material={lib.blackMetal} />
        <BoxInstances items={interior.stringers} material={lib.blackMetal} />
        <BoxInstances items={interior.rails} material={M.balustrade} castShadow={false} receiveShadow={false} />
        <BoxInstances items={interior.landings} material={lib.blackMetal} />
        <BoxInstances items={interior.lobby} material={lib.stone} />
        <BoxInstances items={interior.pendants} material={M.lightStrip} geometry={unitCylinder} castShadow={false} />
        {interior.people.map((p, i) => (
          <group key={i} position={p}>
            <Silhouette material={M.silhouette} />
          </group>
        ))}
      </group>

      {/* Soffit downlights under the concrete overhangs */}
      <BoxInstances items={soffit} material={M.downlight} geometry={unitCylinder} castShadow={false} />
      </group>

      {/* Lights live outside the shell so the scene's light count never changes
          (a change would force every shader to recompile mid-scroll). Inside,
          they move under the hall's ring pendants. */}
      {SOFFIT_LIGHTS.map((p, i) => (
        <pointLight
          key={i}
          ref={(el) => {
            points.current[i] = el;
          }}
          position={p}
          intensity={0}
          distance={16}
          decay={2}
          color="#ffd39c"
        />
      ))}
    </group>
  );
}
