"use client";

import { useState } from "react";
import type { Callout } from "@/content/services";
import { cn } from "@/lib/utils";
import { formatCovers } from "./shared";

type Props = {
  callouts: Callout[];
  /** The drawing or photograph; markers are positioned over it by percentage. */
  children: React.ReactNode;
  /** Aspect ratio class that matches the artwork, so marker positions hold. */
  aspect: string;
  note: string;
  dark?: boolean;
};

/**
 * Numbered markers over a figure, paired with a legend. The legend entries are
 * the accessible controls; markers mirror them for pointer users. Hover, focus
 * or tap highlights the pair.
 */
export function CalloutFigure({ callouts, children, aspect, note, dark }: Props) {
  const [active, setActive] = useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-16">
      <figure className="lg:sticky lg:top-40">
        <div className={cn("relative w-full overflow-hidden", aspect)}>
          {children}
          {callouts.map((c, i) => (
            <button
              key={c.label}
              type="button"
              tabIndex={-1}
              aria-hidden
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${c.at[0]}%`, top: `${c.at[1]}%` }}
            >
              {active === i && <span className="absolute inset-0 animate-ping rounded-full bg-gold/50 motion-reduce:hidden" />}
              <span
                className={cn(
                  "relative grid size-5 place-items-center rounded-full border text-[0.5625rem] font-bold tabular-nums transition-all duration-300 sm:size-7 sm:text-[0.6875rem]",
                  active === i ? "scale-110 border-gold bg-gold text-navy-deep" : "border-gold/80 bg-navy-deep/85 text-gold-pale",
                )}
              >
                {i + 1}
              </span>
            </button>
          ))}
        </div>
        <figcaption className={cn("mt-3 text-[0.625rem] font-semibold uppercase tracking-[0.16em]", dark ? "text-white/50" : "text-slate")}>{note}</figcaption>
      </figure>

      <ol className={cn("border-t", dark ? "border-white/15" : "border-navy/15")}>
        {callouts.map((c, i) => (
          <li key={c.label} className={cn("border-b", dark ? "border-white/15" : "border-navy/15")}>
            <button
              type="button"
              aria-pressed={active === i}
              onClick={() => setActive(i)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group flex w-full gap-4 py-4 text-left"
            >
              <span
                className={cn(
                  "mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-[0.625rem] font-bold tabular-nums transition-colors",
                  active === i ? "border-gold bg-gold text-navy-deep" : dark ? "border-white/30 text-white/70" : "border-navy/25 text-navy/70",
                )}
              >
                {i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <span className={cn("text-[0.9375rem] font-semibold transition-colors", dark ? "text-white" : "text-navy", active !== i && "opacity-80")}>{c.label}</span>
                  <span className={cn("text-[0.625rem] font-semibold uppercase tracking-[0.14em] tabular-nums", dark ? "text-gold-pale" : "text-gold-ink")}>
                    {c.covers.length > 1 ? "Capabilities" : "Capability"} {formatCovers(c.covers)}
                  </span>
                </span>
                <span className={cn("mt-1 block text-sm leading-relaxed", dark ? "text-white/65" : "text-slate")}>{c.copy}</span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
