"use client";

import { useEffect, useRef, useState } from "react";
import { functions, method, type FunctionKey } from "@/data/about";
import { leadership } from "@/data/capabilities";
import { publishable } from "@/lib/content";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/utils";
import { AboutHeading } from "./AboutHeading";

const ORDER: FunctionKey[] = ["bd", "pm", "eng", "design", "proc", "site"];

/**
 * How a project moves — and who moves it. The five-stage method on the left;
 * the organisation on the right. The stage in view (or hovered/focused)
 * lights up the teams that lead it. Leadership shows only once verified.
 */
export function MethodAndPeople() {
  const [active, setActive] = useState(0);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const leaders = publishable(leadership);

  // Follow the stage nearest the middle of the viewport while scrolling.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.index));
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    items.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const lit = new Set(method[active].teams);

  return (
    <section id="people" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <AboutHeading index="05" eyebrow="Method & people" title="How a project moves —" accent="and who moves it.">
          Five stages take a project from brief to handover. Each is led by the teams best placed for it, so responsibility is clear at every step.
        </AboutHeading>

        <div className="mt-14 grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Method */}
          <ol className="relative lg:col-span-7">
            <span aria-hidden className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-line" />
            <span aria-hidden data-spine-fill className="absolute top-2 bottom-2 left-[1.15rem] w-px bg-gold" />
            {method.map((m, i) => (
              <li
                key={m.number}
                ref={(el) => {
                  items.current[i] = el;
                }}
                data-index={i}
                className="relative pb-12 pl-14 last:pb-0"
                onMouseEnter={() => setActive(i)}
              >
                <span
                  aria-hidden
                  className={cn(
                    "absolute top-0 left-0 grid size-[2.3rem] place-items-center rounded-full border font-display text-base transition-colors duration-500",
                    active === i ? "border-navy bg-navy text-gold-pale" : "border-gold/60 bg-ivory text-navy",
                  )}
                >
                  {m.number}
                </span>
                <h3 className={cn("display text-[2rem] transition-colors duration-500", active === i ? "text-navy" : "text-navy/60")}>{m.title}</h3>
                <p className="mt-2 max-w-lg text-[0.9375rem] leading-relaxed text-slate">{m.detail}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-gold">
                  Led by {m.teams.map((t) => functions[t].name.toLowerCase()).join(" · ")}
                </p>
              </li>
            ))}
          </ol>

          {/* Organisation */}
          <aside aria-label="Organisation" className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
            <div className="border border-line bg-white p-6 lg:p-8">
              <p className="eyebrow text-slate">Our organisation</p>
              {/* Leadership node */}
              <div className="mt-5 bg-navy px-5 py-4 text-white">
                {leaders.length > 0 ? (
                  leaders.map((l) => (
                    <div key={l.name} className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-display text-xl">{l.name}</p>
                        <p className="text-xs text-white/60">{l.designation}</p>
                      </div>
                      <PendingBadge status={l.status} />
                    </div>
                  ))
                ) : (
                  <p className="font-display text-xl">Leadership & management</p>
                )}
              </div>
              <span aria-hidden className="mx-auto block h-6 w-px bg-gold/60" />
              <ul className="grid gap-2 sm:grid-cols-2">
                {ORDER.map((k) => {
                  const on = lit.has(k);
                  return (
                    <li
                      key={k}
                      className={cn(
                        "border px-4 py-3 transition-all duration-500",
                        on ? "border-gold bg-ivory-soft shadow-[inset_3px_0_0_var(--color-gold)]" : "border-line opacity-50",
                      )}
                    >
                      <p className="text-sm font-semibold text-navy">{functions[k].name}</p>
                      <p className="mt-1 text-xs leading-relaxed text-slate">{functions[k].role}</p>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-5 text-xs text-slate" aria-live="polite">
                Highlighted: teams leading <span className="font-semibold text-navy">{method[active].title}</span>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
