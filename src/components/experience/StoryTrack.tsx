"use client";

import { verticals } from "@/data/verticals";
import { STORY_PANELS } from "@/config/experience";
import { cn } from "@/lib/utils";
import { ChapterPanel, IntroPanel } from "./StoryPanel";

type Props = {
  trackRef: React.Ref<HTMLDivElement>;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  active: number;
};

/**
 * Horizontal story overlay. Its transform and each panel's opacity are written
 * directly by the progress ticker — React only re-renders when the active
 * chapter changes (for aria-hidden / focusability).
 */
export function StoryTrack({ trackRef, panelRefs, active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div ref={trackRef} className="flex h-full will-change-transform" style={{ width: `${STORY_PANELS * 100}vw` }}>
        {[null, ...verticals].map((v, i) => (
          <div key={v?.key ?? "intro"} className="relative flex h-full w-screen shrink-0 items-center">
            <div
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              aria-hidden={active !== i}
              inert={active !== i}
              className={cn("container-page will-change-[transform,opacity]", active === i && "pointer-events-auto")}
              style={i === 0 ? undefined : { opacity: 0 }}
            >
              {v ? <ChapterPanel vertical={v} /> : <IntroPanel />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChapterRail({
  active,
  barRef,
  onSelect,
}: {
  active: number;
  barRef: React.Ref<HTMLDivElement>;
  onSelect: (panel: number) => void;
}) {
  return (
    <nav aria-label="Business verticals" className="absolute inset-x-0 bottom-0 z-10">
      <div className="container-page pb-6 lg:pb-8">
        <div className="relative h-px bg-white/15">
          <div ref={barRef} className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-gold" />
        </div>
        <ol className="mt-4 grid grid-cols-4 gap-4">
          {verticals.map((v, i) => {
            const isActive = active === i + 1;
            return (
              <li key={v.key}>
                <button
                  type="button"
                  onClick={() => onSelect(i + 1)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "group flex min-h-11 w-full items-baseline gap-3 text-left transition-colors duration-500",
                    isActive ? "text-white" : "text-white/45 hover:text-white/80",
                  )}
                >
                  <span className={cn("font-display text-lg tabular-nums transition-colors", isActive ? "text-gold-pale" : "")}>{v.number}</span>
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em]">
                    <span className="hidden lg:inline">{v.title}</span>
                    <span className="lg:hidden">{v.shortTitle}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
