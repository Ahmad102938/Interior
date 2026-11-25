import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { executionStages } from "@/content/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { industriesPage } from "@/content/pages/industries";

const c = industriesPage.approach;

/**
 * Compact, connected five-stage timeline. The full execution framework lives
 * on /capabilities — this only shows that one method applies in every sector.
 */
export function DeliveryApproach() {
  return (
    <section data-nav-theme="dark" className="section-y bg-charcoal text-white">
      <div className="container-page">
        <SectionHeading tone="dark" align="split" {...c.heading} />
        <ol className="relative mt-12 grid gap-8 lg:mt-16 lg:grid-cols-5 lg:gap-6">
          {/* Connector: vertical on small screens, horizontal on large */}
          <span aria-hidden className="absolute top-2 bottom-2 left-[0.4375rem] w-px bg-white/15 lg:top-[0.4375rem] lg:right-0 lg:bottom-auto lg:left-0 lg:h-px lg:w-full" />
          {executionStages.map((s) => (
            <li key={s.number} className="relative pl-10 lg:pt-10 lg:pl-0" data-reveal>
              <span aria-hidden className="absolute top-0 left-0 grid size-[0.9375rem] place-items-center rounded-full border border-gold-pale/70 bg-charcoal">
                <span className="size-1.5 rounded-full bg-gold-pale" />
              </span>
              <p className="font-display text-lg text-gold-pale tabular-nums">{s.number}</p>
              <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.14em]">{s.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/65">{s.copy}</p>
            </li>
          ))}
        </ol>
        <Link
          href={c.link.href}
          className="mt-10 inline-flex min-h-11 items-center gap-2 border-b border-gold-pale/40 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-gold-pale hover:text-gold-pale lg:mt-12"
        >
          {c.link.label}
          <ArrowUpRight aria-hidden className="size-4" />
        </Link>
      </div>
    </section>
  );
}
