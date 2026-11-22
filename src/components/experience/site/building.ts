
/**
 * The hero building — a five-storey civic/commercial block in board-formed
 * concrete with deep framed glazing, a glazed feature-stair atrium and a
 * landscaped plaza. Units are metres; +z faces the plaza (camera side).
 * Every stage (blueprint → model → structure → finished building) is derived
 * from this one definition so the transformation always lines up.
 */
export type V3 = [number, number, number];
export type Range = [number, number];
export type Vol = { name: string; x: Range; y: Range; z: Range };

export const FLOOR_H = 4.2;
export const LEVELS = [0, 4.2, 8.4, 12.6, 16.8];
export const ROOF = 21;

/** Solid board-formed concrete masses. */
export const concrete: Vol[] = [
  { name: "tower", x: [-3, 7], y: [0, 26], z: [2, 13] },
  { name: "leftPier", x: [-20, -15], y: [0, 21], z: [-2, 10] },
  { name: "rightPier", x: [19, 21.5], y: [0, 22], z: [-2, 12.5] },
  { name: "rightFrame", x: [7, 21.5], y: [17.5, 22], z: [-2, 12.5] },
  { name: "leftCanopy", x: [-15, -3], y: [17, 21], z: [-2, 10.5] },
  { name: "back", x: [-20, 21.5], y: [0, 22], z: [-14, -2] },
  { name: "roofBox", x: [-12, -3], y: [22, 25.5], z: [-12, -4] },
];

/** Glazed bays: curtain wall on the +z face at `front`. */
export const bays = {
  office: { x: [7, 19] as Range, y: [0, 17.5] as Range, z: [-2, 10.5] as Range, front: 10.5 },
  atrium: { x: [-15, -3] as Range, y: [0, 17] as Range, z: [-2, 8.5] as Range, front: 8.5 },
};

/** Vertical slot window in the tower's front face. */
export const slot = { x: [3.4, 4.1] as Range, y: [2.5, 23.5] as Range, z: 13.02 };

/** Structural grid (6 m bays). */
export const gridX = [-15, -9, -3, 3, 9, 15];
export const gridZ = [-12, -6, 0, 6];

/** Building footprint for slabs during construction. */
export const footprint = { x: [-20, 21.5] as Range, z: [-14, 10.5] as Range };

/* ---------- Atrium feature stair ---------- */

export type Flight = { a: V3; b: V3; width: number };
export type Landing = { p: V3; s: V3 };

export function stairFlights() {
  const flights: Flight[] = [];
  const landings: Landing[] = [];
  const xa = -13.2;
  const xb = -6.6;
  for (const L of LEVELS.slice(0, 4)) {
    const mid = L + FLOOR_H / 2;
    flights.push({ a: [xa, L, 6.3], b: [xb, mid, 6.3], width: 1.6 });
    landings.push({ p: [xb + 0.9, mid, 5.4], s: [1.8, 0.22, 3.4] });
    flights.push({ a: [xb, mid, 4.5], b: [xa, L + FLOOR_H, 4.5], width: 1.6 });
    landings.push({ p: [xa - 0.9, L + FLOOR_H, 5.4], s: [1.8, 0.22, 3.4] });
  }
  return { flights, landings };
}

/* ---------- Plaza & landscape ---------- */

export type Planter = { x: Range; z: Range; h: number };
export const planters: Planter[] = [
  { x: [-28, -10], z: [22, 29], h: 0.85 },
  { x: [0, 12], z: [17, 21], h: 0.75 },
  { x: [24, 33], z: [13, 24], h: 0.85 },
  { x: [-19, -12], z: [12, 15.5], h: 0.6 },
];

export const steps: { p: V3; s: V3 }[] = [
  { p: [-10.2, 0.2, 27.5], s: [3.2, 0.4, 2.6] },
  { p: [-10.2, 0.45, 27.5], s: [1.6, 0.9, 2.6] },
  { p: [12.8, 0.18, 19], s: [2.4, 0.36, 2.2] },
];

export const benches: { p: V3; s: V3 }[] = [
  { p: [-19, 0.9, 29.25], s: [7, 0.1, 0.6] },
  { p: [6, 0.8, 21.25], s: [5, 0.1, 0.55] },
];

export const trees: { p: V3; h: number; r: number; seed: number }[] = [
  { p: [-21, 0.85, 25.5], h: 11.5, r: 3.4, seed: 3 },
  { p: [8, 0.75, 19], h: 6.8, r: 2.3, seed: 7 },
  { p: [29, 0.85, 18], h: 8.5, r: 2.7, seed: 11 },
  { p: [-33, 0, 8], h: 9.5, r: 3, seed: 13 },
  { p: [36, 0, 4], h: 7.5, r: 2.5, seed: 17 },
  { p: [-15.5, 0.6, 13.8], h: 4.5, r: 1.6, seed: 19 },
];

/** Ground uplights washing the concrete (warm grazing light, like the reference). */
export const uplights: V3[] = [
  [-1.5, 0.05, 13.6],
  [2, 0.05, 13.6],
  [5.6, 0.05, 13.6],
  [-18.5, 0.05, 10.6],
  [-16.5, 0.05, 10.6],
  [20.2, 0.05, 13],
];

/**
 * Floating annotations. `when` = [fade-in start, fade-in end, fade-out start,
 * fade-out end] in story units; `level` anchors the tag to an exploded floor.
 */
export type Tag = {
  label: string;
  detail: string;
  pos: V3;
  when: [number, number, number, number];
  /** Exploded floor the callout rides on. */
  level?: number;
  /** Which way the leader line runs, and its horizontal reach in px. */
  side: "left" | "right";
  reach: number;
};
export const tagsAt: Tag[] = [
  // Design — measured, studied, set out
  { label: "Building height", detail: "26.0 m", pos: [2, 26.2, 13], when: [0.62, 0.82, 1.22, 1.34], side: "right", reach: 72 },
  { label: "Roof level", detail: "+21.0 m", pos: [24.5, 21, 13.5], when: [0.66, 0.86, 1.22, 1.34], side: "right", reach: 44 },
  { label: "Level 03", detail: "+12.6 m", pos: [24.5, 12.6, 13.5], when: [0.7, 0.9, 1.22, 1.34], side: "right", reach: 44 },
  { label: "Solar study", detail: "Sun path & daylight", pos: [-30, 26, -20], when: [0.74, 0.94, 1.22, 1.34], side: "left", reach: 40 },
  // Plan — exploded floors
  { label: "Roof plant", detail: "AHUs · chillers · PV", pos: [14, 21 + 2.4, -9.3], when: [1.66, 1.84, 2.22, 2.32], level: 5, side: "right", reach: 56 },
  { label: "Office floor", detail: "Column-free plate", pos: [19.5, LEVELS[3], 8], when: [1.7, 1.88, 2.22, 2.32], level: 3, side: "right", reach: 48 },
  { label: "Services", detail: "HVAC · power · water", pos: [19, LEVELS[1] + 3.3, -3.6], when: [1.74, 1.92, 2.22, 2.32], level: 1, side: "right", reach: 56 },
];

/* ---------- Context: neighbouring blocks & streets ---------- */

/** Neighbouring buildings: wire massing in Design, solid on site, lit at dusk. */
export const contextBlocks: Vol[] = [
  { name: "n1", x: [-78, -50], y: [0, 18], z: [-52, -26] },
  { name: "n2", x: [-44, -30], y: [0, 34], z: [-62, -40] },
  { name: "n3", x: [36, 62], y: [0, 28], z: [-58, -32] },
  { name: "n4", x: [68, 92], y: [0, 16], z: [-40, -12] },
  { name: "n5", x: [-96, -70], y: [0, 24], z: [-12, 18] },
  { name: "n6", x: [-14, 22], y: [0, 12], z: [-74, -54] },
  { name: "n7", x: [70, 96], y: [0, 40], z: [0, 26] },
  { name: "n8", x: [-110, -86], y: [0, 14], z: [30, 56] },
];

/** Streets around the block (asphalt strips). */
export const roads: { x: Range; z: Range; dir: "x" | "z" }[] = [
  { x: [-140, 140], z: [58, 70], dir: "x" },
  { x: [-62, -50], z: [-120, 58], dir: "z" },
  { x: [50, 62], z: [-120, 58], dir: "z" },
  { x: [-140, 140], z: [-34, -24], dir: "x" },
];

/** Construction plot boundary (site hoarding), with a gate on the plaza side. */
export const plot = { x: [-36, 36] as Range, z: [-22, 30] as Range, gate: [-6, 6] as Range };

/* ---------- Floor-plate layout (Plan stage, exploded floors) ---------- */

/** Interior layout linework for one floor, in plate-local coordinates (y = 0). */
export function floorLayout(level: number) {
  const pts: V3[] = [];
  const y = 0.06;
  const seg = (a: [number, number], b: [number, number]) => pts.push([a[0], y, a[1]], [b[0], y, b[1]]);
  const rect = (x0: number, z0: number, x1: number, z1: number) => {
    seg([x0, z0], [x1, z0]);
    seg([x1, z0], [x1, z1]);
    seg([x1, z1], [x0, z1]);
    seg([x0, z1], [x0, z0]);
  };
  // Cores (lifts, stairs, risers)
  rect(-8, -11, -4, -6);
  rect(10, -11, 14, -6);
  for (const x of [-7, -5]) seg([x, -11], [x, -6]);
  // Corridor
  seg([-15, -4.5], [19, -4.5]);
  seg([-15, -2.6], [19, -2.6]);
  if (level < 5) {
    // Meeting rooms & toilets along the back
    for (let x = -14; x < -8; x += 3) rect(x, -13.4, x + 3, -8.5);
    rect(15, -13.4, 20.8, -8.5);
    seg([17.9, -13.4], [17.9, -8.5]);
    // Office desks
    for (let x = 8.6; x < 18; x += 3) for (let z = 0; z < 9; z += 2.8) rect(x, z, x + 2.2, z + 1.2);
    // Tower floor
    rect(-2.2, 3, 6.2, 12.2);
    for (let x = -1.4; x < 5.5; x += 2.4) rect(x, 4, x + 1.6, 5.2);
    // Atrium void (dashed)
    for (let x = -15; x < -3; x += 1.2) seg([x, -2], [x + 0.6, -2]);
    for (let z = -2; z < 8.5; z += 1.2) seg([-3, z], [-3, z + 0.6]);
    if (level === 0) rect(-12.5, 1, -8.5, 2.2);
  } else {
    // Roof plant zone
    rect(-12, -12, -3, -4);
    for (let x = 4; x < 18; x += 3.5) rect(x, -12, x + 2.6, -6.5);
  }
  return pts;
}


export const volCenter = (v: Vol): V3 => [(v.x[0] + v.x[1]) / 2, (v.y[0] + v.y[1]) / 2, (v.z[0] + v.z[1]) / 2];
export const volSize = (v: Vol): V3 => [v.x[1] - v.x[0], v.y[1] - v.y[0], v.z[1] - v.z[0]];

/* ---------- Blueprint: ground-floor plan + site plan ---------- */

const C = {
  wall: [0.89, 0.78, 0.56] as V3,
  glass: [0.8, 0.86, 0.95] as V3,
  furn: [0.58, 0.68, 0.82] as V3,
  grid: [0.3, 0.4, 0.55] as V3,
  land: [0.42, 0.62, 0.5] as V3,
  dim: [0.69, 0.58, 0.4] as V3,
};

export function blueprintLines() {
  const pts: V3[] = [];
  const cols: V3[] = [];
  const y = 0.05;
  const seg = (a: V3, b: V3, c: V3) => {
    pts.push(a, b);
    cols.push(c, c);
  };
  const rect = (x0: number, z0: number, x1: number, z1: number, c: V3) => {
    seg([x0, y, z0], [x1, y, z0], c);
    seg([x1, y, z0], [x1, y, z1], c);
    seg([x1, y, z1], [x0, y, z1], c);
    seg([x0, y, z1], [x0, y, z0], c);
  };
  const dashed = (a: [number, number], b: [number, number], c: V3, dash = 0.8) => {
    const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
    const n = Math.floor(len / (dash * 2));
    for (let i = 0; i < n; i++) {
      const t0 = (i * 2 * dash) / len;
      const t1 = ((i * 2 + 1) * dash) / len;
      seg([a[0] + (b[0] - a[0]) * t0, y, a[1] + (b[1] - a[1]) * t0], [a[0] + (b[0] - a[0]) * t1, y, a[1] + (b[1] - a[1]) * t1], c);
    }
  };
  const circle = (cx: number, cz: number, r: number, c: V3, n = 20) => {
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2;
      const a1 = ((i + 1) / n) * Math.PI * 2;
      seg([cx + Math.cos(a0) * r, y, cz + Math.sin(a0) * r], [cx + Math.cos(a1) * r, y, cz + Math.sin(a1) * r], c);
    }
  };

  // Structural grid + bubbles
  for (const x of gridX) {
    seg([x, y, -18], [x, y, 14], C.grid);
    circle(x, -19.2, 1, C.grid, 16);
  }
  for (const z of gridZ) {
    seg([-24, y, z], [25, y, z], C.grid);
    circle(-25.2, z, 1, C.grid, 16);
  }

  // Concrete walls at ground level (double outline = wall thickness)
  for (const v of concrete.filter((v) => v.y[0] === 0)) {
    rect(v.x[0], v.z[0], v.x[1], v.z[1], C.wall);
    rect(v.x[0] + 0.45, v.z[0] + 0.45, v.x[1] - 0.45, v.z[1] - 0.45, C.wall);
  }
  // Overhangs above, dashed
  for (const v of concrete.filter((v) => v.y[0] > 0 && v.name !== "roofBox")) {
    dashed([v.x[0], v.z[1]], [v.x[1], v.z[1]], C.dim);
    dashed([v.x[0], v.z[0]], [v.x[0], v.z[1]], C.dim);
  }
  // Slot window
  rect(slot.x[0], 12.6, slot.x[1], 13.1, C.glass);

  // Curtain walls with mullion ticks
  for (const b of Object.values(bays)) {
    seg([b.x[0], y, b.front], [b.x[1], y, b.front], C.glass);
    seg([b.x[0], y, b.front - 0.2], [b.x[1], y, b.front - 0.2], C.glass);
    for (let x = b.x[0]; x <= b.x[1] + 0.01; x += 1.5) seg([x, y, b.front + 0.35], [x, y, b.front - 0.55], C.glass);
  }

  // Atrium stair flights with treads
  const { flights } = stairFlights();
  for (const f of flights.slice(0, 2)) {
    const x0 = Math.min(f.a[0], f.b[0]);
    const x1 = Math.max(f.a[0], f.b[0]);
    rect(x0, f.a[2] - f.width / 2, x1, f.a[2] + f.width / 2, C.wall);
    for (let x = x0; x <= x1; x += 0.6) seg([x, y, f.a[2] - f.width / 2], [x, y, f.a[2] + f.width / 2], C.furn);
  }
  // Office furniture blocks
  for (let x = 8.5; x < 18; x += 3.2) for (let z = 0; z < 9; z += 3) rect(x, z, x + 2.4, z + 1.4, C.furn);
  // Reception / lobby desk in the atrium
  rect(-12.5, 1, -8.5, 2.2, C.furn);

  // Landscape: planters, trees, benches, steps
  for (const p of planters) rect(p.x[0], p.z[0], p.x[1], p.z[1], C.land);
  for (const t of trees) {
    circle(t.p[0], t.p[2], t.r, C.land, 24);
    circle(t.p[0], t.p[2], 0.35, C.land, 10);
  }
  for (const b of benches) rect(b.p[0] - b.s[0] / 2, b.p[2] - b.s[2] / 2, b.p[0] + b.s[0] / 2, b.p[2] + b.s[2] / 2, C.furn);
  for (let i = 0; i < 4; i++) seg([-11.8, y, 26.2 + i * 0.65], [-8.6, y, 26.2 + i * 0.65], C.furn);
  // Main walkway edge
  dashed([-40, 16], [24, 16], C.grid, 1.2);

  // Streets, plot boundary, north arrow, scale bar
  for (const r of roads) {
    if (r.dir === "x") {
      seg([Math.max(r.x[0], -70), y, r.z[0]], [Math.min(r.x[1], 70), y, r.z[0]], C.grid);
      seg([Math.max(r.x[0], -70), y, r.z[1]], [Math.min(r.x[1], 70), y, r.z[1]], C.grid);
    } else {
      seg([r.x[0], y, Math.max(r.z[0], -60)], [r.x[0], y, r.z[1]], C.grid);
      seg([r.x[1], y, Math.max(r.z[0], -60)], [r.x[1], y, r.z[1]], C.grid);
    }
  }
  dashed([plot.x[0], plot.z[0]], [plot.x[1], plot.z[0]], C.dim, 1.5);
  dashed([plot.x[1], plot.z[0]], [plot.x[1], plot.z[1]], C.dim, 1.5);
  dashed([plot.x[0], plot.z[1]], [plot.x[0], plot.z[0]], C.dim, 1.5);
  circle(40, 40, 3, C.dim, 28);
  seg([40, y, 43.5], [40, y, 35.5], C.wall);
  seg([40, y, 35.5], [38.6, y, 38.4], C.wall);
  seg([40, y, 35.5], [41.4, y, 38.4], C.wall);
  seg([-26, y, 44], [-6, y, 44], C.dim);
  for (const x of [-26, -21, -16, -6]) seg([x, y, 43.4], [x, y, 44.6], C.dim);

  // Overall dimension strings
  seg([-20, y, 34], [21.5, y, 34], C.dim);
  for (const x of [-20, -3, 7, 21.5]) seg([x - 0.5, y, 34.5], [x + 0.5, y, 33.5], C.dim);
  seg([-29, y, -14], [-29, y, 13], C.dim);
  for (const z of [-14, -2, 13]) seg([-29.5, y, z + 0.5], [-28.5, y, z - 0.5], C.dim);

  return { pts, cols };
}
