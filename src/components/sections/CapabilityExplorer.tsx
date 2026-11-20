"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { capabilities } from "@/data/capabilities";
import { cn } from "@/lib/utils";

const phaseOf = (i: number) => (i < 3 ? "Pre-construction" : i < 5 ? "Field execution" : "Close-out");

/**
 * Six capabilities, one in focus. The index stays short (number + title);
 * the summary and scope of the selected capability open in a single panel —
 * inline on small screens, alongside on large ones.
 */
export function CapabilityExplorer() {
  const [active, setActive] = useState(0);
  const c = capabilities[active];

  return (
    <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
      <ol role="tablist" aria-label="Capabilities" aria-orientation="vertical" className="border-t border-white/10 lg:col-span-5">
        {capabilities.map((cap, i) => {
          const on = i === active;
          const newPhase = i === 0 || phaseOf(i) !== phaseOf(i - 1);
          return (
            <li key={cap.number}>
              {newPhase && <p className="eyebrow pt-6 pb-2 text-[0.625rem] text-gold-pale/60">{phaseOf(i)}</p>}
              <button
                type="button"
                role="tab"
                id={`cap-tab-${i}`}
                aria-selected={on}
                aria-controls="cap-panel"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                className="group relative flex w-full items-center gap-5 border-b border-white/10 py-4 text-left"
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute bottom-[-1px] left-0 h-px bg-gold transition-[width] duration-500 ease-(--ease-premium)",
                    on ? "w-full" : "w-0 group-hover:w-1/3",
                  )}
                />
                <span className={cn("font-display text-xl tabular-nums transition-colors duration-300", on ? "text-gold-pale" : "text-white/35")}>{cap.number}</span>
                <span className={cn("flex-1 text-[1.0625rem] font-medium transition-colors duration-300", on ? "text-white" : "text-white/60 group-hover:text-white/90")}>
                  {cap.title}
                </span>
                <span aria-hidden className={cn("size-1.5 rounded-full bg-gold transition-opacity duration-300", on ? "opacity-100" : "opacity-0")} />
              </button>
              {/* Inline detail on small screens */}
              {on && (
                <div className="animate-panel-in pt-4 pb-6 lg:hidden">
                  <Detail cap={cap} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div id="cap-panel" role="tabpanel" aria-labelledby={`cap-tab-${active}`} className="relative hidden lg:col-span-7 lg:block">
        <div className="relative flex h-full flex-col justify-center overflow-hidden border border-white/10 bg-navy-deep/60 p-10 xl:p-12">
          <span aria-hidden className="pointer-events-none absolute -top-8 -right-2 font-display text-[13rem] leading-none text-white/[0.04] select-none">
            {c.number}
          </span>
          <div key={c.number} className="animate-panel-in relative">
            <p className="eyebrow text-gold-pale/70">
              {phaseOf(active)} · {c.number} / {String(capabilities.length).padStart(2, "0")}
            </p>
            <h3 className="display mt-5 text-[2.5rem] leading-[1.05]">{c.title}</h3>
            <div className="mt-6">
              <Detail cap={c} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Detail({ cap }: { cap: (typeof capabilities)[number] }) {
  return (
    <>
      <p className="font-display text-xl text-gold-pale italic lg:text-2xl">{cap.summary}</p>
      <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
        {cap.items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm text-white/80">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold" />
            {it}
          </li>
        ))}
      </ul>
    </>
  );
}
