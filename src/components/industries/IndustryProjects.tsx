"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import { inCategory, type Project } from "@/content/projects";
import type { Industry } from "@/content/industries";
import type { Vertical } from "@/content/verticals";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { industriesPage } from "@/content/pages/industries";

const copy = industriesPage.projects;

type Props = {
  /** Approved projects only (filtered on the server). */
  projects: Project[];
  industries: Industry[];
  verticals: Pick<Vertical, "key" | "title" | "slug">[];
  /** Pre-select one industry (detail pages hide the filter). */
  only?: string;
};

const matches = (ind: Industry, p: Project) => ind.projectCategories.some((c) => inCategory(p, c));

/**
 * Project proof, filterable by industry. Only approved projects are passed in;
 * where a sector has none, it shows what we deliver there instead of a case study.
 */
export function IndustryProjects({ projects, industries, verticals, only }: Props) {
  const [filter, setFilter] = useState<string>(only ?? "all");
  const industry = industries.find((i) => i.slug === filter);
  const list = industry ? projects.filter((p) => matches(industry, p)) : projects;
  // Lead with a double-width card only when the rows then fill exactly (no orphan on the last row).
  const lead = list.length > 2 && (list.length + 1) % 3 === 0;

  return (
    <div>
      {!only && (
        <div role="group" aria-label="Filter projects by industry" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-2 [scrollbar-width:none] md:mx-0 md:flex-wrap md:px-0">
          <Chip active={filter === "all"} onClick={() => setFilter("all")}>
            {copy.allLabel}
          </Chip>
          {industries.map((i) => (
            <Chip key={i.slug} active={filter === i.slug} onClick={() => setFilter(i.slug)} dot={verticalClasses[i.relatedVerticals[0]].bg}>
              {i.name}
            </Chip>
          ))}
        </div>
      )}

      <div aria-live="polite" className={cn(!only && "mt-8")}>
        {list.length > 0 ? (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {list.map((p, i) => (
              <li key={p.slug} className={cn(i === 0 && lead && "md:col-span-2")}>
                <ProjectCard project={p} wide={i === 0 && lead} className="h-full" />
              </li>
            ))}
          </ul>
        ) : industry ? (
          <CapabilityOverview industry={industry} verticals={verticals} />
        ) : (
          <div className="flex flex-col gap-6 border border-line bg-white p-6 sm:p-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="display text-[1.75rem] text-navy sm:text-3xl">{copy.empty.title}</p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
                {copy.empty.copy}
              </p>
            </div>
            <Link href={copy.empty.cta.href} className="inline-flex min-h-12 shrink-0 items-center gap-2 self-start bg-navy px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy-deep lg:self-auto">
              {copy.empty.cta.label}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function CapabilityOverview({ industry, verticals }: { industry: Industry; verticals: Props["verticals"] }) {
  const related = industry.relatedVerticals.map((k) => verticals.find((v) => v.key === k)!);
  return (
    <div className="grid gap-8 border border-line bg-white p-6 sm:p-10 lg:grid-cols-[1fr_1.2fr] lg:gap-14">
      <div>
        <p className="eyebrow text-gold-ink">{copy.noReference.eyebrow}</p>
        <p className="display mt-3 text-[1.75rem] text-navy sm:text-3xl">{industry.name}</p>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-slate">
          {copy.noReference.copy}
        </p>
        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-1">
          {related.map((v) => (
            <Link key={v.key} href={`/services/${v.slug}`} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:text-navy">
              {v.title}
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          ))}
        </div>
      </div>
      <ul className="grid content-start gap-px border border-line bg-line sm:grid-cols-2">
        {industry.requirements.map((r) => (
          <li key={r} className="flex gap-3 bg-white p-4 text-sm leading-relaxed text-charcoal">
            <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", verticalClasses[industry.relatedVerticals[0]].text)} />
            {r}
          </li>
        ))}
      </ul>
    </div>
  );
}

function Chip({ active, onClick, dot, children }: { active: boolean; onClick: () => void; dot?: string; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex min-h-11 shrink-0 items-center gap-2 border px-4 text-xs font-semibold whitespace-nowrap uppercase tracking-[0.1em] transition-colors",
        active ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40",
      )}
    >
      {dot && <span aria-hidden className={cn("size-2 ring-1 ring-white/50", dot)} />}
      {children}
    </button>
  );
}
