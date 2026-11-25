import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryOf, listedProjects, projectCategories } from "@/content/projects";
import { services } from "@/content/services";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectsHeroVisual } from "@/components/projects/ProjectsHeroVisual";
import { ProjectExplorer, ProjectExplorerFromUrl } from "@/components/projects/ProjectExplorer";
import { cn } from "@/lib/utils";
import { projectsPage as page } from "@/content/pages/projects";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const list = listedProjects;
  const featured = list.find((p) => p.featured);
  // Figures are counted from the approved dataset only — nothing is typed in by hand.
  const stats =
    list.length > 0
      ? [
          { label: list.length === 1 ? page.hero.stats.project : page.hero.stats.projects, value: list.length },
          { label: page.hero.stats.categories, value: projectCategories.filter((c) => list.some((p) => p.category === c.key)).length },
        ]
      : [];

  return (
    <>
      <PageHero
        {...page.hero.heading}
        crumbs={crumbsFor("projects")}
        aside={<ProjectsHeroVisual image={featured?.featuredImage} index={list.length > 0} />}
      >
        {stats.length > 0 && (
          <dl className="mt-8 flex gap-10 border-t border-white/15 pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <dt className="eyebrow text-white/60">{s.label}</dt>
                <dd className="display mt-1 text-4xl text-white tabular-nums">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href={list.length > 0 ? "#portfolio" : "#categories"}>{page.hero.primaryLabel}</Button>
          <Button href={page.hero.secondary.href} variant="outline-light">
            {page.hero.secondary.label}
          </Button>
        </div>
      </PageHero>

      {featured && <FeaturedProject project={featured} />}

      {list.length > 0 ? (
        <section id="portfolio" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
          <div className="container-page">
            <SectionHeading {...page.portfolio.heading} align="split" />
            <div className="mt-10 lg:mt-14">
              <Suspense fallback={<ProjectExplorer projects={list} query={{ page: 1 }} />}>
                <ProjectExplorerFromUrl projects={list} />
              </Suspense>
            </div>
          </div>
        </section>
      ) : (
        <PortfolioPending />
      )}

      <CtaBanner {...page.cta} />
    </>
  );
}

/** Production state until case studies are approved: what will be published, and where to go meanwhile. */
function PortfolioPending() {
  return (
    <section id="categories" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
      <div className="container-page">
        <SectionHeading {...page.portfolio.pendingHeading} align="split" />
        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
          {projectCategories.map((c, i) => {
            const service = services.find((s) => s.key === c.vertical)!;
            return (
              <li key={c.key}>
                <Link href={`/services/${service.slug}`} className="group flex h-full flex-col bg-white p-6 transition-colors hover:bg-ivory-soft sm:p-8">
                  <span className="flex items-center gap-3">
                    <span className="font-display text-lg text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span aria-hidden className={cn("size-2", verticalClasses[categoryOf(c.key).vertical].bg)} />
                  </span>
                  <span className="display mt-3 text-2xl text-navy">{c.label}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-maroon group-hover:text-navy">
                    {service.title}
                    <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
