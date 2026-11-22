"use client";

import { storyChapters } from "@/data/story";
import { STORY_PANELS } from "@/config/experience";
import { cn } from "@/lib/utils";
import { ChapterPanel, IntroPanel } from "./StoryPanel";

type Props = {
  trackRef: React.Ref<HTMLDivElement>;
  panelRefs: React.RefObject<(HTMLDivElement | null)[]>;
  active: number;
};

/**
 * Story overlay. Landscape: panels in a row, the track slides horizontally.
 * Portrait (< 768px): panels stacked, the track slides vertically and copy
 * sits at the bottom of the frame beneath the 3D subject. Transforms and
 * opacity are written by the progress ticker — React only re-renders when
 * the active chapter changes (for aria-hidden / inert).
 */
export function StoryTrack({ trackRef, panelRefs, active }: Props) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={trackRef}
        className="flex h-(--track-h) w-full flex-col will-change-transform md:h-full md:w-(--track-w) md:flex-row"
        style={{ ["--track-h" as string]: `${STORY_PANELS * 100}%`, ["--track-w" as string]: `${STORY_PANELS * 100}vw` }}
      >
        {[null, ...storyChapters].map((c, i) => (
          <div
            key={c?.key ?? "intro"}
            className="relative flex h-(--panel-h) w-full shrink-0 items-end pb-[calc(2.5rem+var(--safe-bottom))] md:h-full md:w-screen md:items-center md:pb-0"
            style={{ ["--panel-h" as string]: `${100 / STORY_PANELS}%` }}
          >
            <div
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              aria-hidden={active !== i}
              inert={active !== i}
              className={cn("container-page w-full pr-12 will-change-[transform,opacity] md:pr-10 xl:pr-14", active === i && "pointer-events-auto")}
              style={i === 0 ? undefined : { opacity: 0 }}
            >
              {c ? <ChapterPanel chapter={c} final={i === storyChapters.length} /> : <IntroPanel />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Landscape rail: chapter labels along the bottom with a horizontal progress line. */
export function ChapterRail({ active, onSelect }: { active: number; onSelect: (panel: number) => void }) {
  return (
    <nav aria-label="Project stages" className="absolute inset-x-0 bottom-0 z-10 hidden md:block">
      <div className="container-page pb-[calc(1.5rem+var(--safe-bottom))] lg:pb-[calc(2rem+var(--safe-bottom))]">
        <div className="relative h-px bg-white/15">
          <div className="absolute inset-y-0 left-0 w-full origin-left bg-gold" style={{ transform: "scaleX(var(--rail-progress, 0))" }} />
        </div>
        <ol className="mt-4 grid gap-4" style={{ gridTemplateColumns: `repeat(${storyChapters.length}, minmax(0, 1fr))` }}>
          {storyChapters.map((c, i) => {
            const isActive = active === i + 1;
            return (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => onSelect(i + 1)}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "group flex min-h-11 w-full items-baseline gap-3 text-left transition-colors duration-500",
                    isActive ? "text-white" : "text-white/45 hover:text-white/80",
                  )}
                >
                  <span className={cn("font-display text-lg tabular-nums transition-colors", isActive ? "text-gold-pale" : "")}>{c.number}</span>
                  <span className="text-[0.75rem] font-semibold uppercase tracking-[0.14em]">{c.label}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}

/**
 * Portrait rail: a slim vertical progress line on the right edge with one
 * tappable marker per vertical. Only the active chapter's number is labelled,
 * so it never competes with the copy.
 */
export function ChapterRailVertical({ active, onSelect }: { active: number; onSelect: (panel: number) => void }) {
  return (
    <nav aria-label="Project stages" className="absolute top-[36%] right-2 z-10 -translate-y-1/2 md:hidden">
      <div className="relative flex flex-col items-center">
        <div aria-hidden className="absolute top-[22px] bottom-[22px] left-1/2 w-px -translate-x-1/2 bg-white/20">
          <div className="absolute inset-x-0 top-0 h-full origin-top bg-gold" style={{ transform: "scaleY(var(--rail-progress, 0))" }} />
        </div>
        <ol className="relative flex flex-col gap-3">
          {storyChapters.map((c, i) => {
            const isActive = active === i + 1;
            const done = active > i + 1;
            return (
              <li key={c.key}>
                <button
                  type="button"
                  onClick={() => onSelect(i + 1)}
                  aria-label={`${c.number} ${c.label}`}
                  aria-current={isActive ? "step" : undefined}
                  className="group relative grid size-11 place-items-center"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "block rounded-full transition-all duration-500 ease-(--ease-premium)",
                      isActive ? "size-3 bg-gold ring-4 ring-gold/25" : done ? "size-2 bg-gold-pale" : "size-2 bg-white/40",
                    )}
                  />
                  <span
                    aria-hidden
                    className={cn(
                      "absolute right-full mr-1 font-display text-sm tabular-nums text-gold-pale transition-opacity duration-500",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  >
                    {c.number}
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
