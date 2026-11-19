"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { qualitySettings, type Layout, type Quality } from "@/config/experience";
import type { ProgressController } from "@/lib/animation/scroll";
import { ExperienceScene } from "./ExperienceScene";

type Props = {
  progress: React.RefObject<ProgressController>;
  quality: Quality;
  layout: Layout;
  /** Whether the hero is on screen — rendering is suspended when it is not. */
  active: boolean;
  onReady: () => void;
};

export default function ExperienceCanvas({ progress, quality, layout, active, onReady }: Props) {
  const [dpr, setDpr] = useState(qualitySettings[quality].dpr[1]);

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, near: 0.1, far: 420, position: [-34, 7, 54] }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.outputColorSpace = SRGBColorSpace;
        // Wait two frames so the first visible frame is fully lit.
        requestAnimationFrame(() => requestAnimationFrame(onReady));
      }}
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => setDpr(qualitySettings[quality].dpr[0])}
      />
      <ExperienceScene progress={progress} quality={quality} layout={layout} />
    </Canvas>
  );
}
