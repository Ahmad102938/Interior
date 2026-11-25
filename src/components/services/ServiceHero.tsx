import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ServiceConfig } from "@/content/services";
import { Button } from "@/components/ui/Button";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { Corners, quoteHref } from "./shared";
import { servicesPage } from "@/content/pages/services";
import { breadcrumbLabels } from "@/content/navigation";

const t = servicesPage.detail.hero;

/**
 * Service hero: the division's colour as the environment, the headline on the
 * left and its image fully visible in a drafted frame (no fade-out mask), so
 * the subject reads clearly at every size.
 */
export function ServiceHero({ s }: { s: ServiceConfig }) {
  const c = verticalClasses[s.key];
  return (
    <section data-nav-theme="overlay" className={cn("relative overflow-hidden text-white", c.bg)}>
      {/* Faint technical grid, fading out towards the content */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "linear-gradient(115deg, transparent 30%, #000 85%)",
        }}
      />
      <div className="container-page relative pt-32 pb-14 sm:pb-16 lg:pt-44 lg:pb-24">
        <nav aria-label="Breadcrumb" className="mb-8">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
            <li>
              <Link href="/" className="hover:text-white">
                {breadcrumbLabels.home}
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight aria-hidden className="size-3" />
              <Link href="/services" className="hover:text-white">
                {breadcrumbLabels.services}
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight aria-hidden className="size-3" />
              <span aria-current="page" className="text-white/80">
                {s.title}
              </span>
            </li>
          </ol>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 xl:gap-20">
          <div>
            <p className="eyebrow flex items-center gap-3 text-gold-pale">
              <span className="tabular-nums">{s.serviceNumber}</span>
              <span aria-hidden className="h-px w-10 bg-current opacity-60" />
              {s.title}
            </p>
            <h1 className="display mt-6 text-[2.625rem] sm:text-6xl lg:text-[4.25rem] xl:text-7xl">
              {s.headline[0]}
              <br />
              <em className="font-normal text-gold-pale">{s.headline[1]}</em>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">{s.description}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              {/* Maroon is the default primary; on the maroon division it becomes pale gold */}
              <Button href={quoteHref(s.key)} className={cn(s.key === "interiors" && "border-gold-pale bg-gold-pale text-maroon hover:border-white hover:bg-white")}>
                {t.primaryLabel}
              </Button>
              <Button href={t.secondary.href} variant="outline-light">
                {t.secondary.label}
              </Button>
            </div>
          </div>

          <figure className="relative">
            <div className="relative aspect-[16/10] overflow-hidden ring-1 ring-white/10 lg:aspect-[5/6] xl:aspect-[1/1]">
              <Image
                src={s.heroImage.src}
                alt={s.heroImage.alt}
                fill
                priority
                sizes="(min-width: 1280px) 560px, (min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: s.heroImage.position }}
              />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/3 bg-linear-to-t from-black/45 to-transparent" />
              <figcaption className="absolute right-4 bottom-4 left-4 flex items-center justify-between gap-4 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/80">
                <span>{s.heroImage.caption}</span>
                <span className="tabular-nums text-gold-pale">{s.serviceNumber} / 04</span>
              </figcaption>
            </div>
            <Corners />
          </figure>
        </div>
      </div>
    </section>
  );
}
