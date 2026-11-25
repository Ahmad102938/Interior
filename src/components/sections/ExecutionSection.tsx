"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { executionStages } from "@/content/capabilities";
import { cn } from "@/lib/utils";
import { homePage } from "@/content/pages/home";

const copy = homePage.execution;

const N = executionStages.length;
/** Pinned scroll distance per stage (svh). Kept short — one gesture moves one stage. */
const STAGE_SVH = 40;
/** Duration of the eased scroll between two stages. */
const STEP_MS = 520;
/** Wheel distance (px) that advances one stage. Continuous scrolling keeps advancing. */
const WHEEL_STEP_PX = 60;
const SWIPE_PX = 36;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * Five-stage execution framework as a pinned, full-viewport chapter.
 * While pinned, every ~60px of wheel travel (or one swipe) advances one stage
 * with a short eased scroll; continuous scrolling runs straight through;
 * at 01 and 05 the page scrolls on normally. The gold line follows scroll
 * position continuously; stage panels are stacked in one grid cell and
 * cross-fade, so nothing reflows. Steps are also clickable.
 */
export function ExecutionSection() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);
  const fillVRef = useRef<HTMLSpanElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const activeRef = useRef(0);
  const animating = useRef(false);
  const goToRef = useRef<(i: number) => void>(() => {});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const travel = () => el.offsetHeight - window.innerHeight;
    const stageTop = (i: number) => el.getBoundingClientRect().top + window.scrollY + (i / (N - 1)) * travel();
    const pinned = () => {
      const y = -el.getBoundingClientRect().top;
      return y >= -4 && y <= travel() + 4;
    };
    const select = (i: number) => {
      if (i === activeRef.current) return;
      activeRef.current = i;
      setActive(i);
    };

    // Line fill follows the real scroll position every frame.
    let raf = 0;
    const update = () => {
      raf = 0;
      const t = travel();
      const fill = t > 0 ? clamp01(-el.getBoundingClientRect().top / t) : 0;
      if (fillRef.current) fillRef.current.style.transform = `scaleX(${fill})`;
      // Vertical line: rows differ in height, so interpolate between the real circle centres.
      const dots = dotRefs.current;
      if (fillVRef.current && dots[0] && dots[N - 1]) {
        const listTop = fillVRef.current.parentElement!.getBoundingClientRect().top;
        const c = dots.map((d) => {
          const r = d!.getBoundingClientRect();
          return r.top + r.height / 2 - listTop;
        });
        const pos = fill * (N - 1);
        const k = Math.min(N - 2, Math.floor(pos));
        const y = c[k] + (c[k + 1] - c[k]) * (pos - k);
        fillVRef.current.parentElement!.style.setProperty("--rail-h", `${c[N - 1] - c[0]}px`);
        fillVRef.current.style.transform = `scaleY(${(y - c[0]) / (c[N - 1] - c[0] || 1)})`;
      }
      if (!animating.current) select(Math.round(fill * (N - 1)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    // Eased scroll to a stage; the panel switches immediately so its transition runs alongside.
    let tween = 0;
    let wheelAcc = 0;
    const goTo = (i: number) => {
      const target = Math.max(0, Math.min(N - 1, i));
      select(target);
      const from = window.scrollY;
      const to = stageTop(target);
      cancelAnimationFrame(tween);
      if (reduce.matches || Math.abs(to - from) < 2) {
        window.scrollTo({ top: to, behavior: "instant" });
        return;
      }
      animating.current = true;
      const start = performance.now();
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / STEP_MS);
        window.scrollTo({ top: from + (to - from) * easeInOutCubic(k), behavior: "instant" });
        if (k < 1) tween = requestAnimationFrame(step);
        else {
          animating.current = false;
          wheelAcc = 0;
        }
      };
      tween = requestAnimationFrame(step);
    };
    goToRef.current = goTo;

    /** Next stage in this direction, or null when the gesture should leave the section. */
    const nextFor = (dir: number) => {
      const next = activeRef.current + dir;
      return next < 0 || next > N - 1 ? null : next;
    };

    const onWheel = (e: WheelEvent) => {
      if (!pinned() || Math.abs(e.deltaY) < 1) return;
      const dir = Math.sign(e.deltaY);
      const next = nextFor(dir);
      if (next === null && !animating.current) return; // 01 ↑ / 05 ↓ — let the page scroll on
      e.preventDefault();
      if (animating.current || next === null) return;
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (Math.sign(wheelAcc) !== dir) wheelAcc = 0;
      wheelAcc += delta;
      if (Math.abs(wheelAcc) >= WHEEL_STEP_PX) {
        wheelAcc = 0;
        goTo(next);
      }
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!pinned()) return;
      const dir = Math.sign(touchY - e.touches[0].clientY);
      if (animating.current || (dir && nextFor(dir) !== null)) e.preventDefault();
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!pinned() || animating.current) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) < SWIPE_PX) return;
      const next = nextFor(Math.sign(dy));
      if (next !== null) goTo(next);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(tween);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="execution"
      data-nav-theme="light"
      aria-label={copy.heading.eyebrow}
      className="relative bg-ivory"
      style={{ height: `calc(100svh + ${(N - 1) * STAGE_SVH}svh)` }}
    >
      <div className="sticky top-0 flex h-svh flex-col overflow-hidden pt-[4.5rem] pb-(--safe-bottom) lg:pt-20">
        <div className="container-page flex flex-1 flex-col justify-center gap-8 py-6 sm:gap-10 lg:gap-14 [@media(max-height:740px)]:gap-5 [@media(max-height:740px)]:py-4">
          {/* Heading */}
          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-8">
            <div>
              <p className="eyebrow flex items-center gap-3 text-gold-ink">
                <span className="tabular-nums">05</span>
                <span aria-hidden className="h-px w-10 bg-gold/60" />
                {copy.heading.eyebrow}
              </p>
              <h2 className="display mt-4 text-[2.25rem] text-navy [@media(max-height:740px)]:mt-3 [@media(max-height:740px)]:text-[2rem] sm:text-5xl lg:mt-5 lg:text-[3.5rem] xl:text-[4rem]">
                {copy.heading.title}
                <br />
                <em className="font-normal text-maroon">{copy.heading.accent}</em>
              </h2>
            </div>
            <p className="max-w-xl text-[0.9375rem] leading-relaxed text-slate max-sm:hidden lg:text-[1.0625rem]">
              {copy.heading.intro}
            </p>
          </div>

          {/* Phones: vertical timeline — every stage visible, the current one lit */}
          <ol className="relative sm:hidden">
            <span aria-hidden className="absolute top-5 left-5 w-px -translate-x-1/2 bg-navy/15" style={{ height: "var(--rail-h, 0px)" }} />
            <span
              ref={fillVRef}
              aria-hidden
              className="absolute top-5 left-5 h-(--rail-h,0px) w-px -translate-x-1/2 origin-top bg-gold will-change-transform"
              style={{ transform: "scaleY(0)" }}
            />
            {executionStages.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <li key={s.number} className="relative flex gap-4 pb-5 last:pb-0 [@media(max-height:740px)]:pb-3">
                  <button
                    ref={(el) => {
                      dotRefs.current[i] = el;
                    }}
                    type="button"
                    onClick={() => goToRef.current(i)}
                    aria-current={on ? "step" : undefined}
                    aria-label={`${copy.stageLabel} ${s.number}: ${s.title}`}
                    className={cn(
                      "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border font-display text-base transition-[background-color,border-color,color,transform] duration-400 ease-(--ease-premium)",
                      on
                        ? "scale-110 border-maroon bg-maroon text-white"
                        : done
                          ? "border-navy bg-navy text-gold-pale"
                          : "border-navy/20 bg-ivory text-navy/60",
                    )}
                  >
                    {s.number}
                  </button>
                  <div className={cn("pt-1.5 transition-opacity duration-500 ease-(--ease-premium)", on ? "opacity-100" : done ? "opacity-55" : "opacity-35")}>
                    <h3 className={cn("display text-[1.625rem] leading-tight transition-colors duration-500 [@media(max-height:740px)]:text-[1.375rem]", on ? "text-maroon" : "text-navy")}>{s.title}</h3>
                    <p className="mt-1 text-[0.8125rem] leading-snug text-slate">{s.copy}</p>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* Stage rail (tablet and up) */}
          <div className="relative grid grid-cols-5 max-sm:hidden">
            <span aria-hidden className="absolute top-5 right-[10%] left-[10%] h-px bg-navy/15 sm:top-7" />
            <span
              ref={fillRef}
              aria-hidden
              className="absolute top-5 left-[10%] h-px w-[80%] origin-left bg-gold will-change-transform sm:top-7"
              style={{ transform: "scaleX(0)" }}
            />
            {executionStages.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <button
                  key={s.number}
                  type="button"
                  onClick={() => goToRef.current(i)}
                  aria-current={on ? "step" : undefined}
                  className="group relative flex flex-col items-center text-center"
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-10 place-items-center rounded-full border font-display text-base transition-[background-color,border-color,color,transform] duration-400 ease-(--ease-premium) sm:size-14 sm:text-xl",
                      on
                        ? "scale-110 border-maroon bg-maroon text-white"
                        : done
                          ? "border-navy bg-navy text-gold-pale"
                          : "border-navy/20 bg-ivory text-navy/60 group-hover:border-navy/50",
                    )}
                  >
                    {s.number}
                  </span>
                  <span
                    className={cn(
                      "mt-3 text-[0.5625rem] font-bold uppercase tracking-[0.1em] transition-colors duration-500 sm:mt-5 sm:text-xs sm:tracking-[0.14em]",
                      on ? "text-maroon" : done ? "text-navy" : "text-navy/45",
                    )}
                  >
                    {s.title}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Stage panels — stacked in one cell; outgoing fades fast, incoming eases in */}
          <div className="grid max-sm:hidden" aria-live="polite">
            {executionStages.map((s, i) => {
              const on = i === active;
              return (
                <div
                  key={s.number}
                  aria-hidden={!on}
                  className={cn(
                    "col-start-1 row-start-1 grid items-center gap-4 border border-line bg-white p-6 ease-(--ease-premium) motion-reduce:transition-none sm:gap-8 sm:p-10 lg:grid-cols-[auto_1fr_auto] lg:gap-12 lg:p-12",
                    on
                      ? "translate-y-0 opacity-100 transition-[opacity,transform] delay-150 duration-500"
                      : cn("pointer-events-none opacity-0 transition-[opacity,transform] duration-200", i < active ? "-translate-y-3" : "translate-y-3"),
                  )}
                >
                  <p className="font-display text-6xl leading-none text-maroon sm:text-7xl lg:text-8xl">{s.number}</p>
                  <div>
                    <h3 className="display text-3xl text-navy sm:text-4xl">{s.title}</h3>
                    <p className="mt-2 max-w-2xl text-[0.9375rem] leading-relaxed text-slate sm:mt-3 sm:text-base">{s.copy}</p>
                  </div>
                  {copy.stageImages[s.number] ? (
                    <div className="relative aspect-[4/3] w-56 overflow-hidden max-lg:hidden xl:w-64 [@media(max-height:800px)]:w-44">
                      <Image
                        src={copy.stageImages[s.number].src}
                        alt={copy.stageImages[s.number].alt}
                        fill
                        sizes="256px"
                        className="object-cover"
                        style={{ objectPosition: copy.stageImages[s.number].position }}
                      />
                    </div>
                  ) : (
                    <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-slate max-lg:hidden">
                      {copy.stageLabel} {s.number} <span className="text-navy/30">/ 0{N}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <p
            aria-hidden
            className={cn(
              "flex items-center justify-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-slate transition-opacity duration-500 max-sm:[@media(max-height:740px)]:hidden",
              active === N - 1 ? "opacity-0" : "opacity-100",
            )}
          >
            <ArrowDown className="size-3.5 motion-safe:animate-bounce" />
            {copy.scrollHint}
          </p>
        </div>
      </div>
    </section>
  );
}
