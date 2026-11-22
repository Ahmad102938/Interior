"use client";

/*
 * R3F renders by mutating three.js objects (camera, scene, lights, materials)
 * inside useFrame/effects — outside React's render. The React Compiler
 * immutability rules don't model this, so they are disabled for this file only.
 */
/* eslint-disable react-hooks/immutability */
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Fog,
  LineBasicMaterial,
  MeshStandardMaterial,
  Vector3,
  type DirectionalLight,
  type HemisphereLight,
  type Material,
  type Mesh,
  type Object3D,
  type PerspectiveCamera,
  type Texture,
} from "three";
import { POINTER_PARALLAX, STORY_PANELS, qualitySettings, type Layout, type Quality } from "@/config/experience";
import { createAtmosphereSample, sampleAtmosphere, sampleCamera } from "@/lib/animation/camera";
import { sceneProgress, type ProgressController } from "@/lib/animation/scroll";
import { disposeMaterials } from "./models/materials";
import { BuildingSite } from "./site/BuildingSite";
import { Landscape } from "./site/Landscape";
import { Backdrop } from "./site/Backdrop";
import { DesignLayer } from "./site/DesignLayer";
import { ExplodedFloors } from "./site/ExplodedFloors";
import { ConstructionSite } from "./site/ConstructionSite";
import { InteriorHall } from "./site/InteriorHall";
import { VerticalTraces } from "./site/VerticalTraces";

const SUN_POS = new Vector3(-40, 70, 50);

// Ground: a dark design canvas that becomes a site, then a finished plaza.
const CANVAS = new Color("#0c1828");
const SITE = new Color("#4a443b");
const PLAZA = new Color("#23262b");

/** Faint drafting grid on the canvas (1 m minor, 4 m major). */
function useCanvasGrid() {
  return useMemo(() => {
    const pts: number[] = [];
    const cols: number[] = [];
    const ext = 80;
    for (let i = -ext; i <= ext; i++) {
      const major = i % 6 === 0;
      const c = major ? [0.22, 0.31, 0.44] : [0.13, 0.19, 0.28];
      pts.push(i, 0.005, -ext, i, 0.005, ext, -ext, 0.005, i, ext, 0.005, i);
      cols.push(...c, ...c, ...c, ...c);
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pts, 3));
    g.setAttribute("color", new Float32BufferAttribute(cols, 3));
    return g;
  }, []);
}

/** Story positions rendered (hidden) during warm-up — every 5% of the journey. */
const WARM_STOPS = Array.from({ length: 21 }, (_, i) => i / 20);

/**
 * Hidden warm-up before the canvas is revealed. Without it, three.js builds
 * each shader program the first time its object appears — a visible hitch
 * mid-scroll.
 *
 * 1. Every object is made visible for one `compileAsync` pass, so all programs
 *    (including those of objects off-camera or hidden until later stages) are
 *    built in a single sweep; where KHR_parallel_shader_compile exists the
 *    driver compiles them off the main thread.
 * 2. The scene then silently renders the whole story, one stop per frame, so
 *    texture uploads, shadow programs, reflection targets and post effects are
 *    created up front too. Programs are cached by now, so these are ordinary
 *    frames rather than long compile tasks. The HTML story is untouched.
 */
function Warmup({ progress, onReady }: { progress: React.RefObject<ProgressController>; onReady: () => void }) {
  const step = useRef(-2);
  useFrame(({ gl, scene, camera }) => {
    const i = step.current;
    if (i === -2) {
      step.current = -3; // waiting on the compile
      const hidden: Object3D[] = [];
      scene.traverse((o) => {
        const mat = (o as Mesh).material as Material | Material[] | undefined;
        for (const m of Array.isArray(mat) ? mat : mat ? [mat] : []) {
          for (const v of Object.values(m)) if (v && (v as Texture).isTexture) gl.initTexture(v as Texture);
        }
        if (!o.visible) {
          hidden.push(o);
          o.visible = true;
        }
      });
      // The traversal is synchronous; visibility is restored before anything renders.
      const compiled = gl.compileAsync(scene, camera);
      hidden.forEach((o) => (o.visible = false));
      const start = () => {
        if (step.current === -3) step.current = -1;
      };
      compiled.then(start, start);
      setTimeout(start, 4000); // never hold the reveal on a driver that stalls
      return;
    }
    if (i === -3) return;
    if (i + 1 < WARM_STOPS.length) {
      progress.current.override = WARM_STOPS[i + 1];
      step.current = i + 1;
    } else if (i + 1 === WARM_STOPS.length) {
      progress.current.override = null;
      step.current = i + 1;
      requestAnimationFrame(() => requestAnimationFrame(onReady));
    }
  }, -1);
  return null;
}

export function ExperienceScene({
  progress: progressRef,
  quality,
  layout,
  onReady,
}: {
  progress: React.RefObject<ProgressController>;
  quality: Quality;
  layout: Layout;
  onReady: () => void;
}) {
  const { scene, gl, size } = useThree();
  const camera = useThree((s) => s.camera) as PerspectiveCamera;
  const settings = qualitySettings[quality];

  // The site is built one group per frame (as a transition), so creating the
  // scene never lands as one long main-thread task. The canvas stays hidden
  // until the warm-up after the last group, so this is invisible.
  const groups = [
    <Backdrop key="backdrop" progress={progressRef} />,
    <DesignLayer key="design" progress={progressRef} />,
    <BuildingSite key="building" progress={progressRef} />,
    <ExplodedFloors key="floors" progress={progressRef} />,
    <ConstructionSite key="site" progress={progressRef} />,
    <InteriorHall key="interior" progress={progressRef} />,
    <VerticalTraces key="traces" progress={progressRef} />,
    <Landscape key="landscape" progress={progressRef} reflections={quality === "high"} />,
  ];
  const [mounted, setMounted] = useState(0);
  useEffect(() => {
    if (mounted >= groups.length) return;
    const id = requestAnimationFrame(() => startTransition(() => setMounted((n) => n + 1)));
    return () => cancelAnimationFrame(id);
  }, [mounted, groups.length]);

  const sun = useRef<DirectionalLight>(null);
  const hemi = useRef<HemisphereLight>(null);

  const grid = useCanvasGrid();
  const gridMat = useMemo(() => new LineBasicMaterial({ vertexColors: true, transparent: true, opacity: 1, depthWrite: false }), []);
  const groundMat = useMemo(() => new MeshStandardMaterial({ color: CANVAS.clone(), roughness: 1, metalness: 0 }), []);

  const scratch = useMemo(() => ({ pos: new Vector3(), target: new Vector3(), px: 0, py: 0, atmos: createAtmosphereSample() }), []);

  useEffect(() => {
    scene.fog = new Fog("#0b1626", 140, 360);
    return () => {
      scene.fog = null;
      grid.dispose();
      gridMat.dispose();
      groundMat.dispose();
      disposeMaterials();
    };
  }, [scene, grid, gridMat, groundMat]);

  // Wider lens on tall/narrow viewports so the site stays in frame.
  useEffect(() => {
    const aspect = size.width / size.height;
    camera.fov = aspect < 0.7 ? 56 : aspect < 1.1 ? 50 : 38;
    camera.updateProjectionMatrix();
  }, [camera, size.width, size.height]);

  useFrame((_, dt) => {
    const progress = progressRef.current;
    const p = sceneProgress(progress);
    const s = p * (STORY_PANELS - 1);

    // Camera — shared path + damped pointer parallax.
    sampleCamera(p, scratch.pos, scratch.target, layout);
    const k = 1 - Math.exp(-3 * Math.min(dt, 0.1));
    scratch.px += (progress.pointer.x - scratch.px) * k;
    scratch.py += (progress.pointer.y - scratch.py) * k;
    camera.position.set(scratch.pos.x + scratch.px * POINTER_PARALLAX.x, scratch.pos.y + scratch.py * POINTER_PARALLAX.y, scratch.pos.z);
    camera.lookAt(scratch.target);

    // Atmosphere.
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
      sun.current.color.copy(a.sun);
      sun.current.intensity = a.sunIntensity;
    }

    // Ground: canvas → site → plaza; drafting grid fades as construction starts.
    const toSite = Math.min(1, Math.max(0, (s - 2.1) / 0.6));
    const toPlaza = Math.min(1, Math.max(0, (s - 3.3) / 0.5));
    groundMat.color.copy(CANVAS).lerp(SITE, toSite).lerp(PLAZA, toPlaza);
    gridMat.opacity = 1 - toSite;
  });

  return (
    <>
      <hemisphereLight ref={hemi} args={["#3b5272", "#0d1520", 0.35]} />
      <directionalLight
        ref={sun}
        position={SUN_POS}
        castShadow
        intensity={1}
        shadow-mapSize={[settings.shadowMap, settings.shadowMap]}
        shadow-camera-left={-55}
        shadow-camera-right={55}
        shadow-camera-top={55}
        shadow-camera-bottom={-55}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0004}
        shadow-normalBias={0.03}
      />
      {/* Subtle warm rim — the antique-gold highlight */}
      <directionalLight position={[24, 12, -30]} intensity={0.5} color="#c9a46e" />

      <Environment resolution={settings.envResolution} frames={1}>
        <Lightformer form="rect" intensity={2.2} color="#dfe6ef" position={[0, 12, 10]} scale={[30, 6, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#c9a46e" position={[-20, 4, -10]} rotation-y={Math.PI / 3} scale={[20, 3, 1]} />
        <Lightformer form="rect" intensity={0.8} color="#9fb3cc" position={[20, 6, -5]} rotation-y={-Math.PI / 3} scale={[20, 4, 1]} />
        <Lightformer form="ring" intensity={1.5} color="#ffffff" position={[0, 20, 0]} rotation-x={Math.PI / 2} scale={8} />
      </Environment>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow material={groundMat}>
        <planeGeometry args={[700, 700]} />
      </mesh>
      <lineSegments geometry={grid} material={gridMat} />

      {groups.slice(0, mounted)}
      {mounted === groups.length && <Warmup progress={progressRef} onReady={onReady} />}
    </>
  );
}
