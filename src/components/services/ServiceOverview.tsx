import Link from "next/link";
import { ArrowUpRight, Info } from "lucide-react";
import type { ServiceConfig, Surface } from "@/content/services";
import { industries, industryHref } from "@/content/industries";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { surface } from "./shared";
import { servicesPage } from "@/content/pages/services";

const t = servicesPage.detail.overview;

/** Positioning, scope note and an at-a-glance panel linking to the sectors served. */
export function ServiceOverview({ s, tone }: { s: ServiceConfig; tone: Surface }) {
  const sf = surface(tone, s.key);
  const served = industries.filter((i) => i.relatedVerticals.includes(s.key));
  const areas = s.capabilities.groups.reduce((n, g) => n + g.items.length, 0);
  const card = tone === "white" ? "bg-ivory" : "bg-white";

  return (
    <section id="overview" data-nav-theme={sf.navTheme} className={cn("section-y scroll-mt-32", sf.className)}>
      <div className="container-page grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
        <div>
          <SectionHeading eyebrow={t.eyebrow} title={s.overview.title[0]} accent={s.overview.title[1]} />
          <div className="mt-8 space-y-5 text-base leading-relaxed text-slate lg:text-[1.0625rem]">
            {s.overview.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:pt-14">
          <dl className={cn("grid grid-cols-2 border border-line", card)} data-reveal>
            <div className="border-r border-line p-6 sm:p-8">
              <dt className="eyebrow text-gold-ink">{t.capabilityAreas}</dt>
              <dd className="display mt-3 text-5xl text-navy tabular-nums">{areas}</dd>
            </div>
            <div className="p-6 sm:p-8">
              <dt className="eyebrow text-gold-ink">{t.processStages}</dt>
              <dd className="display mt-3 text-5xl text-navy tabular-nums">{s.process.steps.length}</dd>
            </div>
            <div className="col-span-2 border-t border-line p-6 sm:p-8">
              <dt className="eyebrow text-gold-ink">{t.sectorsServed}</dt>
              <dd className="mt-3">
                <ul className="flex flex-col">
                  {served.map((i) => (
                    <li key={i.slug}>
                      <Link href={industryHref(i)} className="group flex min-h-11 items-center justify-between gap-4 border-b border-line text-sm font-medium text-navy last:border-0 hover:text-maroon">
                        {i.name}
                        <ArrowUpRight aria-hidden className="size-4 shrink-0 text-gold-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          </dl>
          <p className="flex gap-3 border-l-2 border-gold py-1 pl-4 text-sm leading-relaxed text-charcoal">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-ink" />
            <span>
              <span className="font-semibold">{t.scopeNoteLabel} </span>
              {s.overview.scopeNote}
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
