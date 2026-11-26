import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { verticals, serviceHref } from "@/content/verticals";
import { industryMap, verticalRoles, aboutPage } from "@/content/pages/about";
import { verticalTheme } from "@/config/theme";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { AboutHeading } from "./AboutHeading";

/**
 * Four equal verticals in a 2×2 field — no vertical is subordinate. Each tile
 * shows its photograph in full colour under a dark scrim that settles into the
 * vertical's colour at the bottom, so text stays readable. Below: industries served.
 * Photos: src/content/pages/about.ts → verticals.images.
 */
export function VerticalsMatrix() {
  return (
    <section data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <AboutHeading index="03" {...aboutPage.verticals.heading}>
          {aboutPage.verticals.intro}
        </AboutHeading>

        <ul className="mt-14 grid gap-4 md:grid-cols-2">
          {verticals.map((v) => (
            <li
              key={v.key}
              className="group relative isolate flex min-h-[24rem] flex-col overflow-hidden p-8 text-white [text-shadow:0_1px_14px_rgb(0_0_0/0.45)] lg:p-10"
              style={{ backgroundColor: verticalTheme[v.key].primary }}
              data-reveal
            >
              <Image
                src={aboutPage.verticals.images[v.key].src}
                alt={aboutPage.verticals.images[v.key].alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="-z-10 object-cover transition-transform duration-[1.2s] ease-(--ease-premium) group-hover:scale-105"
                style={{ objectPosition: aboutPage.verticals.images[v.key].position }}
              />
              <div
                aria-hidden
                className="absolute inset-0 -z-10"
                style={{
                  background: `linear-gradient(180deg, rgb(8 14 28 / 0.72) 0%, rgb(8 14 28 / 0.55) 45%, ${verticalTheme[v.key].primary}eb 82%, ${verticalTheme[v.key].primary} 100%)`,
                }}
              />
              <p className="eyebrow flex items-center gap-3 text-gold-pale">
                <span className="font-display text-xl tracking-normal">{v.number}</span>
                <span aria-hidden className="h-px w-8 bg-gold-pale/60" />
                {v.shortTitle}
              </p>
              <h3 className="display mt-5 text-[2rem] lg:text-[2.375rem]">{v.title}</h3>
              <p className="mt-2 font-display text-xl text-gold-pale italic">{v.headline}</p>
              <p className="mt-auto max-w-md pt-10 text-[0.9375rem] leading-relaxed text-white/85">{verticalRoles[v.key]}</p>
              <Link
                href={serviceHref(v)}
                className="mt-6 inline-flex min-h-11 items-center gap-2 self-start border-b border-gold-pale/40 pb-1 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-gold-pale hover:text-gold-pale"
              >
                Explore {v.shortTitle.toLowerCase()}
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </li>
          ))}
        </ul>

        {/* Industries served — sectors, not additional service lines */}
        <div className="mt-12 border-t border-line pt-10 lg:mt-16" data-reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h3 className="eyebrow text-navy">{aboutPage.verticals.industriesLabel}</h3>
              <ul aria-hidden className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
                {verticals.map((v) => (
                  <li key={v.key} className="flex items-center gap-2 text-xs text-slate">
                    <span className={cn("size-2 rounded-full", verticalClasses[v.key].bg)} />
                    {v.shortTitle}
                  </li>
                ))}
              </ul>
            </div>
            <Link href={aboutPage.verticals.industriesLink.href} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:text-navy">
              {aboutPage.verticals.industriesLink.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industryMap.map((ind) => (
              <li key={ind.name} className="flex items-center justify-between gap-4 bg-white px-5 py-4">
                <span className="text-[0.9375rem] font-medium text-navy">{ind.name}</span>
                <span className="flex gap-1.5">
                  <span className="sr-only">Drawn from: {ind.verticals.map((k) => verticals.find((v) => v.key === k)!.shortTitle).join(", ")}</span>
                  {ind.verticals.map((k) => (
                    <span key={k} aria-hidden title={verticals.find((v) => v.key === k)!.title} className={cn("size-2 rounded-full", verticalClasses[k].bg)} />
                  ))}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
