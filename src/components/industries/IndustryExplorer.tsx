import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries, industryHref, type Industry } from "@/content/industries";
import { serviceHref, verticalByKey } from "@/content/verticals";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { industriesPage } from "@/content/pages/industries";

/*
 * Editorial grid — a dominant pair, a row of three, then one wide banner —
 * so six sectors read as a composed spread rather than six equal cards.
 */
const layout = [
  "md:col-span-2 lg:col-span-7 lg:min-h-[36rem]",
  "lg:col-span-5 lg:min-h-[36rem]",
  "lg:col-span-4 lg:min-h-[30rem]",
  "lg:col-span-4 lg:min-h-[30rem]",
  "lg:col-span-4 lg:min-h-[30rem]",
  "md:col-span-2 lg:col-span-12 lg:min-h-[24rem]",
];

export function IndustryExplorer() {
  return (
    <section id="industries" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
      <div className="container-page">
        <SectionHeading {...industriesPage.explorer.heading} align="split" />
        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-12 lg:gap-5">
          {industries.map((ind, i) => (
            <IndustryTile key={ind.slug} industry={ind} className={layout[i]} wide={i === industries.length - 1} />
          ))}
        </ul>
      </div>
    </section>
  );
}

function IndustryTile({ industry: ind, className, wide }: { industry: Industry; className?: string; wide?: boolean }) {
  const primary = verticalByKey(ind.relatedVerticals[0]);
  const c = verticalClasses[ind.brandAccent];
  return (
    <li className={cn("group relative isolate flex min-h-[26rem] flex-col overflow-hidden bg-navy-deep text-white sm:min-h-[28rem]", className)} data-reveal>
      <Image
        src={ind.image.src}
        alt={ind.image.alt}
        fill
        sizes={wide ? "(min-width: 1024px) 1200px, 100vw" : "(min-width: 1024px) 50vw, (min-width: 768px) 50vw, 100vw"}
        className="-z-20 object-cover transition-transform duration-[1200ms] ease-(--ease-premium) group-hover:scale-[1.045] motion-reduce:transition-none"
        style={{ objectPosition: ind.image.position }}
      />
      {/* Readability: a scrim under the copy only, so the image stays visible above it */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 -z-10 bg-linear-to-t from-[#0b1626]/95 from-15% via-[#0b1626]/65 via-50% to-transparent to-85% transition-opacity duration-700 group-hover:opacity-90",
          wide && "lg:bg-linear-to-r lg:from-[#0b1626]/95 lg:via-[#0b1626]/55 lg:via-40% lg:to-transparent lg:to-70%",
        )}
      />
      {/* Restrained sector accent: one bar in the related vertical's colour */}
      <span aria-hidden className={cn("absolute top-0 left-0 h-1 w-20 transition-[width] duration-700 ease-(--ease-premium) group-hover:w-32", c.bg, ind.brandAccent === "telecom" && "bg-[#3a5a85]")} />

      <div className="flex items-start justify-between p-6 lg:p-8">
        <span className="font-display text-2xl text-gold-pale tabular-nums">{ind.id}</span>
        <span
          aria-hidden
          className="grid size-11 place-items-center border border-white/25 text-white transition-[border-color,background-color] duration-500 group-hover:border-gold-pale group-hover:bg-white/10"
        >
          <ArrowUpRight className="size-4 transition-transform duration-500 ease-(--ease-premium) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>

      <div className={cn("mt-auto p-6 pt-0 lg:p-8 lg:pt-0", wide && "lg:max-w-xl")}>
        <p className="font-display text-lg text-gold-pale italic">{ind.headline}</p>
        <h3 className="display mt-2 text-[2rem] leading-[1.05] lg:text-[2.375rem]">
          {/* The whole tile is the link; the vertical link below sits above it */}
          <Link href={industryHref(ind)} className="outline-none after:absolute after:inset-0 after:z-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-4 focus-visible:after:outline-gold-pale">
            {ind.name}
          </Link>
        </h3>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-white/80 transition-colors duration-500 group-hover:text-white/95">{ind.shortDescription}</p>
        <span aria-hidden className="mt-6 block h-px w-full bg-white/15">
          <span className="block h-px w-10 bg-gold-pale transition-[width] duration-700 ease-(--ease-premium) group-hover:w-full" />
        </span>
        <Link
          href={serviceHref(primary)}
          className="relative z-10 mt-1 inline-flex min-h-11 items-center gap-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-gold-pale"
        >
          <span aria-hidden className={cn("size-2 ring-1 ring-white/40", verticalClasses[primary.key].bg)} />
          {primary.title}
        </Link>
      </div>
    </li>
  );
}
