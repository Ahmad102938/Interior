"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronDown, Search, X } from "lucide-react";
import { categoryOf, projectCategories, type Project } from "@/data/projects";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { applyQuery, isFiltered, LISTING_KEY, PAGE_SIZE, parseQuery, toSearch, type Query } from "./query";

const BASE = "/projects";
// Extra controls appear only once the real portfolio is large enough to need them.
const SEARCH_FROM = 12;
const LOCATION_FROM = { projects: 8, states: 3 };

/** Reads the filter state from the URL. Wrap in <Suspense>; the fallback is the unfiltered list. */
export function ProjectExplorerFromUrl({ projects }: { projects: Project[] }) {
  const sp = useSearchParams();
  return <ProjectExplorer projects={projects} query={parseQuery(new URLSearchParams(sp.toString()))} />;
}

/**
 * Category + status (+ location / search when useful) over one canonical list.
 * State lives in the URL via the History API, so filtered views are shareable,
 * survive refresh, restore with back/forward and never reset scroll.
 */
export function ProjectExplorer({ projects, query }: { projects: Project[]; query: Query }) {
  const search = toSearch(query);
  const searchRef = useRef<HTMLInputElement>(null);
  const gridRef = useRef<HTMLUListElement>(null);
  const debounce = useRef<ReturnType<typeof setTimeout>>(undefined);
  /** Index of the first card added by "Load more" — focused once it renders. */
  const focusFrom = useRef<number | null>(null);

  // Remember this view so a case study's "Back to projects" returns to it.
  useEffect(() => {
    try {
      sessionStorage.setItem(LISTING_KEY, BASE + search);
    } catch {}
    // Keep the search box in step with back/forward navigation (unless the user is typing).
    if (searchRef.current && document.activeElement !== searchRef.current) searchRef.current.value = query.q ?? "";
  }, [search, query.q]);

  const href = (next: Partial<Query>) => BASE + toSearch({ ...query, page: 1, ...next });
  const go = (next: Partial<Query>, replace = false) => {
    const url = href(next);
    if (replace) history.replaceState(null, "", url);
    else history.pushState(null, "", url);
  };
  /** Plain links that upgrade to History API updates — still work with modifier keys or without JS. */
  const linkProps = (next: Partial<Query>) => ({
    href: href(next),
    onClick: (e: React.MouseEvent) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
      e.preventDefault();
      go(next);
    },
  });

  const list = applyQuery(projects, query);
  const shown = list.slice(0, query.page * PAGE_SIZE);
  const lead = shown.length > 2 && (shown.length + 1) % 3 === 0;
  const catCount = (key?: Query["category"]) => applyQuery(projects, { ...query, category: key }).length;
  const statusCount = (s?: Query["status"]) => applyQuery(projects, { ...query, status: s }).length;
  const states = [...new Set(projects.map((p) => p.location.state))].sort();
  const showLocation = projects.length >= LOCATION_FROM.projects && states.length >= LOCATION_FROM.states;
  const showSearch = projects.length >= SEARCH_FROM;
  const filtered = isFiltered(query);

  useEffect(() => {
    if (focusFrom.current === null) return;
    gridRef.current?.querySelectorAll<HTMLAnchorElement>("li a")[focusFrom.current]?.focus();
    focusFrom.current = null;
  }, [shown.length]);

  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-navy/10 pb-6 lg:gap-5">
        {/* Categories: compact chips from tablet up; a native select on phones */}
        <div className="hidden md:block">
          <p id="cat-label" className="sr-only">
            Project category
          </p>
          <ul aria-labelledby="cat-label" className="flex flex-wrap gap-2">
            {[undefined, ...projectCategories.map((c) => c.key)].map((key) => {
              const active = query.category === key;
              const cat = key && categoryOf(key);
              return (
                <li key={key ?? "all"}>
                  <a
                    {...linkProps({ category: key })}
                    aria-current={active ? "true" : undefined}
                    className={cn(
                      "inline-flex h-9 items-center gap-2 border px-3.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors",
                      active ? "border-navy bg-navy text-white" : "border-navy/15 bg-white text-navy hover:border-navy/40",
                    )}
                  >
                    {cat ? <span aria-hidden className={cn("size-1.5", verticalClasses[cat.vertical].bg, active && "ring-1 ring-white/60")} /> : active && <span aria-hidden className="size-1.5 bg-gold" />}
                    {cat ? cat.label : "All projects"}
                    <span className={cn("tabular-nums", active ? "text-gold-pale" : "text-slate")}>{catCount(key)}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="relative min-w-0 flex-1 basis-full md:hidden">
            <span className="sr-only">Project category</span>
            <select
              value={query.category ?? ""}
              onChange={(e) => go({ category: (e.target.value || undefined) as Query["category"] })}
              className="h-11 w-full appearance-none border border-navy/15 bg-white pr-10 pl-4 text-sm font-semibold text-navy"
            >
              <option value="">All projects ({catCount(undefined)})</option>
              {projectCategories.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.label} ({catCount(c.key)})
                </option>
              ))}
            </select>
            <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-navy/60" />
          </label>

          <div role="group" aria-label="Project status" className="inline-flex border border-navy/15 bg-white p-0.5">
            {([undefined, "completed", "ongoing"] as const).map((s) => {
              const active = query.status === s;
              return (
                <a
                  key={s ?? "all"}
                  {...linkProps({ status: s })}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "inline-flex h-9 items-center gap-1.5 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] transition-colors sm:px-3.5",
                    active ? "bg-maroon text-white" : "text-navy hover:bg-ivory",
                  )}
                >
                  {s === "completed" ? "Completed" : s === "ongoing" ? "Ongoing" : "All statuses"}
                  <span className={cn("tabular-nums", active ? "text-gold-pale" : "text-slate")}>{statusCount(s)}</span>
                </a>
              );
            })}
          </div>

          {showLocation && (
            <label className="relative">
              <span className="sr-only">Location</span>
              <select
                value={query.location ?? ""}
                onChange={(e) => go({ location: e.target.value || undefined })}
                className="h-10 appearance-none border border-navy/15 bg-white pr-9 pl-3 text-xs font-semibold uppercase tracking-[0.1em] text-navy"
              >
                <option value="">All locations</option>
                {states.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-2.5 size-4 -translate-y-1/2 text-navy/60" />
            </label>
          )}

          {showSearch && (
            <label className="relative ml-auto w-full sm:w-64">
              <span className="sr-only">Search by project name or location</span>
              <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-navy/50" />
              <input
                ref={searchRef}
                type="search"
                defaultValue={query.q}
                placeholder="Search projects or locations"
                onChange={(e) => {
                  clearTimeout(debounce.current);
                  const v = e.target.value.trim();
                  debounce.current = setTimeout(() => go({ q: v || undefined }, true), 250);
                }}
                className="h-10 w-full border border-navy/15 bg-white pr-3 pl-9 text-sm text-navy placeholder:text-slate/70"
              />
            </label>
          )}
        </div>
      </div>

      {/* Results summary */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate">
          {list.length === 0 ? (
            "No projects found for the selected filters."
          ) : (
            <>
              Showing <strong className="font-semibold text-navy tabular-nums">{shown.length}</strong> of <span className="tabular-nums">{list.length}</span> {list.length === 1 ? "project" : "projects"}
              {query.category && <> in {categoryOf(query.category).label}</>}
              {query.status && <> · {query.status === "completed" ? "Completed" : "Ongoing"}</>}
              {query.location && <> · {query.location}</>}
              {query.q && <> · “{query.q}”</>}
            </>
          )}
        </p>
        {filtered && (
          <a {...linkProps({ category: undefined, status: undefined, location: undefined, q: undefined })} className="inline-flex min-h-11 items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:text-navy">
            <X aria-hidden className="size-3.5" />
            Clear filters
          </a>
        )}
      </div>

      {list.length > 0 ? (
        <>
          <ul ref={gridRef} key={search.replace(/&?page=\d+/, "")} className="mt-6 grid animate-panel-in gap-6 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p, i) => (
              <li key={p.slug} className={cn(i === 0 && lead && "md:col-span-2")}>
                <ProjectCard project={p} wide={i === 0 && lead} className="h-full" />
              </li>
            ))}
          </ul>
          {shown.length < list.length && (
            <div className="mt-10 flex justify-center">
              <a
                href={BASE + toSearch({ ...query, page: query.page + 1 })}
                onClick={(e) => {
                  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
                  e.preventDefault();
                  focusFrom.current = shown.length;
                  history.pushState(null, "", BASE + toSearch({ ...query, page: query.page + 1 }));
                }}
                className="inline-flex min-h-12 items-center gap-2 border border-navy/25 bg-white px-6 text-xs font-semibold uppercase tracking-[0.14em] text-navy transition-colors hover:border-navy hover:bg-navy hover:text-white"
              >
                Load more projects
                <span className="text-slate tabular-nums">({list.length - shown.length})</span>
              </a>
            </div>
          )}
        </>
      ) : (
        <div className="mt-6 flex flex-col items-start gap-4 border border-line bg-white p-6 sm:p-10">
          <p className="display text-[1.75rem] text-navy sm:text-3xl">No projects found for the selected filters.</p>
          <a
            {...linkProps({ category: undefined, status: undefined, location: undefined, q: undefined })}
            className="inline-flex min-h-12 items-center gap-2 bg-navy px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy-deep"
          >
            Clear filters
          </a>
        </div>
      )}
    </div>
  );
}
