import { deliveryFlow } from "@/data/capabilities";
import { capabilityGroups } from "@/data/capabilityGroups";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";

/** Group indicator colours: navy-light for pre-construction, emerald for execution, maroon for completion. */
const groupTone: Record<string, string> = {
  "pre-construction": "bg-gold-pale/70",
  "field-execution": "bg-emerald",
  "quality-completion": "bg-maroon-light",
};

/**
 * How the six capabilities connect — a systems line from requirement to
 * handover, with the three capability groups bracketed beneath. A gold pulse
 * travels the connector (CSS only; off for reduced motion).
 */
export function IntegratedDelivery() {
  const cols = deliveryFlow.length;
  return (
    <section data-nav-theme="dark" className="section-y relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: "linear-gradient(#d8c398 1px, transparent 1px), linear-gradient(90deg, #d8c398 1px, transparent 1px)", backgroundSize: "64px 64px" }}
      />
      <div className="container-page relative">
        <SectionHeading
          tone="dark"
          align="split"
          eyebrow="Integrated delivery"
          title="One Integrated Approach."
          accent="Connected Project Delivery."
          intro="Each capability hands a defined output to the next, so decisions made at the requirement stage carry through to site and handover."
        />

        <ol className="relative mt-14 grid gap-8 lg:mt-20 lg:grid-cols-7 lg:gap-4">
          {/* Connectors: vertical on small screens, horizontal on large */}
          <span aria-hidden className="absolute top-3 bottom-3 left-[0.6875rem] w-px bg-white/15 lg:hidden" />
          <span aria-hidden data-spine-fill className="absolute top-3 bottom-3 left-[0.6875rem] w-px bg-gold lg:hidden" />
          <span aria-hidden className="absolute top-[0.6875rem] right-[7%] left-[7%] hidden h-px bg-white/15 lg:block" />
          <span aria-hidden data-rail-fill className="absolute top-[0.6875rem] right-[7%] left-[7%] hidden h-px bg-gold lg:block" />
          <span aria-hidden className="absolute top-[0.4375rem] right-[7%] left-[7%] hidden h-2 animate-[flow-pulse_7s_linear_infinite] motion-reduce:hidden lg:block">
            <span className="absolute top-0 left-0 size-2 -translate-x-1/2 rounded-full bg-gold-pale shadow-[0_0_12px_2px_rgba(216,195,152,0.6)]" />
          </span>

          {deliveryFlow.map((f) => (
            <li key={f.label} className="relative pl-12 lg:pt-12 lg:pl-0 lg:text-center" data-reveal>
              <span
                aria-hidden
                className={cn(
                  "absolute top-0 left-0 grid size-6 place-items-center rounded-full border bg-navy lg:left-1/2 lg:-translate-x-1/2",
                  f.number ? "border-gold" : "border-white/40",
                )}
              >
                <span className={cn("size-2 rounded-full", f.number ? "bg-gold" : "bg-white/60")} />
              </span>
              <p className="font-display text-xl text-gold-pale tabular-nums">{f.number ?? "In"}</p>
              <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.12em]">{f.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60 lg:mx-auto lg:max-w-[11rem]">{f.output}</p>
            </li>
          ))}
        </ol>

        {/* Group brackets under the capabilities they contain (large screens) */}
        <div aria-hidden className="mt-10 hidden gap-4 lg:grid" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
          <span className="col-span-1" />
          {capabilityGroups.map((g) => (
            <div key={g.key} style={{ gridColumn: `span ${g.numbers.length}` }}>
              <span className={cn("block h-0.5", groupTone[g.key])} />
              <p className="eyebrow mt-3 text-center text-[0.625rem] text-white/60">{g.label}</p>
            </div>
          ))}
        </div>

        <p className="mt-12 max-w-2xl border-l-2 border-gold/60 pl-4 text-sm leading-relaxed text-white/65 lg:mt-14">
          The line is not one-way: progress tracking and reporting (03) and stage-wise checks (06) run alongside site execution and feed back into the plan.
        </p>
      </div>
    </section>
  );
}
