"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Milestone } from "@/data/history";
import { PendingBadge } from "@/components/ui/PendingBadge";

/** Horizontal, swipeable company timeline with keyboard-accessible controls. */
export function CompanyTimeline({ items }: { items: Milestone[] }) {
  const scroller = useRef<HTMLOListElement>(null);
  const scrollBy = (dir: number) => {
    const el = scroller.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.min(el.clientWidth * 0.8, 420), behavior: "smooth" });
  };
  return (
    <div className="border border-navy/10 bg-navy text-white">
      <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-4 lg:px-8">
        <p className="eyebrow text-gold-pale">Company journey</p>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous milestones" onClick={() => scrollBy(-1)} className="grid size-11 place-items-center border border-white/20 transition-colors hover:border-gold-pale hover:text-gold-pale">
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button type="button" aria-label="Next milestones" onClick={() => scrollBy(1)} className="grid size-11 place-items-center border border-white/20 transition-colors hover:border-gold-pale hover:text-gold-pale">
            <ArrowRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
      <ol
        ref={scroller}
        tabIndex={0}
        aria-label="Company milestones"
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] focus-visible:outline-offset-[-2px]"
      >
        {items.map((m, i) => (
          <li key={m.id} className="relative w-[78%] shrink-0 snap-start border-r border-white/10 px-6 pt-8 pb-8 sm:w-[45%] lg:w-[28%] lg:px-8">
            <div aria-hidden className="absolute top-0 left-0 h-px w-full bg-white/10">
              <span className="absolute top-1/2 left-6 size-2 -translate-y-1/2 rounded-full bg-gold lg:left-8" />
            </div>
            <p className="flex items-center gap-3 font-display text-3xl text-gold-pale">
              {m.period} <PendingBadge status={m.status} />
            </p>
            <h3 className="mt-3 text-base font-semibold text-white">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/65">{m.description}</p>
            <span className="sr-only">
              Milestone {i + 1} of {items.length}
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}
