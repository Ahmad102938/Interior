import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listedProjects } from "@/content/projects";
import { capabilityGroups } from "@/content/capabilityGroups";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { capabilitiesPage } from "@/content/pages/capabilities";

const c = capabilitiesPage.projects;
/** Illustrative stand-ins, one per capability group — edit in src/content/pages/capabilities.ts. */
const groupImages = c.groupImages;

/**
 * Up to three approved case studies; until any exist, a visual overview of the
 * three capability groups — never a fictional project.
 */
export function CapabilityProjects() {
  const list = listedProjects.slice(0, 3);
  return (
    <section data-nav-theme="light" className="section-y bg-white">
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading {...c.heading} intro={list.length > 0 ? c.introWithProjects : c.introWithoutProjects} />
          <Link href={c.viewAll.href} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b border-navy/25 text-xs font-semibold uppercase tracking-[0.14em] text-navy hover:border-maroon hover:text-maroon lg:self-auto">
            {c.viewAll.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>

        {list.length > 0 ? (
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {list.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} className="h-full" />
              </li>
            ))}
          </ul>
        ) : (
          <ul className="mt-12 grid gap-4 md:grid-cols-3 lg:mt-16">
            {capabilityGroups.map((g, i) => (
              <li key={g.key} className={i === 1 ? "md:translate-y-10" : undefined}>
                <figure className="relative aspect-[4/5] overflow-hidden bg-navy">
                  <Image src={groupImages[g.key].src} alt={groupImages[g.key].alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" style={{ objectPosition: groupImages[g.key].position }} data-reveal-image />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="font-display text-lg text-gold-pale tabular-nums">{g.numbers.join(" · ")}</p>
                    <p className="display mt-1 text-3xl">{g.label}</p>
                    {groupImages[g.key].caption && <p className="mt-3 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-white/60">{groupImages[g.key].caption}</p>}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
