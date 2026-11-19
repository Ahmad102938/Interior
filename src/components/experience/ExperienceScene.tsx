"use client";

/*
 * R3F renders by mutating three.js objects (camera, scene, lights, materials)
 * inside useFrame/effects — outside React's render. The React Compiler
 * immutability rules don't model this, so they are disabled for this file only.
 */
/* eslint-disable react-hooks/immutability */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  CatmullRomCurve3,
  Fog,
  TubeGeometry,
  Vector3,
  type DirectionalLight,
  type Group,
  type HemisphereLight,
  type Mesh,
  type PerspectiveCamera,
} from "three";
import { POINTER_PARALLAX, qualitySettings, zones, type Layout, type Quality } from "@/config/experience";
import { createAtmosphereSample, sampleAtmosphere, sampleCamera } from "@/lib/animation/camera";
import { storyPosition } from "@/lib/animation/transitions";
import type { ProgressController } from "@/lib/animation/scroll";
import { disposeMaterials, getMaterials } from "./models/materials";
import { TelecomScene } from "./scenes/TelecomScene";
import { SolarScene } from "./scenes/SolarScene";
import { CivilScene } from "./scenes/CivilScene";
import { InteriorScene } from "./scenes/InteriorScene";

const SUN_OFFSET = new Vector3(-38, 52, 34);

/** Golden technical pathway linking the four zones along the ground. */
const pathCurve = new CatmullRomCurve3(
  [
    [-26, 14], [0, 13], [36, 18], [78, 17], [118, 21], [158, 20], [200, 17], [231, 8], [231, -2],
  ].map(([x, z]) => new Vector3(x, 0.04, z)),
);

export function ExperienceScene({
  progress: progressRef,
  quality,
  layout,
}: {
  progress: React.RefObject<ProgressController>;
  quality: Quality;
  layout: Layout;
}) {
  const { scene, gl, size } = useThree();
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const settings = qualitySettings[quality];
  const m = getMaterials();

  const sun = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);
  const path = useRef<Mesh>(null);
  const zoneRefs = useRef<(Group | null)[]>([]);

  const scratch = useMemo(
    () => ({ pos: new Vector3(), target: new Vector3(), look: new Vector3(), px: 0, py: 0, atmos: createAtmosphereSample() }),
    [],
  );
  const pathGeometry = useMemo(() => new TubeGeometry(pathCurve, 400, 0.05, 6, false), []);

  useEffect(() => {
    scene.fog = new Fog("#0d1a2c", 40, 150);
    return () => {
      scene.fog = null;
      pathGeometry.dispose();
      disposeMaterials();
    };
  }, [scene, pathGeometry]);

  // Wider lens on tall/narrow viewports so the subjects stay in frame.
  useEffect(() => {
    const aspect = size.width / size.height;
    // Tall phone frames need a wider vertical lens; tablets in portrait sit between.
    camera.fov = aspect < 0.7 ? 58 : aspect < 1.1 ? 52 : 38;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((_, dt) => {
    const progress = progressRef.current;
    const p = progress.value;

    // Camera — sampled from the shared path, plus a damped pointer parallax.
    sampleCamera(p, scratch.pos, scratch.target, layout);
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.1));
    scratch.px += (progress.pointer.x - scratch.px) * k;
    scratch.py += (progress.pointer.y - scratch.py) * k;
    camera.position.set(scratch.pos.x + scratch.px * POINTER_PARALLAX.x, scratch.pos.y + scratch.py * POINTER_PARALLAX.y, scratch.pos.z);
    camera.lookAt(scratch.target);

    // Atmosphere — background, fog, sun, sky.
    const a = sampleAtmosphere(p, scratch.atmos);
    if (scene.background && "isColor" in scene.background) scene.background.copy(a.background);
    else scene.background = a.background.clone();
    const fog = scene.fog as Fog | null;
    if (fog) {
      fog.color.copy(a.background);
      fog.near = a.fogNear;
      fog.far = a.fogFar;
    }
    gl.toneMappingExposure = a.exposure;
    if (hemi.current) {
      hemi.current.color.copy(a.sky);
      hemi.current.groundColor.copy(a.ground);
      hemi.current.intensity = a.hemiIntensity;
    }
    if (sun.current) {
      // The shadow frustum follows what the camera is looking at.
      sun.current.target.position.copy(scratch.target).setY(0);
      sun.current.position.copy(sun.current.target.position).add(SUN_OFFSET);
      sun.current.target.updateMatrixWorld();
      sun.current.color.copy(a.sun);
      sun.current.intensity = a.sunIntensity;
    }
    m.goldGuide.emissive.copy(a.accent);

    // Gold pathway reveals with the journey.
    if (path.current) {
      const idx = pathGeometry.index!;
      const per = 6 * 6; // indices per tubular segment (radialSegments * 6)
      const count = Math.floor((0.08 + p * 0.92) * (idx.count / per)) * per;
      pathGeometry.setDrawRange(0, count);
    }

    // Cull environments far from the current chapter.
    const s = storyPosition(p);
    zoneRefs.current.forEach((g, i) => {
      if (g) g.visible = Math.abs(s - Math.max(1, i + 1)) < 1.75 || (i === 0 && s < 1);
    });
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#5b7394", "#1a1f26", 0.55]} />
      <directionalLight
        ref={sun}
        castShadow
        intensity={2}
        shadow-mapSize={[settings.shadowMap, settings.shadowMap]}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-camera-near={1}
        shadow-camera-far={160}
        shadow-bias={-0.0004}
        shadow-normalBias={0.04}
      />
      {/* Subtle warm rim from behind — the antique-gold highlight. */}
      <directionalLight position={[60, 18, -80]} intensity={0.55} color="#c9a46e" />

      <Environment resolution={settings.envResolution} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#dfe6ef" position={[0, 12, 10]} scale={[30, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#c9a46e" position={[-20, 4, -10]} rotation-y={Math.PI / 3} scale={[20, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#9fb3cc" position={[20, 6, -5]} rotation-y={-Math.PI / 3} scale={[20, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 20, 0]} rotation-x={Math.PI / 2} scale={8} />
      </Environment>

      {/* Shared ground plane — one continuous world */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[110, 0, -20]} receiveShadow material={m.ground}>
        <planeGeometry args={[520, 180]} />
      </mesh>
      <mesh ref={path} geometry={pathGeometry} material={m.goldGuide} />

      <group ref={(g) => { zoneRefs.current[0] = g; }}>
        <TelecomScene position={zones.telecom} />
      </group>
      <group ref={(g) => { zoneRefs.current[1] = g; }}>
        <SolarScene position={zones.solar} rows={settings.solarRows} />
      </group>
      <group ref={(g) => { zoneRefs.current[2] = g; }}>
        <CivilScene position={zones.civil} />
      </group>
      <group ref={(g) => { zoneRefs.current[3] = g; }}>
        <InteriorScene position={zones.interiors} />
      </group>
    </>
  );
}
