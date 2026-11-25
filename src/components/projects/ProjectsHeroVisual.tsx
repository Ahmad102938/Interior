import Image from "next/image";
import Link from "next/link";
import { projectCategories, type ProjectImage } from "@/content/projects";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { projectsPage } from "@/content/pages/projects";

/** Edit in src/content/pages/projects.ts (hero.fallbackImage). */
const fallback: ProjectImage = projectsPage.hero.fallbackImage;

/**
 * Hero composition (large screens): the featured project's photograph when one
 * is approved — otherwise an illustrative render — with the six portfolio
 * categories as a quick index into the filtered listing (once there is one).
 * Not `priority`: it is hidden on phones, and a lazy image is never fetched there.
 */
export function ProjectsHeroVisual({ image, index }: { image?: ProjectImage; index: boolean }) {
  const img = image ?? fallback;
  return (
    <div className="relative mt-14 hidden h-[26rem] lg:mt-0 lg:block xl:h-[28rem]">
      <figure className="absolute inset-y-0 right-0 left-[18%] overflow-hidden ring-1 ring-white/10">
        <Image src={img.src} alt={img.alt} fill sizes="(min-width: 1280px) 520px, 42vw" className="object-cover" style={{ objectPosition: img.position }} />
        <div aria-hidden className="absolute inset-0 bg-linear-to-tr from-navy/70 via-navy/15 to-transparent" />
        {!image && fallback.caption && <figcaption className="absolute right-3 bottom-3 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/75">{fallback.caption}</figcaption>}
      </figure>
      {index && (
      <nav aria-label={projectsPage.hero.categoriesLabel} className="absolute bottom-8 left-0 w-[52%] bg-navy-deep/95 p-6 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-sm">
        <p className="eyebrow text-gold-pale">{projectsPage.hero.categoriesLabel}</p>
        <ul className="mt-4 space-y-0.5">
          {projectCategories.map((c, i) => (
            <li key={c.key}>
              <Link href={`/projects?category=${c.key}#portfolio`} className="group flex items-center gap-3 py-1.5 text-[0.8125rem] text-white/80 transition-colors hover:text-gold-pale">
                <span className="w-5 font-display text-sm text-gold-pale/80 tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span aria-hidden className={cn("size-1.5 ring-1 ring-white/40", verticalClasses[c.vertical].bg)} />
                {c.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      )}
    </div>
  );
}
