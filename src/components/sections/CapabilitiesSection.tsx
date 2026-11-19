import { capabilities } from "@/data/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";

const phases = [
  { label: "Pre-construction control", span: "lg:col-span-3" },
  { label: "Field execution", span: "lg:col-span-2" },
  { label: "Close-out", span: "lg:col-span-1" },
];

/**
 * Connected capability diagram: six capabilities on one gold spine, grouped
 * into the three phases they control. Vertical spine on small screens.
 */
export function CapabilitiesSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <section id="capabilities" data-nav-theme="dark" className="section-y relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#d8c398 1px, transparent 1px), linear-gradient(90deg, #d8c398 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="container-page relative">
        <SectionHeading
          index="04"
          eyebrow="Engineering capabilities"
          title="One Integrated Approach."
          accent="Complete Project Control."
          tone="dark"
          align="split"
          intro="Planning, engineering coordination, procurement, field execution and handover managed as one connected system — so decisions made early carry through to site."
        />

        <div className="mt-16 lg:mt-24" data-reveal>
          {/* Phase brackets */}
          <div className="hidden gap-6 lg:grid lg:grid-cols-6">
            {phases.map((p) => (
              <div key={p.label} className={p.span}>
                <p className="eyebrow text-gold-pale/80">{p.label}</p>
                <div aria-hidden className="mt-3 h-3 border-x border-t border-gold/40" />
              </div>
            ))}
          </div>

          <ol className="relative mt-2 grid gap-10 pl-10 lg:grid-cols-6 lg:gap-6 lg:pl-0">
            <span aria-hidden className="absolute top-0 bottom-0 left-[0.6875rem] w-px bg-gold/50 lg:top-[0.6875rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-auto" />
            {capabilities.map((c) => (
              <li key={c.number} className="relative">
                <span aria-hidden className="absolute top-0 -left-10 grid size-6 place-items-center rounded-full border border-gold bg-navy lg:static">
                  <span className="size-2 rounded-full bg-gold" />
                </span>
                <p className="font-display text-2xl text-gold-pale lg:mt-6">{c.number}</p>
                <h3 className="mt-2 text-lg leading-snug font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{c.summary}</p>
                <ul className="mt-4 space-y-2 border-t border-white/10 pt-4">
                  {c.items.map((it) => (
                    <li key={it} className="text-[0.8125rem] leading-snug text-white/80">
                      {it}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>

        {showCta && (
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
            <p className="max-w-xl text-sm text-white/60">
              In-house expertise is clearly distinguished from qualified partner- or vendor-supported delivery on every project.
            </p>
            <Button href="/capabilities" variant="outline-light">
              Explore capabilities
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
