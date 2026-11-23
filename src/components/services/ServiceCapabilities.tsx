import { ChevronDown } from "lucide-react";
import type { ServiceConfig, Surface } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { CapabilityGroup } from "./CapabilityGroup";
import { formatCovers, surface } from "./shared";

/**
 * Numbered capability ledger, grouped. Desktop: group label beside its rows
 * (positioned, since grid/flex on <details> is unreliable across browsers).
 * Phones: each group collapses behind its title so long scopes stay scannable.
 */
export function ServiceCapabilities({ s, tone }: { s: ServiceConfig; tone: Surface }) {
  const sf = surface(tone, s.key);
  const c = verticalClasses[s.key];
  const row = tone === "white" ? "bg-ivory-soft hover:bg-ivory" : "bg-white hover:bg-ivory-soft";

  return (
    <section id="capabilities" data-nav-theme={sf.navTheme} className={cn("section-y scroll-mt-32", sf.className)}>
      <div className="container-page">
        <SectionHeading eyebrow="Capabilities" title="What we" accent="deliver." align="split" intro={s.capabilities.intro} />
        <div className="mt-12 border-t border-navy/15 lg:mt-16">
          {s.capabilities.groups.map((g, gi) => (
            <CapabilityGroup
              key={g.title}
              first={gi === 0}
              className="group/cap relative border-b border-navy/15 lg:py-10 lg:pl-[20rem] xl:pl-[22rem]"
              summary={
                <div className="flex min-h-16 cursor-pointer items-center gap-4 py-5 lg:cursor-default lg:absolute lg:top-10 lg:left-0 lg:w-[17rem] lg:flex-col lg:items-start lg:gap-0 lg:py-0">
                  <span className="font-display text-lg text-gold-ink tabular-nums">{formatCovers(g.items.map((i) => i.number))}</span>
                  <span className="flex-1 lg:mt-2">
                    <span className="display block text-2xl text-navy lg:text-3xl">{g.title}</span>
                    <span className="mt-2 hidden max-w-[15rem] text-sm leading-relaxed text-slate lg:block">{g.intro}</span>
                  </span>
                  <ChevronDown aria-hidden className="size-5 shrink-0 text-navy/50 transition-transform group-open/cap:rotate-180 lg:hidden" />
                </div>
              }
            >
              <ol className="grid gap-px pb-6 lg:min-h-36 lg:content-start lg:pb-0">
                {g.items.map((it) => (
                  <li key={it.number} className={cn("group relative flex gap-5 px-5 py-4 transition-colors sm:px-6", row)}>
                    <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100", c.bg)} />
                    <span className="w-6 shrink-0 pt-0.5 font-display text-base text-gold-ink tabular-nums">{it.number}</span>
                    <span>
                      <span className="block text-[0.9375rem] font-semibold text-navy">{it.title}</span>
                      {it.copy && <span className="mt-1 block text-sm leading-relaxed text-slate">{it.copy}</span>}
                    </span>
                  </li>
                ))}
              </ol>
            </CapabilityGroup>
          ))}
        </div>
      </div>
    </section>
  );
}
