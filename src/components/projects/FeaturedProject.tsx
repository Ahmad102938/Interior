import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { categoryOf, isPublic, locationLabel, projectHref, type Project } from "@/content/projects";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { StatusBadge } from "@/components/ui/ProjectCard";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { projectsPage } from "@/content/pages/projects";

/**
 * Editorial lead: a dominant photograph with the project's story set on an
 * ivory panel that overlaps its edge. Rendered only for an approved project
 * marked `featured` (drafts appear in development only).
 */
export function FeaturedProject({ project: p }: { project: Project }) {
  const cat = categoryOf(p.category);
  return (
    <section data-nav-theme="light" aria-labelledby="featured-title" className="section-y bg-white">
      <div className="container-page">
        <p className="eyebrow flex items-center gap-3 text-gold-ink">
          <span aria-hidden className="h-px w-10 bg-gold/60" />
          {projectsPage.featured.eyebrow}
        </p>
        <article className="group relative mt-8 grid lg:mt-10 lg:grid-cols-12">
          <div className="relative aspect-[16/10] overflow-hidden bg-navy lg:col-span-9 lg:col-start-1 lg:row-start-1 lg:aspect-auto lg:min-h-[36rem]">
            {p.featuredImage ? (
              <Image
                src={p.featuredImage.src}
                alt={p.featuredImage.alt}
                fill
                sizes="(min-width: 1024px) 75vw, 100vw"
                className="object-cover transition-transform duration-[1.2s] ease-(--ease-premium) motion-safe:group-hover:scale-[1.03]"
                style={{ objectPosition: p.featuredImage.position }}
              />
            ) : (
              <MediaSlot slot={cat.label} alt={`${p.name} — photograph to follow`} vertical={cat.vertical} className="absolute inset-0" />
            )}
            <StatusBadge project={p} className="absolute top-5 left-5" />
          </div>

          <div className="z-10 bg-ivory p-6 sm:p-10 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mb-12 lg:self-end lg:p-12">
            {/* Accent rule on the panel's top edge (in flow, so the card-wide link can cover the whole article) */}
            <span aria-hidden className={cn("-mx-6 -mt-6 mb-6 block h-1 w-16 sm:-mx-10 sm:-mt-10 sm:mb-10 lg:-mx-12 lg:-mt-12 lg:mb-12", verticalClasses[cat.vertical].bg)} />
            <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-navy">
              {cat.label}
              {!isPublic(p) && <PendingBadge status="pending" />}
            </p>
            <h2 id="featured-title" className="display mt-4 text-[2.25rem] text-navy sm:text-5xl">
              {p.name}
            </h2>
            <p className="mt-4 flex items-center gap-2 text-sm text-slate">
              <MapPin aria-hidden className="size-4 shrink-0" />
              {locationLabel(p)}
            </p>
            <p className="mt-5 text-[0.9375rem] leading-relaxed text-charcoal/85">{p.summary}</p>
            {p.metric && (
              <dl className="mt-6 border-t border-navy/10 pt-5">
                <dt className="eyebrow text-gold-ink">{p.metric.label}</dt>
                <dd className="display mt-1 text-4xl text-navy">{p.metric.value}</dd>
              </dl>
            )}
            <Link
              href={projectHref(p)}
              className="mt-8 inline-flex min-h-12 items-center gap-2.5 bg-navy px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors after:absolute after:inset-0 hover:bg-maroon"
            >
              {projectsPage.featured.cta}
              <span className="sr-only">: {p.name}</span>
              <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </article>
      </div>
    </section>
  );
}
