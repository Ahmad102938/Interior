import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categoryOf, listedProjects, projectCategories } from "@/data/projects";
import { services } from "@/data/services";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { FeaturedProject } from "@/components/projects/FeaturedProject";
import { ProjectsHeroVisual } from "@/components/projects/ProjectsHeroVisual";
import { ProjectExplorer, ProjectExplorerFromUrl } from "@/components/projects/ProjectExplorer";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Projects & Portfolio",
  description: "Completed and ongoing work across telecom infrastructure, renewable energy, civil construction, industrial facilities and commercial fit-outs.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const list = listedProjects;
  const featured = list.find((p) => p.featured);
  // Figures are counted from the approved dataset only — nothing is typed in by hand.
  const stats =
    list.length > 0
      ? [
          { label: list.length === 1 ? "Project" : "Projects", value: list.length },
          { label: "Categories", value: projectCategories.filter((c) => list.some((p) => p.category === c.key)).length },
        ]
      : [];

  return (
    <>
      <PageHero
        eyebrow="Projects & portfolio"
        title="Proven Through"
        accent="Projects."
        intro="Explore ADIDEV's completed and ongoing work across telecom infrastructure, renewable energy, civil construction, industrial facilities and commercial fit-outs."
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
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
          <Button href={list.length > 0 ? "#portfolio" : "#categories"}>Explore projects</Button>
          <Button href="/request-a-quote" variant="outline-light">
            Request a quote
          </Button>
        </div>
      </PageHero>

      {featured && <FeaturedProject project={featured} />}

      {list.length > 0 ? (
        <section id="portfolio" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
          <div className="container-page">
            <SectionHeading eyebrow="Portfolio" title="Browse" accent="the work." align="split" intro="Filter by category and status. Every case study lists the actual scope delivered on that project." />
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

      <CtaBanner title="Request project references." copy="We can share relevant project references for your scope on request." />
    </>
  );
}

/** Production state until case studies are approved: what will be published, and where to go meanwhile. */
function PortfolioPending() {
  return (
    <section id="categories" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
      <div className="container-page">
        <SectionHeading
          eyebrow="Portfolio"
          title="Case studies are being"
          accent="prepared for publication."
          align="split"
          intro="Project names, clients, figures and photographs are published only once approved. Meanwhile, explore the scope behind each category."
        />
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
