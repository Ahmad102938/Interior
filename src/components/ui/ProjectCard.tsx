import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Project } from "@/data/projects";
import { projectCategories } from "@/data/projects";
import { cn } from "@/lib/utils";
import { MediaSlot } from "./MediaSlot";
import { VerticalBadge } from "./VerticalBadge";
import { PendingBadge } from "./PendingBadge";

export function ProjectCard({ project, featured = false, className }: { project: Project; featured?: boolean; className?: string }) {
  const category = projectCategories.find((c) => c.key === project.category);
  return (
    <article className={cn("group flex flex-col border border-line bg-white", featured && "lg:grid lg:grid-cols-[1.35fr_1fr]", className)}>
      <div className="relative">
        <MediaSlot
          slot={project.imageSlot}
          alt={project.name}
          vertical={project.vertical}
          className={cn("aspect-[4/3]", featured && "lg:aspect-auto lg:h-full lg:min-h-[26rem]")}
          sizes={featured ? "(min-width: 1024px) 60vw, 100vw" : "(min-width: 1024px) 33vw, 100vw"}
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <VerticalBadge vertical={project.vertical}>{category?.label}</VerticalBadge>
        </div>
      </div>
      <div className={cn("flex flex-1 flex-col p-6", featured && "lg:p-10")}>
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden className="size-3.5" />
            {project.location}
          </span>
          <span aria-hidden>·</span>
          <span>{project.projectStatus}</span>
          <PendingBadge status={project.status} />
        </div>
        <h3 className={cn("display mt-3 text-navy", featured ? "text-[2rem] lg:text-[2.5rem]" : "text-[1.625rem]")}>{project.name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-slate">{project.scope}</p>
        {featured && (
          <dl className="mt-6 grid grid-cols-2 gap-4 border-t border-line pt-6 text-sm">
            {project.client && (
              <div>
                <dt className="eyebrow text-gold-ink">Client</dt>
                <dd className="mt-1.5 text-charcoal">{project.client}</dd>
              </div>
            )}
            {project.capacity && (
              <div>
                <dt className="eyebrow text-gold-ink">Capacity / area</dt>
                <dd className="mt-1.5 text-charcoal">{project.capacity}</dd>
              </div>
            )}
          </dl>
        )}
        <Link
          href={`/projects/${project.slug}`}
          className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-6 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:text-navy"
        >
          View case study
          <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
}
