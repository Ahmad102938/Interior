"use client";

/* eslint-disable react-hooks/immutability -- three.js objects are animated in useFrame */
import { useEffect, useLayoutEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MeshReflectorMaterial } from "@react-three/drei";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import {
  Color,
  ConeGeometry,
  CylinderGeometry,
  IcosahedronGeometry,
  InstancedMesh,
  Matrix4,
  MeshStandardMaterial,
  Quaternion,
  Euler,
  Vector3,
  type BufferGeometry,
  type Group,
  type PointLight,
  type SpotLight,
} from "three";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { getMaterials } from "../models/materials";
import { paving } from "../models/textures";
import { BoxInstances, useConst, type BoxItem } from "../models/primitives";
import { benches, planters, steps, trees, uplights, type V3 } from "./building";
import { worldBox } from "./geometry";

const ramp = (s: number, [a, b]: readonly [number, number]) => {
  const t = Math.min(1, Math.max(0, (s - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

function rng(seed: number) {
  return () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
}

const bladeGeo = new ConeGeometry(0.035, 1, 3);
bladeGeo.translate(0, 0.5, 0);
const leafGeo = new IcosahedronGeometry(1, 2);
const trunkGeo = new CylinderGeometry(0.6, 1, 1, 8);
trunkGeo.translate(0, 0.5, 0);

/**
 * Procedural tree: tapered trunk, a few limbs, clustered canopy. Clusters and
 * limbs are merged into 3 geometries (bark + two leaf tones) — 3 draw calls per
 * tree instead of ~45, which matters because the plaza reflection renders the
 * scene twice. Foliage receives but does not cast shadows.
 */
function Tree({ h, r, seed, foliage, foliage2, bark }: { h: number; r: number; seed: number; foliage: MeshStandardMaterial; foliage2: MeshStandardMaterial; bark: MeshStandardMaterial }) {
  const geos = useConst(() => {
    const rand = rng(seed * 101 + 7);
    const trunkH = h * 0.55;
    const m = new Matrix4();
    const q = new Quaternion();
    const e = new Euler();
    const place = (src: BufferGeometry, p: V3, sc: V3, rot: V3 = [0, 0, 0]) => {
      const g = src.clone();
      g.applyMatrix4(m.compose(new Vector3(...p), q.setFromEuler(e.set(...rot)), new Vector3(...sc)));
      return g;
    };
    const barkParts = [place(trunkGeo, [0, 0, 0], [0.22, trunkH, 0.22])];
    for (let i = 0; i < 3; i++) {
      const a = (i / 3) * Math.PI * 2 + rand();
      const tilt = 0.5 + rand() * 0.3;
      barkParts.push(place(trunkGeo, [0, trunkH * 0.85, 0], [0.1, h * 0.35, 0.1], [Math.sin(a) * tilt, 0, Math.cos(a) * tilt]));
    }
    const leaves: BufferGeometry[][] = [[], []];
    const n = 38 + Math.floor(rand() * 10);
    for (let i = 0; i < n; i++) {
      const a = rand() * Math.PI * 2;
      const v = rand() * 2 - 1;
      const rr = Math.cbrt(rand());
      const d = Math.sqrt(1 - v * v) * rr * r;
      const y = trunkH + (h - trunkH) * 0.5 + v * rr * (h - trunkH) * 0.5;
      const sc = r * (0.15 + rand() * 0.13);
      leaves[i % 3 === 0 ? 1 : 0].push(place(leafGeo, [Math.cos(a) * d, y, Math.sin(a) * d], [sc, sc * 0.85, sc]));
    }
    const merge = (parts: BufferGeometry[]) => {
      const g = mergeGeometries(parts)!;
      parts.forEach((p) => p.dispose());
      return g;
    };
    return { bark: merge(barkParts), leaf: merge(leaves[0]), leaf2: merge(leaves[1]) };
  });
  useEffect(() => () => Object.values(geos).forEach((g) => g.dispose()), [geos]);
  return (
    <group>
      <mesh geometry={geos.bark} material={bark} castShadow />
      <mesh geometry={geos.leaf} material={foliage} receiveShadow />
      <mesh geometry={geos.leaf2} material={foliage2} receiveShadow />
    </group>
  );
}

function Grass({ material }: { material: MeshStandardMaterial }) {
  const ref = useRef<InstancedMesh>(null);
  const blades = useConst(() => {
    const out: { p: V3; r: V3; h: number }[] = [];
    const rand = rng(42);
    for (const pl of planters) {
      const area = (pl.x[1] - pl.x[0]) * (pl.z[1] - pl.z[0]);
      const n = Math.floor(area * 7);
      for (let i = 0; i < n; i++) {
        out.push({
          p: [pl.x[0] + 0.3 + rand() * (pl.x[1] - pl.x[0] - 0.6), pl.h, pl.z[0] + 0.3 + rand() * (pl.z[1] - pl.z[0] - 0.6)],
          r: [(rand() - 0.5) * 0.6, rand() * Math.PI, (rand() - 0.5) * 0.6],
          h: 0.35 + rand() * 0.75,
        });
      }
    }
    return out;
  });
  useLayoutEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const m = new Matrix4();
    const q = new Quaternion();
    const e = new Euler();
    blades.forEach((b, i) => {
      q.setFromEuler(e.set(...b.r));
      m.compose(new Vector3(...b.p), q, new Vector3(1, b.h, 1));
      mesh.setMatrixAt(i, m);
    });
    mesh.instanceMatrix.needsUpdate = true;
  }, [blades]);
  return <instancedMesh ref={ref} args={[bladeGeo, material, blades.length]} receiveShadow />;
}

export function Landscape({ progress, reflections }: { progress: React.RefObject<ProgressController>; reflections: boolean }) {
  const lib = getMaterials();
  const M = useConst(() => {
    const pave = paving();
    pave.repeat.set(30, 14);
    return {
      paving: new MeshStandardMaterial({ map: pave, roughness: 0.28, metalness: 0.05, envMapIntensity: 1.4 }),
      planter: new MeshStandardMaterial({ map: lib.concrete.map, color: "#d9d4ca", roughness: 0.85 }),
      foliage: new MeshStandardMaterial({ color: "#3f5d33", roughness: 0.8 }),
      foliage2: new MeshStandardMaterial({ color: "#5b7a3c", roughness: 0.8 }),
      grass: new MeshStandardMaterial({ color: "#5d6b3a", roughness: 0.9 }),
      bark: new MeshStandardMaterial({ color: "#3b2e25", roughness: 0.95 }),
      uplight: new MeshStandardMaterial({ color: "#fff1d6", emissive: new Color("#ffcf8a"), emissiveIntensity: 0 }),
    };
  });
  const paveTex = M.paving.map!;
  useEffect(() => () => Object.values(M).forEach((m) => m.dispose()), [M]);

  const planterGeos = useConst(() =>
    planters.map((pl) => ({
      geo: worldBox(pl.x[1] - pl.x[0], pl.h, pl.z[1] - pl.z[0]),
      p: [(pl.x[0] + pl.x[1]) / 2, pl.h / 2, (pl.z[0] + pl.z[1]) / 2] as V3,
    })),
  );
  useEffect(() => () => planterGeos.forEach((g) => g.geo.dispose()), [planterGeos]);
  const soil: BoxItem[] = useConst(() => planters.map((pl) => ({ p: [(pl.x[0] + pl.x[1]) / 2, pl.h - 0.04, (pl.z[0] + pl.z[1]) / 2], s: [pl.x[1] - pl.x[0] - 0.4, 0.05, pl.z[1] - pl.z[0] - 0.4] })));
  const lights: BoxItem[] = useConst(() => uplights.map((u) => ({ p: u, s: [0.35, 0.06, 0.35] })));

  const pave = useRef<Group>(null);
  const green = useRef<Group>(null);
  const treeRefs = useRef<(Group | null)[]>([]);
  const spots = useRef<(SpotLight | null)[]>([]);
  const treeLights = useRef<(PointLight | null)[]>([]);

  useFrame(() => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    // Paving slides up from beneath the site ground (opaque — no transparency cost).
    const pv = ramp(s, T.landscape.in);
    if (pave.current) {
      pave.current.position.y = -0.6 + pv * 0.62;
      pave.current.visible = pv > 0.001;
    }
    const grow = ramp(s, T.landscape.in);
    if (green.current) {
      green.current.visible = grow > 0.001;
      green.current.scale.y = Math.max(0.001, grow);
    }
    treeRefs.current.forEach((t, i) => {
      if (!t) return;
      const k = Math.min(1, Math.max(0, grow * 1.5 - i * 0.08));
      t.scale.setScalar(Math.max(0.001, k));
      t.visible = k > 0.01;
    });
    const lit = ramp(s, T.lights.in);
    M.uplight.emissiveIntensity = lit * 4;
    spots.current.forEach((l) => l && (l.intensity = lit * 220));
    treeLights.current.forEach((l) => l && (l.intensity = lit * 40));
  });

  return (
    <group>
      {/* Plaza paving (rises into place at handover) */}
      <group ref={pave} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 20]} receiveShadow material={reflections ? undefined : M.paving}>
          <planeGeometry args={[150, 70]} />
          {reflections && (
            <MeshReflectorMaterial
              map={paveTex}
              mirror={0.85}
              blur={[160, 40]}
              resolution={384}
              mixBlur={0.6}
              mixStrength={6}
              mixContrast={1.15}
              roughness={0.35}
              metalness={0.25}
              depthScale={0.4}
              minDepthThreshold={0.5}
              maxDepthThreshold={1.4}
              color="#b4b9c0"
            />
          )}
        </mesh>
      </group>

      {/* Planters, soil, grass, steps, benches */}
      <group ref={green} visible={false}>
        {planterGeos.map((g, i) => (
          <mesh key={i} geometry={g.geo} position={g.p} material={M.planter} castShadow receiveShadow />
        ))}
        <BoxInstances items={soil} material={lib.earth} castShadow={false} />
        <Grass material={M.grass} />
        <BoxInstances items={steps} material={M.planter} />
        <BoxInstances items={benches} material={lib.oak} />
      </group>

      {trees.map((t, i) => (
        <group
          key={i}
          ref={(el) => {
            treeRefs.current[i] = el;
          }}
          position={[t.p[0], t.p[1], t.p[2]]}
          visible={false}
        >
          <Tree h={t.h} r={t.r} seed={t.seed} foliage={M.foliage} foliage2={M.foliage2} bark={M.bark} />
        </group>
      ))}
      {/* Tree uplights live outside the toggled tree groups: hiding a light changes
          the scene's light count and forces every material to re-resolve its
          shader (a ~100 ms hitch). They fade by intensity instead. */}
      {trees.slice(0, 3).map((t, i) => (
        <pointLight
          key={`tl${i}`}
          ref={(el) => {
            treeLights.current[i] = el;
          }}
          position={[t.p[0], t.p[1] + t.h * 0.45, t.p[2] + 0.8]}
          intensity={0}
          distance={t.h * 1.2}
          decay={2}
          color="#ffd08a"
        />
      ))}

      {/* Ground uplights washing the concrete */}
      <BoxInstances items={lights} material={M.uplight} castShadow={false} />
      {[
        [2, 0.2, 14.4, 2, 24, 12.6],
        [-17.5, 0.2, 11.4, -17.5, 20, 9.8],
        [20.2, 0.2, 13.8, 20.2, 20, 12.2],
      ].map(([x, y, z, tx, ty, tz], i) => (
        <spotLight
          key={i}
          ref={(el) => {
            spots.current[i] = el;
            if (el) {
              el.target.position.set(tx, ty, tz);
              el.target.updateMatrixWorld();
            }
          }}
          position={[x, y, z]}
          angle={0.32}
          penumbra={1}
          distance={34}
          decay={1.6}
          intensity={0}
          color="#ffc98a"
        />
      ))}
    </group>
  );
}
