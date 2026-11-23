import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ServiceConfig, Surface } from "@/data/services";
import { inCategory, listedProjects } from "@/data/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { cn } from "@/lib/utils";
import { quoteHref, surface } from "./shared";

/**
 * Approved references for this division only. Until one exists, clearly
 * labelled visual concepts stand in — never a fabricated case study.
 */
export function ServiceProjects({ s, tone }: { s: ServiceConfig; tone: Surface }) {
  const sf = surface(tone, s.key);
  const list = listedProjects.filter((p) => s.projectCategories.some((c) => inCategory(p, c)));
  // Lead with a double-width card only when the rows then fill exactly.
  const lead = list.length > 2 && (list.length + 1) % 3 === 0;
  const all = `/projects?category=${s.projectCategories[0]}`;

  return (
    <section id="projects" data-nav-theme={sf.navTheme} className={cn("section-y scroll-mt-32", sf.className)}>
      <div className="container-page">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Project references"
            title="Proof on"
            accent="the ground."
            intro={`Approved ${s.title.toLowerCase()} references. Names, clients, locations and figures are published only once verified.`}
          />
          <Link href={all} className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start border-b border-navy/25 text-xs font-semibold uppercase tracking-[0.14em] text-navy hover:border-maroon hover:text-maroon lg:self-auto">
            View all projects
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>

        {list.length > 0 ? (
          <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
            {list.map((p, i) => (
              <li key={p.slug} className={cn(i === 0 && lead && "md:col-span-2")}>
                <ProjectCard project={p} wide={i === 0 && lead} className="h-full" />
              </li>
            ))}
          </ul>
        ) : (
          <div className="mt-12 grid gap-4 lg:mt-16 lg:grid-cols-[1.1fr_1fr_1fr]">
            {s.referenceSlots.map((slot, i) => (
              <figure key={slot} className={cn("relative", i === 0 ? "lg:row-span-2" : "")}>
                <MediaSlot slot={slot} alt={`Visual concept: ${slot.toLowerCase()}`} vertical={s.key} className={cn("aspect-[4/3]", i === 0 && "lg:aspect-auto lg:h-full")} />
                <figcaption className="absolute top-3 left-3 bg-black/40 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/85">Visual concept · {slot}</figcaption>
              </figure>
            ))}
            <div className="flex flex-col justify-between gap-6 border border-line bg-white p-6 sm:p-8 lg:col-span-2">
              <div>
                <p className="display text-[1.75rem] text-navy sm:text-3xl">References are being prepared for publication.</p>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">
                  The images above are visual concepts, not project records. References relevant to your scope can be shared on request.
                </p>
              </div>
              <Link href={quoteHref(s.key)} className="inline-flex min-h-12 items-center gap-2 self-start bg-navy px-6 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-navy-deep">
                Request references
                <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
