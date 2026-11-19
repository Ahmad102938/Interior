import Image from "next/image";
import { verticals } from "@/data/verticals";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { ChapterPanel, IntroPanel } from "./StoryPanel";

export const posterFor = (panel: number) => `/images/posters/chapter-${panel}.jpg`;

/**
 * Non-WebGL story: used on mobile, with prefers-reduced-motion, and when WebGL
 * is unavailable. Same content, rendered from stills of the 3D environments.
 * Chapters sit in a native scroll-snap row — swipeable, no scroll locking.
 */
export function ExperienceFallback({ className }: { className?: string }) {
  return (
    <section aria-label="ADIDEV — four business environments" data-nav-theme="dark" className={cn("bg-navy-deep", className)}>
      <div data-nav-theme="overlay" className="relative flex min-h-svh items-end overflow-hidden pt-28 pb-14 md:items-center">
        <Image src={posterFor(0)} alt="" fill priority sizes="100vw" className="object-cover object-[70%_50%]" />
        <div aria-hidden className="absolute inset-0 bg-linear-to-t from-navy-deep via-navy-deep/70 to-navy-deep/20 md:bg-linear-to-r md:from-navy-deep/95 md:via-navy-deep/70 md:to-transparent" />
        <div className="container-page relative">
          <IntroPanel />
        </div>
      </div>

      <div className="pb-16 md:pb-24">
        <div className="container-page flex items-end justify-between pb-6">
          <p className="eyebrow text-gold-pale">Four business verticals</p>
          <p className="text-xs text-white/50 md:hidden">Swipe →</p>
        </div>
        <ol className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 md:grid md:grid-cols-2 md:overflow-visible md:px-10 xl:grid-cols-4 xl:px-14 [scrollbar-width:none]">
          {verticals.map((v, i) => (
            <li key={v.key} className={cn("relative flex w-[86vw] shrink-0 snap-start flex-col md:w-auto", verticalClasses[v.key].bg)}>
              <div className="relative aspect-[4/3]">
                <Image src={posterFor(i + 1)} alt={`${v.title} — visualisation`} fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 86vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-6 [&_h3]:text-[2rem]!">
                <ChapterPanel vertical={v} headingLevel="h3" />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
