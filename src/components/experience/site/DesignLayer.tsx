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
  Line,
  LineBasicMaterial,
  LineDashedMaterial,
  Matrix4,
  MeshBasicMaterial,
  MeshStandardMaterial,
  type Group,
  type Mesh,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { STORY_PANELS, stageTimeline as T } from "@/config/experience";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { BoxInstances, useConst, type BoxItem } from "../models/primitives";
import { cityWindows } from "../models/textures";
import { LEVELS, ROOF, contextBlocks, roads, volCenter, volSize } from "./building";
import { worldBox } from "./geometry";
import { ramp, window01 } from "./stage";

/**
 * Everything around the building that makes each stage feel like real work:
 * Design — context massing (wire), section plane sweeping the model, sun-path
 *          study, full-height dimension with level ticks.
 * Build+ — the same neighbours as solid buildings and the surrounding streets;
 *          at dusk their windows light up.
 */
export function DesignLayer({ progress }: { progress: React.RefObject<ProgressController> }) {
  const M = useConst(() => {
    const win = cityWindows();
    return {
      ctxLine: new LineBasicMaterial({ color: "#8fa6c6", transparent: true, opacity: 0 }),
      ctxFill: new MeshBasicMaterial({ color: "#8fa6c6", transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }),
      ctxSolid: new MeshStandardMaterial({ color: "#3b4250", roughness: 0.85, emissive: new Color("#ffffff"), emissiveMap: win, emissiveIntensity: 0 }),
      section: new MeshBasicMaterial({ color: "#d8b77a", transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }),
      sectionEdge: new LineBasicMaterial({ color: "#e6c88c", transparent: true, opacity: 0 }),
      sunPath: new LineDashedMaterial({ color: "#d8b77a", dashSize: 1.2, gapSize: 0.8, transparent: true, opacity: 0 }),
      sun: new MeshBasicMaterial({ color: "#ffd79a", transparent: true, opacity: 0 }),
      dim: new LineBasicMaterial({ color: "#e6c88c", transparent: true, opacity: 0 }),
      asphalt: new MeshStandardMaterial({ color: "#26292d", roughness: 0.9 }),
      kerb: new MeshStandardMaterial({ color: "#8e8b85", roughness: 0.9 }),
      lane: new MeshBasicMaterial({ color: "#d9d4c8" }),
    };
  });

  const geo = useConst(() => {
    // Context massing wireframe + per-floor bands
    const parts: BufferGeometry[] = [];
    for (const v of contextBlocks) {
      const s = volSize(v);
      const c = volCenter(v);
      const box = new BoxGeometry(...s);
      box.applyMatrix4(new Matrix4().makeTranslation(...c));
      parts.push(new EdgesGeometry(box));
      box.dispose();
      for (let y = 4; y < s[1]; y += 4) {
        const band = new BoxGeometry(s[0], 0.001, s[2]);
        band.applyMatrix4(new Matrix4().makeTranslation(c[0], y, c[2]));
        parts.push(new EdgesGeometry(band));
        band.dispose();
      }
    }
    const ctxEdges = mergeGeometries(parts)!;
    parts.forEach((p) => p.dispose());
    const ctxBoxes = contextBlocks.map((v) => ({ geo: worldBox(...volSize(v), 24), p: volCenter(v) }));

    // Sun path arc (east → west over the site)
    const arc: number[] = [];
    for (let i = 0; i <= 64; i++) {
      const a = Math.PI * (i / 64);
      arc.push(Math.cos(a) * 46, Math.sin(a) * 36 + 2, -6 - Math.sin(a) * 18);
    }
    const sunGeo = new BufferGeometry();
    sunGeo.setAttribute("position", new Float32BufferAttribute(arc, 3));

    // Height dimension with level ticks
    const d: number[] = [];
    const x = 24.5;
    const z = 13.5;
    d.push(x, 0, z, x, 26, z);
    for (const y of [...LEVELS, ROOF, 26]) d.push(x - 0.8, y, z, x + 0.8, y, z);
    d.push(-3, 27.4, 13.5, 7, 27.4, 13.5, -3, 26.6, 13.5, -3, 28.2, 13.5, 7, 26.6, 13.5, 7, 28.2, 13.5);
    const dimGeo = new BufferGeometry();
    dimGeo.setAttribute("position", new Float32BufferAttribute(d, 3));

    // Streets: asphalt, kerbs, lane dashes
    const asphalt: BoxItem[] = roads.map((r) => ({ p: [(r.x[0] + r.x[1]) / 2, 0.02, (r.z[0] + r.z[1]) / 2], s: [r.x[1] - r.x[0], 0.04, r.z[1] - r.z[0]] }));
    const kerbs: BoxItem[] = roads.flatMap((r) =>
      r.dir === "x"
        ? [r.z[0], r.z[1]].map<BoxItem>((z) => ({ p: [(r.x[0] + r.x[1]) / 2, 0.1, z], s: [r.x[1] - r.x[0], 0.2, 0.3] }))
        : [r.x[0], r.x[1]].map<BoxItem>((x) => ({ p: [x, 0.1, (r.z[0] + r.z[1]) / 2], s: [0.3, 0.2, r.z[1] - r.z[0]] })),
    );
    const lanes: BoxItem[] = [];
    for (const r of roads) {
      if (r.dir === "x") for (let x = r.x[0]; x < r.x[1]; x += 6) lanes.push({ p: [x, 0.05, (r.z[0] + r.z[1]) / 2], s: [3, 0.01, 0.18] });
      else for (let z = r.z[0]; z < r.z[1]; z += 6) lanes.push({ p: [(r.x[0] + r.x[1]) / 2, 0.05, z], s: [0.18, 0.01, 3] });
    }
    const sectionEdges = new EdgesGeometry(new BoxGeometry(52, 0.001, 34));
    return { ctxEdges, ctxBoxes, sunGeo, dimGeo, sectionEdges, asphalt, kerbs, lanes };
  });

  useEffect(
    () => () => {
      Object.values(M).forEach((m) => m.dispose());
      geo.ctxEdges.dispose();
      geo.sunGeo.dispose();
      geo.dimGeo.dispose();
      geo.sectionEdges.dispose();
      geo.ctxBoxes.forEach((b) => b.geo.dispose());
    },
    [M, geo],
  );

  const ctxWire = useRef<Group>(null);
  const ctxSolid = useRef<Group>(null);
  const section = useRef<Group>(null);
  const sunGroup = useRef<Group>(null);
  const sunBall = useRef<Mesh>(null);
  // Dashed arc: a plain THREE.Line with line distances for the dash pattern.
  const sunLine = useConst(() => {
    const l = new Line(geo.sunGeo, M.sunPath);
    l.computeLineDistances();
    return l;
  });
  const dims = useRef<Group>(null);
  const streets = useRef<Group>(null);

  useFrame((state) => {
    const s = sceneProgress(progress.current) * (STORY_PANELS - 1);
    const t = state.clock.elapsedTime;

    // Context: wire massing in Design/Plan → solid neighbours from Build on
    const wire = window01(s, T.context.in, T.context.wireOut);
    M.ctxLine.opacity = wire * 0.55;
    M.ctxFill.opacity = wire * 0.035;
    if (ctxWire.current) ctxWire.current.visible = wire > 0.01;
    const solid = ramp(s, T.context.solidIn);
    if (ctxSolid.current) {
      ctxSolid.current.visible = solid > 0.01;
      ctxSolid.current.scale.y = Math.max(0.001, solid);
    }
    M.ctxSolid.emissiveIntensity = ramp(s, T.lights.in) * 0.55;

    // Design tools
    const tools = window01(s, T.designTools.in, T.designTools.out);
    M.section.opacity = tools * 0.1;
    M.sectionEdge.opacity = tools * 0.9;
    M.sunPath.opacity = tools * 0.8;
    M.sun.opacity = tools;
    M.dim.opacity = tools * 0.9;
    // Section plane: drifts while Design holds, then scroll drives it up through
    // the roof — the floors separate behind it (Design → Plan hand-off).
    const sweep = ramp(s, T.sectionSweep.rise);
    if (section.current) {
      section.current.visible = tools > 0.01;
      const drift = 4 + (Math.sin(t * 0.6) * 0.5 + 0.5) * 16;
      section.current.position.y = drift + (27 - drift) * sweep;
    }
    M.section.opacity = tools * (0.1 + sweep * 0.12);
    M.sectionEdge.opacity = tools * (0.9 + sweep * 0.1);
    if (sunGroup.current) sunGroup.current.visible = tools > 0.01;
    if (sunBall.current) {
      const a = ((t * 0.12) % 1) * Math.PI;
      sunBall.current.position.set(Math.cos(a) * 46, Math.sin(a) * 36 + 2, -6 - Math.sin(a) * 18);
    }
    if (dims.current) dims.current.visible = tools > 0.01;

    // Streets appear with the construction site
    const st = ramp(s, T.roads.in);
    if (streets.current) {
      streets.current.visible = st > 0.01;
      streets.current.position.y = -0.3 + st * 0.3;
    }
  });

  return (
    <group>
      <group ref={ctxWire} visible={false}>
        <lineSegments geometry={geo.ctxEdges} material={M.ctxLine} />
        {geo.ctxBoxes.map((b, i) => (
          <mesh key={i} position={b.p} geometry={b.geo} material={M.ctxFill} />
        ))}
      </group>
      <group ref={ctxSolid} visible={false}>
        {geo.ctxBoxes.map((b, i) => (
          <mesh key={i} position={b.p} geometry={b.geo} material={M.ctxSolid} castShadow receiveShadow />
        ))}
      </group>

      {/* Section plane sweeping through the model */}
      <group ref={section} visible={false}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.75, 0, -0.5]} material={M.section}>
          <planeGeometry args={[52, 34]} />
        </mesh>
        <lineSegments geometry={geo.sectionEdges} material={M.sectionEdge} position={[0.75, 0, -0.5]} />
      </group>

      {/* Sun-path study */}
      <group ref={sunGroup} visible={false}>
        <primitive object={sunLine} />
        <mesh ref={sunBall} material={M.sun}>
          <sphereGeometry args={[1.1, 20, 12]} />
        </mesh>
      </group>

      {/* Height dimension + level ticks */}
      <group ref={dims} visible={false}>
        <lineSegments geometry={geo.dimGeo} material={M.dim} />
      </group>

      {/* Streets */}
      <group ref={streets} visible={false}>
        <BoxInstances items={geo.asphalt} material={M.asphalt} castShadow={false} />
        <BoxInstances items={geo.kerbs} material={M.kerb} castShadow={false} />
        <BoxInstances items={geo.lanes} material={M.lane} castShadow={false} receiveShadow={false} />
      </group>
    </group>
  );
}
