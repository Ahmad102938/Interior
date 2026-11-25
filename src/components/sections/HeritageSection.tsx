import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { homePage } from "@/content/pages/home";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { MediaSlot } from "@/components/ui/MediaSlot";

/**
 * Homepage "Who we are" teaser. The full company story (vision, mission,
 * values, organisation, heritage) lives on /about — this only introduces it.
 * Content: src/content/pages/home.ts → heritage.
 */
export function HeritageSection() {
  const c = homePage.heritage;
  const stats = publishable(c.metrics);
  return (
    <section id="about" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div data-reveal>
          <SectionHeading index="01" {...c.heading} />
          <Link
            href={c.link.href}
            className="group mt-8 inline-flex min-h-11 items-center gap-2 border-b border-maroon/30 pb-1 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:border-maroon"
          >
            {c.link.label}
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
        {stats.length > 0 ? (
          <div className="flex flex-col gap-6 self-start" data-reveal>
            {/* A real photo sits above the figures once one is supplied */}
            {c.image.src && <MediaSlot {...c.image} className="aspect-[16/9]" />}
            <dl className="grid grid-cols-2 border-t border-l border-line bg-white">
              {stats.map((m) => (
                <StatCard key={m.id} metric={m} />
              ))}
            </dl>
          </div>
        ) : (
          <div data-reveal>
            <MediaSlot {...c.image} className="aspect-[4/3]" />
          </div>
        )}
      </div>
    </section>
  );
}
