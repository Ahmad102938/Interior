"use client";

import { useMemo, useState } from "react";
import type { Project, ProjectCategory } from "@/data/projects";
import { projectCategories } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";

/** Editorial portfolio: one dominant featured project + varied supporting grid, with filters. */
export function ProjectGallery({ projects, limit }: { projects: Project[]; limit?: number }) {
  const [filter, setFilter] = useState<ProjectCategory | "all">("all");
  const available = projectCategories.filter((c) => projects.some((p) => p.category === c.key));
  const list = useMemo(() => {
    const filtered = filter === "all" ? projects : projects.filter((p) => p.category === filter);
    return limit ? filtered.slice(0, limit) : filtered;
  }, [projects, filter, limit]);
  const [featured, ...rest] = list;

  return (
    <div>
      <div role="group" aria-label="Filter projects by category" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
        <FilterButton active={filter === "all"} onClick={() => setFilter("all")} className="bg-navy">
          All projects
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
            <ProjectCard project={featured} featured />
            {rest.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="border border-line bg-white p-8 text-slate">No published projects in this category yet.</p>
        )}
      </div>
    </div>
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
