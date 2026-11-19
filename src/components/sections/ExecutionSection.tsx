"use client";

import { useState } from "react";
import { executionStages } from "@/data/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Five-stage execution timeline: navy markers, gold connector, maroon active state. */
export function ExecutionSection() {
  const [active, setActive] = useState(0);
  const stage = executionStages[active];
  return (
    <section id="execution" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <SectionHeading
          index="05"
          eyebrow="Execution framework"
          title="From Requirements"
          accent="to Handover."
          intro="A clear five-stage process so every client understands how a project moves from brief to completion."
          align="split"
        />

        <div className="mt-14 lg:mt-20" data-reveal>
          <div role="tablist" aria-label="Execution stages" className="relative grid gap-3 sm:grid-cols-5 sm:gap-0">
            <span aria-hidden className="absolute top-7 right-[10%] left-[10%] hidden h-px bg-gold/60 sm:block" />
            <span
              aria-hidden
              className="absolute top-7 left-[10%] hidden h-px origin-left bg-maroon transition-transform duration-700 ease-(--ease-premium) sm:block"
              style={{ width: "80%", transform: `scaleX(${active / (executionStages.length - 1)})` }}
            />
            {executionStages.map((s, i) => {
              const on = i === active;
              const done = i < active;
              return (
                <button
                  key={s.number}
                  role="tab"
                  type="button"
                  id={`stage-tab-${i}`}
                  aria-selected={on}
                  aria-controls="stage-panel"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="group relative flex items-center gap-4 border border-line bg-white p-4 text-left sm:flex-col sm:border-0 sm:bg-transparent sm:p-0 sm:text-center"
                >
                  <span
                    className={cn(
                      "relative z-10 grid size-14 shrink-0 place-items-center rounded-full border font-display text-xl transition-colors duration-500",
                      on ? "border-maroon bg-maroon text-white" : done ? "border-navy bg-navy text-gold-pale" : "border-navy/25 bg-ivory text-navy group-hover:border-navy",
                    )}
                  >
                    {s.number}
                  </span>
                  <span className={cn("text-sm font-bold uppercase tracking-[0.14em] transition-colors sm:mt-5", on ? "text-maroon" : "text-navy")}>{s.title}</span>
                </button>
              );
            })}
          </div>

          <div
            id="stage-panel"
            role="tabpanel"
            aria-labelledby={`stage-tab-${active}`}
            className="mt-10 grid gap-6 border border-line bg-white p-8 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-12 lg:p-12"
          >
            <p className="font-display text-7xl leading-none text-maroon/90 lg:text-8xl">{stage.number}</p>
            <div>
              <h3 className="display text-4xl text-navy">{stage.title}</h3>
              <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate">{stage.copy}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
