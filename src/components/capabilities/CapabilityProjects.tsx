import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { listedProjects } from "@/data/projects";
import { capabilityGroups } from "@/data/capabilityGroups";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectCard } from "@/components/ui/ProjectCard";

/** Illustrative stand-ins, one per capability group, used only until approved references exist. */
const groupImages: Record<string, { src: string; alt: string }> = {
  "pre-construction": { src: "/images/posters/stage-1.jpg", alt: "Building massing set out on a site plan — illustrative visualisation" },
  "field-execution": { src: "/images/verticals/civil.jpg", alt: "Steel shed frame rising on RCC pedestals — illustrative visualisation" },
  "quality-completion": { src: "/images/posters/stage-4.jpg", alt: "Completed workplace interior — illustrative visualisation" },
};

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
          <SectionHeading
            eyebrow="Project evidence"
            title="Capabilities"
            accent="Put Into Practice."
            intro={list.length > 0 ? "Selected case studies, each listing the scope actually delivered." : "Approved project references are being prepared for publication. Until then, this is how the capability groups come together on site."}
          />
          <Link href="/projects" className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b border-navy/25 text-xs font-semibold uppercase tracking-[0.14em] text-navy hover:border-maroon hover:text-maroon lg:self-auto">
            View all projects
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
                  <Image src={groupImages[g.key].src} alt={groupImages[g.key].alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" data-reveal-image />
                  <div aria-hidden className="absolute inset-0 bg-linear-to-t from-navy-deep/90 via-navy-deep/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-6 text-white">
                    <p className="font-display text-lg text-gold-pale tabular-nums">{g.numbers.join(" · ")}</p>
                    <p className="display mt-1 text-3xl">{g.label}</p>
                    <p className="mt-3 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-white/60">Illustrative visualisation</p>
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
