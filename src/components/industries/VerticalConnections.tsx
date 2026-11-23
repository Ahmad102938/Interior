import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries, industryHref } from "@/data/industries";
import { serviceHref, verticals } from "@/data/verticals";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";

/**
 * The four business verticals (WHAT) against the sectors they typically
 * serve (WHERE). Compact by design — full scope lives on each service page.
 */
export function VerticalConnections() {
  return (
    <section data-nav-theme="dark" className="section-y bg-navy text-white">
      <div className="container-page">
        <SectionHeading
          tone="dark"
          align="split"
          eyebrow="Business verticals"
          title="Capabilities that"
          accent="connect industries."
          intro="Four business verticals carry our delivery into each sector. The links below show typical relationships — the exact scope is confirmed for every project."
        />
        <ol className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {verticals.map((v) => {
            const served = industries.filter((i) => i.relatedVerticals.includes(v.key));
            return (
              <li key={v.key} className="relative flex flex-col bg-navy pt-8 pb-6 sm:px-6" data-reveal>
                <span aria-hidden className={cn("absolute top-0 left-0 h-1 w-full", verticalClasses[v.key].bg, v.key === "telecom" && "bg-[#2e4a70]")} />
                <span className="font-display text-xl text-gold-pale tabular-nums">{v.number}</span>
                <h3 className="display mt-3 text-[1.75rem] leading-tight">
                  <Link href={serviceHref(v)} className="hover:text-gold-pale">
                    {v.title}
                  </Link>
                </h3>
                <ul className="mt-5 flex flex-wrap gap-1.5">
                  {v.highlights.map((h) => (
                    <li key={h} className="border border-white/15 px-2.5 py-1 text-[0.6875rem] leading-snug text-white/70">
                      {h}
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-7">
                  <p className="eyebrow text-[0.625rem] text-white/45">Typically serves</p>
                  <ul className="mt-2">
                    {served.map((i) => (
                      <li key={i.slug}>
                        <Link href={industryHref(i)} className="group flex min-h-10 items-center justify-between gap-3 border-b border-white/10 text-sm text-white/85 hover:text-white">
                          {i.name}
                          <ArrowUpRight aria-hidden className="size-3.5 shrink-0 text-white/35 transition-[color,transform] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold-pale" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
