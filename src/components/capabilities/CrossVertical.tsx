"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { VerticalKey } from "@/config/theme";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";

type Cap = { number: string; title: string };
type Division = { key: VerticalKey; number: string; title: string; href: string; emphasis: string[] };

/**
 * Six capabilities in the centre of the framework, four divisions around it.
 * Each division lists the capabilities its work typically leans on (the same
 * selection its service page shows); hovering or focusing a division lights
 * them in the framework. Not a matrix — scope is confirmed per project.
 */
export function CrossVertical({ caps, divisions }: { caps: Cap[]; divisions: Division[] }) {
  const [hot, setHot] = useState<VerticalKey | null>(null);
  const active = divisions.find((d) => d.key === hot);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-16">
      <div className="hidden lg:sticky lg:top-28 lg:block lg:self-start">
        <p className="eyebrow text-gold-ink">The framework</p>
        <ol className="mt-4 border-t border-navy/15">
          {caps.map((c) => {
            const on = !!active?.emphasis.includes(c.number);
            return (
              <li key={c.number} className={cn("relative flex items-center gap-4 border-b border-navy/15 py-3.5 pl-4 transition-colors duration-300", on && "bg-ivory")}>
                <span aria-hidden className={cn("absolute inset-y-0 left-0 w-1 origin-top transition-transform duration-300", active ? verticalClasses[active.key].bg : "", on ? "scale-y-100" : "scale-y-0")} />
                <span className="font-display text-lg text-gold-ink tabular-nums">{c.number}</span>
                <span className={cn("text-[0.9375rem] font-semibold transition-colors", active && !on ? "text-slate" : "text-navy")}>{c.title}</span>
              </li>
            );
          })}
        </ol>
        <p className="mt-4 hidden text-xs leading-relaxed text-slate lg:block" aria-live="polite">
          {active ? `Typical emphasis for ${active.title}. All six may apply, depending on the approved scope.` : "Point to a division to highlight the capabilities its work typically leans on."}
        </p>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2" onMouseLeave={() => setHot(null)}>
        {divisions.map((d) => {
          const c = verticalClasses[d.key];
          return (
            <li key={d.key}>
              <Link
                href={d.href}
                onMouseEnter={() => setHot(d.key)}
                onFocus={() => setHot(d.key)}
                onBlur={() => setHot(null)}
                className={cn("group relative flex h-full flex-col overflow-hidden p-6 text-white transition-transform duration-500 ease-(--ease-premium) motion-safe:hover:-translate-y-1 sm:p-8", c.bg)}
              >
                <span aria-hidden className="absolute top-0 left-0 h-0.5 w-12 bg-gold-pale transition-[width] duration-500 group-hover:w-full" />
                <span className="font-display text-lg text-gold-pale tabular-nums">{d.number}</span>
                <span className="display mt-2 text-[1.75rem] leading-tight">{d.title}</span>
                <span className="mt-5 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-white/75">Typical emphasis</span>
                <span className="mt-2 text-sm leading-relaxed text-white/80">
                  {d.emphasis.map((n) => caps.find((c) => c.number === n)?.title).join(" · ")}
                </span>
                <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold-pale group-hover:text-white">
                  View service
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
