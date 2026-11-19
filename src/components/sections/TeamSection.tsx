import { leadership, teamFunctions } from "@/data/capabilities";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PendingBadge } from "@/components/ui/PendingBadge";

export function TeamSection({ index = "08" }: { index?: string }) {
  const leaders = publishable(leadership);
  return (
    <section id="team" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <SectionHeading
          index={index}
          eyebrow="Team & leadership"
          title="The People Behind"
          accent="Every Handover."
          align="split"
          intro="Project management, engineering, design, procurement, site supervision and business development — working as one delivery team."
        />
        <div className="mt-14 grid gap-10 lg:mt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          {leaders.length > 0 && (
            <div data-reveal>
              {leaders.map((l) => (
                <figure key={l.name}>
                  <MediaSlot slot="Founder / Director portrait" alt={l.name} className="aspect-[4/5]" />
                  <figcaption className="mt-5">
                    <p className="flex items-center gap-2 font-display text-3xl text-navy">
                      {l.name} <PendingBadge status={l.status} />
                    </p>
                    <p className="eyebrow mt-2 text-maroon">{l.designation}</p>
                    <p className="mt-3 text-sm text-slate">{l.bio}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
          <ul className={leaders.length ? "grid content-start gap-px border border-line bg-line sm:grid-cols-2" : "grid gap-px border border-line bg-line sm:grid-cols-2 lg:col-span-2 lg:grid-cols-3"} data-reveal>
            {teamFunctions.map((t) => (
              <li key={t.title} className="bg-white p-7">
                <h3 className="text-base font-semibold text-navy">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate">{t.copy}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
