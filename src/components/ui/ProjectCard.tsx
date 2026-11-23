import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { categoryOf, isPublic, locationLabel, projectHref, statusLabel, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";
import { MediaSlot } from "./MediaSlot";
import { PendingBadge } from "./PendingBadge";
import { verticalClasses } from "./VerticalBadge";

/**
 * Portfolio card. One link ("View case study") stretched over the card, so the
 * whole card is clickable without nested links; focus shows on the card.
 */
export function ProjectCard({ project: p, wide = false, className, headingLevel: H = "h3" }: { project: Project; wide?: boolean; className?: string; headingLevel?: "h2" | "h3" }) {
  const cat = categoryOf(p.category);
  const c = verticalClasses[cat.vertical];
  return (
    <article
      className={cn(
        "group relative flex flex-col border border-line bg-white transition-[border-color,box-shadow] duration-500 hover:border-navy/25 hover:shadow-[0_24px_48px_-32px_rgba(23,44,72,0.45)] has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-navy",
        wide && "md:grid md:grid-cols-[1.35fr_1fr]",
        className,
      )}
    >
      <div className={cn("relative aspect-[4/3] overflow-hidden bg-navy", wide && "md:aspect-auto md:min-h-[22rem]")}>
        {p.featuredImage ? (
          <Image
            src={p.featuredImage.src}
            alt={p.featuredImage.alt}
            fill
            sizes={wide ? "(min-width: 1024px) 50vw, (min-width: 768px) 55vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"}
            className="object-cover transition-transform duration-700 ease-(--ease-premium) motion-safe:group-hover:scale-[1.04]"
            style={{ objectPosition: p.featuredImage.position }}
          />
        ) : (
          <MediaSlot slot={cat.label} alt={`${p.name} — photograph to follow`} vertical={cat.vertical} className="absolute inset-0 transition-transform duration-700 motion-safe:group-hover:scale-[1.04]" />
        )}
        <span className="absolute top-4 left-4 inline-flex items-center gap-2 bg-white px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-navy transition-colors duration-300 group-hover:bg-navy group-hover:text-white">
          <span aria-hidden className={cn("size-1.5 ring-1 ring-white/60", c.bg)} />
          {cat.label}
        </span>
        <StatusBadge project={p} className="absolute top-4 right-4" />
      </div>

      <div className={cn("flex flex-1 flex-col p-6", wide && "lg:p-10")}>
        <p className="flex flex-wrap items-center gap-2 text-xs text-slate">
          <MapPin aria-hidden className="size-3.5 shrink-0" />
          {locationLabel(p)}
          {!isPublic(p) && <PendingBadge status="pending" />}
        </p>
        <H className={cn("display mt-3 text-navy", wide ? "text-[2rem] lg:text-[2.5rem]" : "text-[1.625rem]")}>{p.name}</H>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate">{p.summary}</p>
        {p.metric && (
          <dl className="mt-5 border-t border-line pt-4">
            <dt className="eyebrow text-gold-ink">{p.metric.label}</dt>
            <dd className="mt-1 font-display text-xl text-navy">{p.metric.value}</dd>
          </dl>
        )}
        <Link
          href={projectHref(p)}
          className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-maroon outline-none after:absolute after:inset-0 group-hover:text-navy"
        >
          View case study
          <span className="sr-only">: {p.name}</span>
          <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}

/** Completed / ongoing — always a text label, never colour alone. */
export function StatusBadge({ project, className, tone = "light" }: { project: Project; className?: string; tone?: "light" | "dark" }) {
  const done = project.projectStatus === "completed";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.14em]",
        tone === "light" ? "bg-navy-deep/80 text-white backdrop-blur-sm" : "border border-white/25 text-white",
        className,
      )}
    >
      <span aria-hidden className={cn("size-1.5 rounded-full", done ? "bg-gold-pale" : "border border-gold-pale")} />
      {statusLabel(project)}
    </span>
  );
}
