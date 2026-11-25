import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { verticals, serviceHref } from "@/content/verticals";
import { homePage } from "@/content/pages/home";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";

/**
 * Four full-width vertical panels with alternating image/text. Each uses its
 * fixed vertical colour. Imagery is the matching 3D visualisation until
 * approved project photographs are supplied (see CONTENT_VERIFICATION.md).
 */
export function VerticalsSection() {
  return (
    <section id="verticals" data-nav-theme="light" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading index="02" {...homePage.verticals.heading} align="split" />
        <div className="mt-14 flex flex-col gap-6 lg:mt-20 lg:gap-8">
          {verticals.map((v, i) => {
            const c = verticalClasses[v.key];
            const flip = i % 2 === 1;
            const img = homePage.verticals.images[v.key];
            return (
              <article key={v.key} data-reveal className={cn("grid overflow-hidden text-white lg:grid-cols-12", c.bg)}>
                <MediaSlot
                  src={img.src}
                  alt={img.alt}
                  slot={v.imageSlots[0]}
                  caption={img.caption}
                  position={img.position}
                  className={cn("min-h-64 sm:min-h-80 lg:col-span-7 lg:min-h-[30rem]", flip && "lg:order-2")}
                  sizes="(min-width: 1024px) 58vw, 100vw"
                />
                <div className="flex flex-col p-7 sm:p-10 lg:col-span-5 lg:p-12">
                  <p className={cn("eyebrow flex items-center gap-3", c.accent)}>
                    <span className="font-display text-xl tracking-normal">{v.number}</span>
                    <span aria-hidden className="h-px w-8 bg-current opacity-50" />
                    {v.shortTitle}
                  </p>
                  <h3 className="display mt-5 text-[2.25rem] lg:text-[2.75rem]">{v.title}</h3>
                  <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/75">{v.summary}</p>
                  <ul className="mt-7 space-y-3 border-t border-white/15 pt-6">
                    {v.highlights.map((h) => (
                      <li key={h} className="flex gap-3 text-sm text-white/90">
                        <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", c.accent)} />
                        {h}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={serviceHref(v)}
                    className="group mt-auto inline-flex min-h-12 items-center gap-3 self-start pt-8 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white hover:text-gold-pale"
                  >
                    {homePage.verticals.cardCta}
                    <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
