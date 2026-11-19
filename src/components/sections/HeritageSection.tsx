import { company, metrics } from "@/data/company";
import { history } from "@/data/history";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StatCard } from "@/components/ui/StatCard";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { CompanyTimeline } from "./CompanyTimeline";

export function HeritageSection() {
  const stats = publishable(metrics);
  const milestones = publishable(history);
  return (
    <section id="about" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <div data-reveal>
            <SectionHeading index="01" eyebrow="Company heritage & scale" title="Built on Experience." accent="Driven by Execution." intro={company.overview} />
            <p className="mt-5 max-w-xl text-base leading-relaxed text-slate">{company.howWeWork}</p>
            <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-2">
              <div>
                <dt className="eyebrow text-maroon">Vision</dt>
                <dd className="mt-3 text-sm leading-relaxed text-charcoal">{company.vision}</dd>
              </div>
              <div>
                <dt className="eyebrow text-maroon">Mission</dt>
                <dd className="mt-3 text-sm leading-relaxed text-charcoal">{company.mission}</dd>
              </div>
            </dl>
          </div>

          <div className="flex flex-col gap-6" data-reveal>
            {stats.length > 0 ? (
              <dl className="grid grid-cols-2 border-t border-l border-line bg-white">
                {stats.map((m) => (
                  <StatCard key={m.id} metric={m} />
                ))}
              </dl>
            ) : (
              <MediaSlot slot="Office / leadership photograph" alt="ADIDEV team at work" className="aspect-[4/3]" />
            )}
            <ul aria-label="Core values" className="flex flex-wrap gap-2">
              {company.values.map((v) => (
                <li key={v} className="border border-navy/15 px-3.5 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-navy">
                  {v}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {milestones.length > 0 && (
          <div className="mt-16 lg:mt-20" data-reveal>
            <CompanyTimeline items={milestones} />
          </div>
        )}
      </div>
    </section>
  );
}
