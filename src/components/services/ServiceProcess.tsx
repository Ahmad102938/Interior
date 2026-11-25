import type { ServiceConfig, Surface } from "@/content/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { surface } from "./shared";
import { servicesPage } from "@/content/pages/services";

/**
 * The division's six-stage workflow: horizontal on desktop, vertical on phones.
 * The gold rail fills as the section scrolls through (CSS only, reduced-motion safe).
 */
export function ServiceProcess({ s, tone }: { s: ServiceConfig; tone: Surface }) {
  const sf = surface(tone, s.key);
  const { steps } = s.process;
  const dark = sf.dark;

  return (
    <section id="process" data-nav-theme={sf.navTheme} className={cn("section-y scroll-mt-32", sf.className)}>
      <div className="container-page">
        <SectionHeading
          eyebrow={servicesPage.detail.process.eyebrow}
          title={`${steps.length} stages,`}
          accent={`${steps[0].title.toLowerCase()} to ${steps[steps.length - 1].title.toLowerCase()}.`}
          align="split"
          intro={s.process.intro}
          tone={dark ? "dark" : "light"}
        />
        <ol className="relative mt-12 grid gap-9 lg:mt-16 lg:grid-cols-6 lg:gap-6">
          {/* Rails: vertical on small screens, horizontal on large */}
          <span aria-hidden className={cn("absolute top-3 bottom-3 left-[0.6875rem] w-px lg:hidden", dark ? "bg-white/15" : "bg-navy/15")} />
          <span aria-hidden data-spine-fill className="absolute top-3 bottom-3 left-[0.6875rem] w-px bg-gold lg:hidden" />
          <span aria-hidden className={cn("absolute top-[0.6875rem] right-0 left-0 hidden h-px lg:block", dark ? "bg-white/15" : "bg-navy/15")} />
          <span aria-hidden data-rail-fill className="absolute top-[0.6875rem] right-0 left-0 hidden h-px bg-gold lg:block" />
          {steps.map((st, i) => (
            <li key={st.title} className="relative pl-12 lg:pt-12 lg:pl-0" data-reveal>
              <span
                aria-hidden
                className={cn("absolute top-0 left-0 grid size-6 place-items-center rounded-full border border-gold", dark ? verticalClasses[s.key].bg : "bg-white")}
              >
                <span className={cn("size-2 rounded-full", dark ? "bg-gold-pale" : "bg-gold")} />
              </span>
              <p className={cn("font-display text-2xl tabular-nums", dark ? "text-gold-pale" : "text-gold-ink")}>{String(i + 1).padStart(2, "0")}</p>
              <h3 className={cn("mt-1 text-sm font-semibold uppercase tracking-[0.14em]", dark ? "text-white" : "text-navy")}>{st.title}</h3>
              <p className={cn("mt-2 max-w-xs text-sm leading-relaxed", dark ? "text-white/65" : "text-slate")}>{st.copy}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
