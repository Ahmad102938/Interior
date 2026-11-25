"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { inCategory, projectCategories, type Project, type ProjectCategory } from "@/content/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { sharedContent } from "@/content/pages/shared";

const viewAll = sharedContent.projectGallery.viewAll;

/**
 * Home-page portfolio preview: one dominant featured project + supporting grid,
 * with a quick category filter. `viewAllHref` closes the grid with a "View all"
 * tile, so a limited gallery always ends on a full row (featured + 5 + tile).
 * The full, URL-driven explorer lives on /projects.
 */
export function ProjectGallery({ projects, limit, viewAllHref }: { projects: Project[]; limit?: number; viewAllHref?: string }) {
  const available = projectCategories.filter((c) => projects.some((p) => inCategory(p, c.key)));
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const filtered = filter === "all" ? projects : projects.filter((p) => inCategory(p, filter));
  const list = limit ? filtered.slice(0, limit) : filtered;
  const [featured, ...rest] = list;

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")} className="bg-navy">
          {sharedContent.projectGallery.allLabel}
        </FilterButton>
        {available.map((c) => (
          <FilterButton key={c.key} active={filter === c.key} onClick={() => setFilter(c.key)} className={verticalClasses[c.vertical].bg}>
            {c.label}
          </FilterButton>
        ))}
      </div>

      <div aria-live="polite" className="mt-8">
        {featured ? (
          <div className="grid gap-6">
            <ProjectCard project={featured} wide />
            {(rest.length > 0 || viewAllHref) && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
                {viewAllHref && <ViewAllTile href={viewAllHref} />}
              </div>
            )}
          </div>
        ) : (
          <p className="border border-line bg-white p-6 text-slate sm:p-8">{sharedContent.projectGallery.emptyCategory}</p>
        )}
      </div>
    </div>
  );
}

function ViewAllTile({ href }: { href: string }) {
  return (
    <Link
      href={href}
      className="group relative isolate flex min-h-[22rem] flex-col justify-between overflow-hidden bg-navy p-6 text-white sm:p-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#d8c398 1px, transparent 1px), linear-gradient(90deg, #d8c398 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-0 bg-maroon transition-[height] duration-700 ease-(--ease-premium) group-hover:h-full" />
      <p className="eyebrow text-gold-pale">{viewAll.eyebrow}</p>
      <div>
        <p className="display text-[2.25rem] leading-[1.05]">
          {viewAll.title}
          <br />
          <em className="font-normal text-gold-pale">{viewAll.accent}</em>
        </p>
        <p className="mt-3 text-sm text-white/60">{viewAll.copy}</p>
      </div>
      <span className="grid size-14 place-items-center self-end rounded-full border border-gold-pale/50 transition-colors duration-500 group-hover:border-white group-hover:bg-white group-hover:text-maroon">
        <ArrowUpRight aria-hidden className="size-5 transition-transform duration-500 group-hover:rotate-45" />
      </span>
    </Link>
  );
}

function FilterButton({ active, onClick, className, children }: { active: boolean; onClick: () => void; className: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "min-h-11 shrink-0 border px-4 text-xs font-semibold uppercase tracking-[0.12em] transition-colors",
        active ? cn("border-transparent text-white", className) : "border-navy/15 bg-white text-navy hover:border-navy/40",
      )}
    >
      {children}
    </button>
  );
}
