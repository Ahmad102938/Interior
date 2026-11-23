"use client";

import { useRef, useState } from "react";
import { Check } from "lucide-react";
import { capabilities } from "@/data/capabilities";
import { groupLabel } from "@/data/capabilityGroups";
import { cn } from "@/lib/utils";

const phaseOf = (i: number) => groupLabel(capabilities[i].group);
const total = String(capabilities.length).padStart(2, "0");

/**
 * Six capabilities, one in focus. Large screens: a short index (number +
 * title) beside one detail panel. Small screens: six numbered tabs over a
 * single card (tap or swipe), so the whole section fits one viewport.
 * Every detail is stacked in the same grid cell, so the panel is always as
 * tall as the longest one and switching never shifts the page.
 */
export function CapabilityExplorer() {
  const [active, setActive] = useState(0);
  const swipe = useRef<number | null>(null);
  const step = (d: number) => setActive((a) => (a + d + capabilities.length) % capabilities.length);

  return (
    <div className="grid gap-[clamp(1rem,2.5svh,1.5rem)] lg:grid-cols-12 lg:gap-16">
      {/* Large screens: the index */}
      <ol role="tablist" aria-label="Capabilities" aria-orientation="vertical" className="hidden border-t border-white/10 lg:col-span-5 lg:block">
        {capabilities.map((cap, i) => {
          const on = i === active;
          const newPhase = i === 0 || phaseOf(i) !== phaseOf(i - 1);
          return (
            <li key={cap.number}>
              {newPhase && <p className="eyebrow pt-[clamp(0.5rem,1.6svh,1rem)] pb-1 text-[0.625rem] text-gold-pale/60">{phaseOf(i)}</p>}
              <button
                type="button"
                role="tab"
                id={`cap-tab-${i}`}
                aria-selected={on}
                aria-controls="cap-panel"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative flex w-full items-center gap-5 border-b border-white/10 py-[clamp(0.45rem,1.3svh,0.85rem)] text-left"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-[-1px] left-0 h-px bg-gold transition-[width] duration-500 ease-(--ease-premium)",
                    on ? "w-full" : "w-0 group-hover:w-1/3",
                  )}
                />
                <span className={cn("font-display text-xl tabular-nums transition-colors duration-300", on ? "text-gold-pale" : "text-white/35")}>{cap.number}</span>
                <span className={cn("flex-1 text-base font-medium transition-colors duration-300", on ? "text-white" : "text-white/60 group-hover:text-white/90")}>
                  {cap.title}
                </span>
                <span aria-hidden className={cn("size-1.5 rounded-full bg-gold transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
              </button>
            </li>
          );
        })}
      </ol>

      {/* Small screens: numbered tabs */}
      <div role="tablist" aria-label="Capabilities" className="grid grid-cols-6 border-b border-white/10 lg:hidden">
        {capabilities.map((cap, i) => {
          const on = i === active;
          return (
            <button
              key={cap.number}
              type="button"
              role="tab"
              id={`cap-mtab-${i}`}
              aria-selected={on}
              aria-controls="cap-panel"
              onClick={() => setActive(i)}
              className="relative flex min-h-11 flex-col items-center justify-center pb-1"
            >
              <span className={cn("font-display text-xl tabular-nums transition-colors duration-300", on ? "text-gold-pale" : "text-white/40")}>{cap.number}</span>
              <span className="sr-only">{cap.title}</span>
              <span aria-hidden className={cn("absolute bottom-[-1px] h-px bg-gold transition-[width] duration-500 ease-(--ease-premium)", on ? "w-full" : "w-0")} />
            </button>
          );
        })}
      </div>

      <div
        id="cap-panel"
        role="tabpanel"
        aria-labelledby={`cap-tab-${active}`}
        className="relative overflow-hidden border border-white/10 bg-navy-deep/60 p-5 sm:p-8 lg:col-span-7 xl:p-10 [@media(max-height:700px)]:max-sm:p-4"
        onTouchStart={(e) => (swipe.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (swipe.current === null) return;
          const dx = e.changedTouches[0].clientX - swipe.current;
          swipe.current = null;
          if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
        }}
      >
        <span aria-hidden className="pointer-events-none absolute -top-6 -right-2 font-display text-[7rem] leading-none text-white/[0.04] select-none lg:text-[10rem]">
          {capabilities[active].number}
        </span>
        <div className="relative grid h-full items-center">
          {capabilities.map((c, i) => {
            const on = i === active;
            return (
              <div key={c.number} aria-hidden={!on} className={cn("[grid-area:1/1]", on ? "animate-panel-in" : "invisible")}>
                <p className="eyebrow text-[0.625rem] text-gold-pale/70 sm:text-xs">
                  {phaseOf(i)} · {c.number} / {total}
                </p>
                <h3 className="display mt-[clamp(0.5rem,1.6svh,1.25rem)] text-[1.75rem] leading-[1.05] [@media(max-height:700px)]:max-sm:text-[1.5rem] sm:text-[2rem] lg:text-[clamp(2rem,4.4svh,2.5rem)]">{c.title}</h3>
                <p className="mt-[clamp(0.5rem,1.6svh,1.25rem)] font-display text-lg text-gold-pale italic [@media(max-height:700px)]:max-sm:text-base [@media(max-height:700px)]:max-sm:leading-snug lg:text-[clamp(1.25rem,2.6svh,1.5rem)]">{c.summary}</p>
                <ul className="mt-[clamp(0.75rem,2svh,1.5rem)] grid gap-x-6 gap-y-[clamp(0.35rem,1svh,0.625rem)] sm:grid-cols-2">
                  {c.items.map((it) => (
                    <li key={it} className="flex items-start gap-2.5 text-sm text-white/80 [@media(max-height:700px)]:max-sm:text-[0.8125rem] [@media(max-height:700px)]:max-sm:leading-snug">
                      <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
                      {it}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
