import { BadgeCheck, ClipboardList, HardHat, PencilRuler, Truck } from "lucide-react";
import { executionStages } from "@/content/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { capabilitiesPage } from "@/content/pages/capabilities";

const icons = [ClipboardList, PencilRuler, Truck, HardHat, BadgeCheck];

/**
 * The five-stage methodology (slide 13): the sequence a project moves through,
 * distinct from the capabilities above. Horizontal on desktop, vertical on
 * phones; the gold line fills on scroll and a maroon marker follows hover.
 */
export function ExecutionMethodology() {
  return (
    <section id="execution" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
      <div className="container-page">
        <SectionHeading align="split" {...capabilitiesPage.methodology.heading} />
        <ol className="relative mt-12 grid gap-10 lg:mt-16 lg:grid-cols-5 lg:gap-8">
          <span aria-hidden className="absolute top-6 bottom-6 left-6 w-px bg-navy/15 lg:hidden" />
          <span aria-hidden data-spine-fill className="absolute top-6 bottom-6 left-6 w-px bg-gold lg:hidden" />
          <span aria-hidden className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-navy/15 lg:block" />
          <span aria-hidden data-rail-fill className="absolute top-6 right-[10%] left-[10%] hidden h-px bg-gold lg:block" />
          {executionStages.map((s, i) => {
            const Icon = icons[i];
            return (
              <li key={s.number} className="group relative pl-20 lg:pl-0 lg:text-center" data-reveal>
                <span className="absolute top-0 left-0 grid size-12 place-items-center rounded-full border border-gold bg-ivory text-navy transition-colors duration-300 group-hover:border-maroon group-hover:bg-maroon group-hover:text-white lg:relative lg:mx-auto">
                  <Icon aria-hidden className="size-5" strokeWidth={1.5} />
                </span>
                <p className="font-display text-2xl text-gold-ink tabular-nums lg:mt-6">{s.number}</p>
                <h3 className="mt-1 text-sm font-semibold uppercase tracking-[0.14em] text-navy">{s.title}</h3>
                <span aria-hidden className="mt-3 block h-0.5 w-8 origin-left scale-x-0 bg-maroon transition-transform duration-300 group-hover:scale-x-100 lg:mx-auto lg:origin-center" />
                <p className="mt-3 text-sm leading-relaxed text-slate lg:mx-auto lg:max-w-[13rem]">{s.copy}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
