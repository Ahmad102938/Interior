"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are animated in useFrame */
import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import {
  BoxGeometry,
  BufferGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  Float32BufferAttribute,
  InstancedMesh,
  LineBasicMaterial,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  type Group,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { BoxInstances, Members, unitCylinder, useConst, type BoxItem, type Segment } from "../models/primitives";
import { LEVELS, ROOF, floorLayout, footprint } from "./building";
import { EXPLODE_GAP, explodeFactor, window01 } from "./stage";

const PLATES = [...LEVELS, ROOF];
const DUCT_Y = 3.3;
const DUCT_X: [number, number] = [-15, 19];
const PULSES_PER_FLOOR = 6;
const pulseGeo = new SphereGeometry(0.28, 12, 8);

/**
 * Plan stage: the model separates into an exploded stack of floor plates, each
 * with its own layout and colour-coded services (HVAC, power, plumbing) and
 * flow pulses running through the ducts. It re-assembles as construction starts.
 */
export function ExplodedFloors({ progress }: { progress: React.RefObject<ProgressController> }) {
  const M = useConst(() => ({
    fill: new MeshBasicMaterial({ color: "#2c4a74", transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }),
    edge: new LineBasicMaterial({ color: "#e0c38a", transparent: true, opacity: 0 }),
    layout: new LineBasicMaterial({ color: "#a9c2e2", transparent: true, opacity: 0 }),
    duct: new MeshStandardMaterial({ color: "#8fb3d1", metalness: 0.6, roughness: 0.35, transparent: true, opacity: 0 }),
    tray: new MeshStandardMaterial({ color: "#d8b77a", metalness: 0.6, roughness: 0.4, transparent: true, opacity: 0 }),
    pipe: new MeshStandardMaterial({ color: "#4fae80", metalness: 0.4, roughness: 0.4, transparent: true, opacity: 0 }),
    plant: new MeshStandardMaterial({ color: "#a9bccf", metalness: 0.5, roughness: 0.45, transparent: true, opacity: 0 }),
    pv: new MeshStandardMaterial({ color: "#16263c", metalness: 0.4, roughness: 0.2, transparent: true, opacity: 0 }),
    pulse: new MeshBasicMaterial({ color: new Color("#bfe3ff"), transparent: true, opacity: 0 }),
  }));

  const geo = useConst(() => {
    // Plate outline: main footprint + the tower's projection towards the plaza
    const boxes: [number, number, number, number][] = [
      [footprint.x[0], footprint.z[0], footprint.x[1], footprint.z[1]],
      [-3, 10.5, 7, 13],
    ];
    const fills: BoxItem[] = boxes.map(([x0, z0, x1, z1]) => ({ p: [(x0 + x1) / 2, 0, (z0 + z1) / 2], s: [x1 - x0, 0.14, z1 - z0] }));
    const edges = mergeGeometries(
      boxes.map(([x0, z0, x1, z1]) => {
        const b = new BoxGeometry(x1 - x0, 0.14, z1 - z0);
        b.applyMatrix4(new Matrix4().makeTranslation((x0 + x1) / 2, 0, (z0 + z1) / 2));
        const e = new EdgesGeometry(b);
        b.dispose();
        return e;
      }),
    )!;
    const layouts = PLATES.map((_, i) => {
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(floorLayout(i).flat(), 3));
      return g;
    });
    // Services per floor (plate-local)
    const ducts: BoxItem[] = [
      { p: [(DUCT_X[0] + DUCT_X[1]) / 2, DUCT_Y, -3.6], s: [DUCT_X[1] - DUCT_X[0], 0.5, 0.9] },
      ...[10, 13, 16].map<BoxItem>((x) => ({ p: [x, DUCT_Y - 0.1, 2.7], s: [0.4, 0.3, 12.6] })),
      ...[-1, 3].map<BoxItem>((x) => ({ p: [x, DUCT_Y - 0.1, 4.6], s: [0.4, 0.3, 16.4] })),
    ];
    const trays: BoxItem[] = [
      { p: [2, DUCT_Y + 0.4, -5.4], s: [36, 0.08, 0.5] },
      { p: [11.5, DUCT_Y + 0.4, 3], s: [0.4, 0.08, 15] },
    ];
    const pipes: Segment[] = [
      [[-17, DUCT_Y - 0.4, -12], [-17, DUCT_Y - 0.4, 8]],
      [[-17, DUCT_Y - 0.4, -12], [16, DUCT_Y - 0.4, -12]],
    ];
    // Roof plant
    const plant: BoxItem[] = [
      ...[5, 9.2, 13.4].map<BoxItem>((x) => ({ p: [x, 1.2, -9.3], s: [3.2, 2.2, 4.6] })),
      { p: [-7.5, 1.6, -8], s: [8.6, 3, 7.6] },
    ];
    const chillers: BoxItem[] = [17.5, 19.6].map((x) => ({ p: [x, 1, -10.5], s: [1.8, 2, 1.8] }));
    const pv: BoxItem[] = [];
    for (let x = -18; x < -12; x += 2.2) for (let z = -1; z < 9; z += 1.4) pv.push({ p: [x, 0.7, z], s: [2, 0.05, 1.1], r: [0.35, 0, 0] });
    return { fills, edges, layouts, ducts, trays, pipes, plant, chillers, pv };
  });
  useEffect(
    () => () => {
      Object.values(M).forEach((m) => m.dispose());
      geo.edges.dispose();
      geo.layouts.forEach((g) => g.dispose());
    },
    [M, geo],
  );

  const root = useRef<Group>(null);
  const plates = useRef<(Group | null)[]>([]);
  const pulses = useRef<InstancedMesh>(null);
  const mat = useConst(() => new Matrix4());

  useFrame((state) => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    const vis = window01(s, T.floors.in, T.floors.out);
    if (root.current) root.current.visible = vis > 0.01;
    if (vis <= 0.01) return;
    const ex = explodeFactor(s);
    plates.current.forEach((g, i) => {
      if (g) g.position.y = PLATES[i] + ex * i * EXPLODE_GAP;
    });
    M.fill.opacity = vis * (0.1 + ex * 0.12);
    M.edge.opacity = vis * 0.95;
    M.layout.opacity = vis * (0.35 + ex * 0.5);
    for (const m of [M.duct, M.tray, M.pipe, M.plant]) m.opacity = vis * (0.55 + ex * 0.4);
    M.pv.opacity = vis * 0.9;
    M.pulse.opacity = vis * ex;

    // Air "flowing" along each floor's main duct
    const mesh = pulses.current;
    if (mesh) {
      const t = state.clock.elapsedTime;
      let k = 0;
      for (let f = 0; f < LEVELS.length; f++) {
        for (let n = 0; n < PULSES_PER_FLOOR; n++) {
          const u = (t * 0.12 + n / PULSES_PER_FLOOR + f * 0.13) % 1;
          const x = DUCT_X[0] + u * (DUCT_X[1] - DUCT_X[0]);
          mat.makeTranslation(x, PLATES[f] + ex * f * EXPLODE_GAP + DUCT_Y, -3.6);
          mesh.setMatrixAt(k++, mat);
        }
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={root} visible={false}>
      {PLATES.map((y, i) => (
        <group
          key={i}
          ref={(el) => {
            plates.current[i] = el;
          }}
          position={[0, y, 0]}
        >
          <BoxInstances items={geo.fills} material={M.fill} castShadow={false} receiveShadow={false} />
          <lineSegments geometry={geo.edges} material={M.edge} />
          <lineSegments geometry={geo.layouts[i]} material={M.layout} />
          {i < LEVELS.length ? (
            <>
              <BoxInstances items={geo.ducts} material={M.duct} castShadow={false} />
              <BoxInstances items={geo.trays} material={M.tray} castShadow={false} />
              <Members segments={geo.pipes} thickness={0.22} material={M.pipe} round castShadow={false} />
            </>
          ) : (
            <>
              <BoxInstances items={geo.plant} material={M.plant} castShadow={false} />
              <BoxInstances items={geo.chillers} material={M.plant} geometry={unitCylinder} castShadow={false} />
              <BoxInstances items={geo.pv} material={M.pv} castShadow={false} />
            </>
          )}
        </group>
      ))}
      <instancedMesh ref={pulses} args={[pulseGeo, M.pulse, LEVELS.length * PULSES_PER_FLOOR]} frustumCulled={false} />
    </group>
  );
}
