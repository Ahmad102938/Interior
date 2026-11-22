"use client";

import { Component, memo, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import {
  PORTRAIT_QUERY,
  SCROLL_LENGTH_VH,
  SCROLL_LENGTH_VH_PORTRAIT,
  STORY_PANELS,
  atmospheres,
  type Layout,
  type Quality,
} from "@/config/experience";
import { createProgressController, dampProgress, type ProgressController } from "@/lib/animation/scroll";
import { activePanel, clamp01, heldStoryPosition, storyPosition } from "@/lib/animation/transitions";
import { cn } from "@/lib/utils";
import { ChapterRail, ChapterRailVertical, StoryTrack } from "./StoryTrack";
import { ExperienceFallback, posterFor } from "./ExperienceFallback";
import { tagsAt as siteTags } from "./site/building";
import { Callout } from "./Callout";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ExperienceCanvas = dynamic(() => import("./ExperienceCanvas"), { ssr: false });

type Mode = "pending" | "cinematic" | "static";

function detectMode(): Mode {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return "static";
  // Respect Data Saver on metered connections.
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  if (conn?.saveData) return "static";
  // Entry-level phones (≤2 GB RAM or ≤2 cores) get the designed static story
  // instead of a scene they would struggle to run smoothly.
  const nav = navigator as Navigator & { deviceMemory?: number };
  if ((nav.deviceMemory ?? 8) <= 2 || (nav.hardwareConcurrency ?? 8) <= 2) return "static";
  try {
    const c = document.createElement("canvas");
    if (!(c.getContext("webgl2") || c.getContext("webgl"))) return "static";
  } catch {
    return "static";
  }
  return "cinematic";
}

function detectQuality(layout: Layout): Quality {
  if (layout === "portrait") return "low";
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

/** Model callouts; memoised so chapter changes don't re-mount their refs. */
const CalloutLayer = memo(function CalloutLayer({ ctrl }: { ctrl: React.RefObject<ProgressController> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {siteTags.map((t, i) => (
        <Callout
          key={t.label}
          label={t.label}
          detail={t.detail}
          side={t.side}
          reach={t.reach}
          elRef={(el) => {
            ctrl.current.tags[i] = el;
          }}
        />
      ))}
    </div>
  );
});

const hexToRgb = (hex: string) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
const atmosRgb = atmospheres.map((a) => hexToRgb(a.background));

/**
 * SIGNATURE HERO — one pinned, scroll-driven 3D journey through the four
 * business environments. A single master progress value (ScrollTrigger →
 * damped ticker) drives the camera, the scene mood, the story track, the
 * rail and the active chapter, so nothing can drift out of sync.
 *
 * Landscape: copy slides horizontally, rail along the bottom.
 * Portrait (phones): same world on a portrait camera path, copy slides
 * vertically beneath the subject, rail on the right edge.
 */
export function CinematicExperience() {
  const [mode, setMode] = useState<Mode>("pending");
  const [quality, setQuality] = useState<Quality>("medium");
  const [layout, setLayout] = useState<Layout>("landscape");
  const [active, setActive] = useState(0);
  const [inView, setInView] = useState(true);
  const [ready, setReady] = useState(false);
  // The WebGL scene starts once the page has loaded and the main thread is
  // idle, so it never competes with first paint or hydration. The blueprint
  // stand-in covers the wait.
  const [boot, setBoot] = useState(false);

  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  const ctrl = useRef(createProgressController());
  const activeRef = useRef(0);

  useEffect(() => {
    const update = () => {
      const l: Layout = window.matchMedia(PORTRAIT_QUERY).matches ? "portrait" : "landscape";
      setLayout(l);
      setMode(detectMode());
      setQuality(detectQuality(l));
    };
    update();
    const queries = [PORTRAIT_QUERY, "(prefers-reduced-motion: reduce)"].map((q) => window.matchMedia(q));
    queries.forEach((q) => q.addEventListener("change", update));
    return () => queries.forEach((q) => q.removeEventListener("change", update));
  }, []);

  const pinned = mode === "cinematic" || mode === "pending";

  useEffect(() => {
    if (mode !== "cinematic") return;
    let idle = 0;
    let timer = 0;
    const start = () => {
      const ric = window.requestIdleCallback;
      if (ric) idle = ric(() => setBoot(true), { timeout: 1200 });
      else timer = window.setTimeout(() => setBoot(true), 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle) window.cancelIdleCallback(idle);
      clearTimeout(timer);
    };
  }, [mode]);

  // Master progress: scroll → target; ticker → damped value → every consumer.
  useGSAP(
    () => {
      if (!pinned || !section.current) return;
      const c = ctrl.current;
      const portrait = layout === "portrait";

      const apply = () => {
        const p = c.value;
        const held = heldStoryPosition(p);
        if (track.current) {
          track.current.style.transform = portrait
            ? `translate3d(0,${(-held * 100) / STORY_PANELS}%,0)` // % of the (5×) track height = one panel per step
            : `translate3d(${-held * 100}vw,0,0)`;
        }
        panels.current.forEach((el, i) => {
          if (!el) return;
          const d = held - i;
          const o = clamp01(1 - Math.abs(d) * 2.2);
          el.style.opacity = String(o);
          // Layered parallax: copy travels slightly faster than its panel.
          el.style.transform = portrait ? `translate3d(0,${-d * 9}svh,0)` : `translate3d(${-d * 10}vw,${Math.abs(d) * 1.5}rem,0)`;
          el.style.visibility = o < 0.01 ? "hidden" : "visible";
        });
        stage.current?.style.setProperty("--rail-progress", String(clamp01((storyPosition(p) - 0.5) / (STORY_PANELS - 1.5))));
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
    // revertOnUpdate: kill the previous ScrollTrigger + ticker when the layout flips.
    { dependencies: [pinned, layout], revertOnUpdate: true },
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
  const onReady = useCallback(() => {
    ctrl.current.revealed = true;
    setReady(true);
  }, []);

  return (
    <>
      {/* Reduced motion / Data Saver / no WebGL */}
      {mode === "static" && <ExperienceFallback />}

      {pinned && (
        <section
          ref={section}
          id="experience"
          aria-label="From blueprint to building"
          data-nav-theme="overlay"
          className="relative h-(--len-portrait) md:h-(--len-landscape)"
          style={{
            ["--len-portrait" as string]: `calc(100svh + ${SCROLL_LENGTH_VH_PORTRAIT}vh)`,
            ["--len-landscape" as string]: `calc(100svh + ${SCROLL_LENGTH_VH}vh)`,
          }}
        >
          <div
            ref={stage}
            className="sticky top-0 h-svh overflow-hidden bg-navy-deep"
            style={{ ["--scene-rgb" as string]: "13 26 44" }}
          >
            {/* Stand-in until the first lit frame — never an empty canvas. It matches
                where the visitor is: at the top, the empty design canvas the blueprint
                then draws itself onto; mid-story (e.g. a reload), that stage's still. */}
            <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-0" : "opacity-100")}>
              {active === 0 ? (
                <div
                  aria-hidden
                  className="absolute inset-0 bg-[#0b1626]"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(84,108,140,0.16) 1px, transparent 1px), linear-gradient(90deg, rgba(84,108,140,0.16) 1px, transparent 1px)",
                    backgroundSize: "26px 26px",
                  }}
                />
              ) : (
                <Image src={posterFor(active)} alt="" fill sizes="100vw" className="object-cover object-[66%_50%] md:object-center" />
              )}
            </div>
            {mode === "cinematic" && boot && (
              <div className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}>
                <CanvasBoundary onError={onCanvasError}>
                  <ExperienceCanvas progress={ctrl} quality={quality} layout={layout} active={inView} onReady={onReady} onContextLost={onCanvasError} />
                </CanvasBoundary>
              </div>
            )}

            {/* Readability gradients tinted by the current environment */}
            {/* Plan-stage annotation chips — positioned by the 3D scene each frame */}
            {mode === "cinematic" && layout === "landscape" && <CalloutLayer ctrl={ctrl} />}

            {/* Landscape: copy on the left */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 hidden md:block"
              style={{
                background:
                  "linear-gradient(90deg, rgb(var(--scene-rgb) / 0.92) 0%, rgb(var(--scene-rgb) / 0.62) 32%, rgb(var(--scene-rgb) / 0) 62%)",
              }}
            />
            {/* Portrait: copy at the bottom, subject above */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 md:hidden"
              style={{
                background:
                  "linear-gradient(0deg, rgb(var(--scene-rgb) / 0.97) 0%, rgb(var(--scene-rgb) / 0.86) 30%, rgb(var(--scene-rgb) / 0.4) 50%, rgb(var(--scene-rgb) / 0) 64%)",
              }}
            />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-linear-to-b from-black/45 to-transparent" />
            <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-48 bg-linear-to-t from-black/55 to-transparent md:block" />

            <StoryTrack trackRef={track} panelRefs={panels} active={active} />
            <ChapterRail active={active} onSelect={goTo} />
            <ChapterRailVertical active={active} onSelect={goTo} />

            <div
              aria-hidden
              className={cn(
                "absolute right-6 bottom-[calc(7rem+var(--safe-bottom))] hidden items-center gap-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/55 transition-opacity duration-700 md:flex lg:right-14",
                active === 0 ? "opacity-100" : "opacity-0",
              )}
            >
              Scroll to explore
              <span className="relative block h-10 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-gold-pale" />
              </span>
            </div>
            {/* Portrait scroll cue: vertical, tucked in the right gutter under the rail */}
            <div
              aria-hidden
              className={cn(
                "absolute right-[1.375rem] bottom-[calc(2.75rem+var(--safe-bottom))] flex flex-col items-center gap-3 transition-opacity duration-700 md:hidden",
                active === 0 ? "opacity-100" : "opacity-0",
              )}
            >
              <span className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-white/55 [writing-mode:vertical-rl]">Scroll</span>
              <span className="relative block h-10 w-px overflow-hidden bg-white/20">
                <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollcue_2s_ease-in-out_infinite] bg-gold-pale" />
              </span>
            </div>
            {!ready && mode === "cinematic" && (
              <p role="status" className="absolute top-24 right-5 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-white/50 md:top-28 md:right-6 lg:right-14">
                Preparing the drawing…
              </p>
            )}
          </div>
        </section>
      )}
    </>
  );
}
