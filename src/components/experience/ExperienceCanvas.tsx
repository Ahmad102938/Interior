"use client";

import { memo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
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
  /** GPU reset / context loss → caller falls back to the static story. */
  onContextLost: () => void;
};

/**
 * Memoised: chapter changes re-render the HTML story, never the R3F tree
 * (reconciling the whole scene in one frame caused a visible hitch).
 */
export default memo(function ExperienceCanvas({ progress, quality, layout, active, onReady, onContextLost }: Props) {
  const [dpr, setDpr] = useState(qualitySettings[quality].dpr[1]);

  return (
    <Canvas
      shadows="percentage"
      dpr={dpr}
      frameloop={active ? "always" : "never"}
      camera={{ fov: 38, near: 0.5, far: 1200, position: [-24, 105, 14] }}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      onCreated={({ gl }) => {
        gl.toneMapping = ACESFilmicToneMapping;
        gl.outputColorSpace = SRGBColorSpace;
        gl.domElement.addEventListener(
          "webglcontextlost",
          (e) => {
            e.preventDefault();
            onContextLost();
          },
          { once: true },
        );
      }}
      aria-hidden
    >
      <PerformanceMonitor
        onDecline={() => setDpr(qualitySettings[quality].dpr[0])}
      />
      <ExperienceScene progress={progress} quality={quality} layout={layout} onReady={onReady} />
      {/* Bloom gives the interior and soffit lighting its glow; phones skip it. */}
      {quality !== "low" && (
        <EffectComposer multisampling={0}>
          <Bloom mipmapBlur luminanceThreshold={0.85} luminanceSmoothing={0.25} intensity={0.75} radius={0.72} />
          <Vignette offset={0.32} darkness={0.5} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
});
