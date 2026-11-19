"use client";

import { Component, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SCROLL_LENGTH_VH, STORY_PANELS, atmospheres, type Quality } from "@/config/experience";
import { createProgressController, dampProgress } from "@/lib/animation/scroll";
import { activePanel, clamp01, heldStoryPosition, storyPosition } from "@/lib/animation/transitions";
import { cn } from "@/lib/utils";
import { ChapterRail, StoryTrack } from "./StoryTrack";
import { ExperienceFallback, posterFor } from "./ExperienceFallback";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), { ssr: false });

type Mode = "pending" | "cinematic" | "static" | "mobile";

function detectMode(): Mode {
  if (!window.matchMedia("(min-width: 768px)").matches) return "mobile";
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return "static";
  } catch {
    return "static";
  }
  return "cinematic";
}

function detectQuality(): Quality {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const strong = window.innerWidth >= 1200 && (nav.hardwareConcurrency ?? 8) >= 6 && (nav.deviceMemory ?? 8) >= 4;
  return strong ? "high" : "medium";
}

/** Falls back to the static story if the WebGL scene throws. */
class CanvasBoundary extends Component<{ onError: () => void; children: React.ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const atmosRgb = atmospheres.map((a) => hexToRgb(a.background));

/**
 * SIGNATURE HERO — one pinned, scroll-driven 3D journey through the four
 * business environments. A single master progress value (ScrollTrigger →
 * damped ticker) drives the camera, the scene mood, the horizontal story
 * track, the rail and the active chapter, so nothing can drift out of sync.
 */
export function CinematicExperience() {
  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<Quality>("medium");
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const ctrl = useRef(createProgressController());
  const activeRef = useRef(0);

  useEffect(() => {
    const update = () => {
      setMode(detectMode());
      setQuality(detectQuality());
    };
    update();
    const queries = ["(min-width: 768px)", "(prefers-reduced-motion: reduce)"].map((q) => window.matchMedia(q));
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  const pinned = mode === "cinematic" || mode === "pending";

  // Master progress: scroll → target; ticker → damped value → every consumer.
  useGSAP(
    () => {
      if (!pinned || !section.current) return;
      const c = ctrl.current;

      const apply = () => {
        const p = c.value;
        const held = heldStoryPosition(p);
        if (track.current) track.current.style.transform = `translate3d(${-held * 100}vw,0,0)`;
        panels.current.forEach((el, i) => {
          if (!el) return;
          const d = held - i;
          const o = clamp01(1 - Math.abs(d) * 2.2);
          el.style.opacity = String(o);
          el.style.transform = `translate3d(${-d * 10}vw,${Math.abs(d) * 1.5}rem,0)`;
          el.style.visibility = o < 0.01 ? "hidden" : "visible";
        });
        if (bar.current) bar.current.style.transform = `scaleX(${clamp01((storyPosition(p) - 0.5) / (STORY_PANELS - 1.5))})`;
        // Background tint used by the readability gradients.
        const s = storyPosition(p);
        const i = Math.min(Math.floor(s), atmosRgb.length - 2);
        const f = s - i;
        const rgb = atmosRgb[i].map((v, k) => Math.round(v + (atmosRgb[i + 1][k] - v) * f));
        stage.current?.style.setProperty("--scene-rgb", rgb.join(" "));

        const a = activePanel(p);
        if (a !== activeRef.current) {
          activeRef.current = a;
          setActive(a);
        }
      };

      const st = ScrollTrigger.create({
        trigger: section.current,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          c.target = self.progress;
        },
        onRefresh: (self) => {
          c.target = self.progress;
        },
      });
      // Restore without sweeping through chapters when reloading mid-page.
      c.target = c.value = st.progress;
      apply();

      const tick = (_time: number, deltaMs: number) => {
        if (c.value === c.target) return;
        dampProgress(c, deltaMs / 1000);
        apply();
      };
      gsap.ticker.add(tick);
      return () => gsap.ticker.remove(tick);
    },
    { dependencies: [pinned] },
  );

  // Suspend WebGL rendering once the hero has scrolled away.
  useEffect(() => {
    if (!section.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(section.current);
    return () => io.disconnect();
  }, [mode]);

  useEffect(() => {
    if (mode !== "cinematic" || !window.matchMedia("(pointer: fine)").matches) return;
    const c = ctrl.current;
    const onMove = (e: PointerEvent) => {
      c.pointer.x = (e.clientX / window.innerWidth - 0.5) * 2;
      c.pointer.y = -(e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [mode]);

  const goTo = useCallback((panel: number) => {
    const el = section.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const length = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + (panel / (STORY_PANELS - 1)) * length, behavior: "smooth" });
  }, []);

  const onCanvasError = useCallback(() => setMode("static"), []);
  const onReady = useCallback(() => setReady(true), []);

  return (
    <>
      {/* Mobile and accessible fallback story */}
      <ExperienceFallback className={pinned ? "md:hidden" : undefined} />

      {pinned && (
        <section
          ref={section}
          id="experience"
          aria-label="ADIDEV — four business environments"
          data-nav-theme="overlay"
          className="relative hidden md:block"
          style={{ height: `calc(100svh + ${SCROLL_LENGTH_VH}vh)` }}
        >
          <div
            ref={stage}
            className="sticky top-0 h-svh overflow-hidden bg-navy-deep"
            style={{ ["--scene-rgb" as string]: "13 26 44" }}
          >
            {/* Poster until the first lit frame — never an empty canvas */}
            <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-0" : "opacity-100")}>
              <Image src={posterFor(0)} alt="" fill priority sizes="100vw" className="object-cover" />
            </div>
            {mode === "cinematic" && (
              <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
                <CanvasBoundary onError={onCanvasError}>
                  <ExperienceCanvas progress={ctrl} quality={quality} active={inView} onReady={onReady} />
                </CanvasBoundary>
              </div>
            )}

            {/* Readability gradients tinted by the current environment */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "linear-gradient(90deg, rgb(var(--scene-rgb) / 0.92) 0%, rgb(var(--scene-rgb) / 0.62) 32%, rgb(var(--scene-rgb) / 0) 62%)",
              }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-linear-to-t from-black/55 to-transparent" />

            <StoryTrack trackRef={track} panelRefs={panels} active={active} />
            <ChapterRail active={active} barRef={bar} onSelect={goTo} />

            <div
              aria-hidden
              className={cn(
                "absolute right-6 bottom-28 flex items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/55 transition-opacity duration-700 lg:right-14",
                active === 0 ? "opacity-100" : "opacity-0",
              )}
            >
              Scroll to explore
              <span className="relative block h-10 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-gold-pale" />
              </span>
            </div>
            {!ready && mode === "cinematic" && (
              <p role="status" className="absolute top-28 right-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50 lg:right-14">
                Loading 3D environment…
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}
