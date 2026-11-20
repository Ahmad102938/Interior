import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company, metrics } from "@/data/company";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { MediaSlot } from "@/components/ui/MediaSlot";

/**
 * Homepage "Who we are" teaser. The full company story (vision, mission,
 * values, organisation, heritage) lives on /about — this only introduces it.
 */
export function HeritageSection() {
  const stats = publishable(metrics);
  return (
    <section id="about" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div data-reveal>
          <SectionHeading index="01" eyebrow="Who we are" title="Built on Experience." accent="Driven by Execution." intro={company.overview} />
          <Link
            href="/about"
            className="group mt-8 inline-flex min-h-11 items-center gap-2 border-b border-maroon/30 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:border-maroon"
          >
            Our story, values & people
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        {stats.length > 0 ? (
          <dl className="grid grid-cols-2 self-start border-t border-l border-line bg-white" data-reveal>
            {stats.map((m) => (
              <StatCard key={m.id} metric={m} />
            ))}
          </dl>
        ) : (
          <div data-reveal>
            <MediaSlot slot="Office / team photograph" alt="The ADIDEV team at work" className="aspect-[4/3]" />
          </div>
        )}
      </div>
    </section>
  );
}
