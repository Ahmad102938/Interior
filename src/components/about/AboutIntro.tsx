import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { aboutIntro, companyFacts, aboutPage } from "@/content/pages/about";
import { publishable } from "@/lib/content";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { breadcrumbLabels } from "@/content/navigation";

/**
 * Refined opening — not a second cinematic hero. Two equal-height columns:
 * statement on the left, framed image on the right; company facts run as one
 * full-width rail underneath (only verified facts appear in production).
 */
export function AboutIntro() {
  const facts = publishable(companyFacts);
  return (
    <section data-nav-theme="overlay" className="relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage: "linear-gradient(#d8c398 1px, transparent 1px), linear-gradient(90deg, #d8c398 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />
      <div className="container-page relative pt-32 pb-20 lg:pt-40 lg:pb-24">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-xs text-white/55">
            <li>
              <Link href="/" className="hover:text-white">
                {breadcrumbLabels.home}
              </Link>
            </li>
            <li className="flex items-center gap-1.5">
              <ChevronRight aria-hidden className="size-3" />
              <span aria-current="page" className="text-white/80">
                {breadcrumbLabels.about}
              </span>
            </li>
          </ol>
        </nav>

        <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="flex flex-col">
            <p className="eyebrow flex items-center gap-3 text-gold-pale">
              <span aria-hidden className="h-px w-10 bg-gold-pale/60" />
              {aboutIntro.eyebrow}
            </p>
            <h1 className="display mt-6 text-[2.75rem] sm:text-6xl lg:text-[4.5rem]">
              {aboutIntro.title}
              <br />
              <em className="font-normal text-gold-pale">{aboutIntro.accent}</em>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-white/75 lg:text-[1.0625rem]">{aboutIntro.lead}</p>

            <dl className="mt-auto grid grid-cols-3 border-t border-white/15 pt-6 max-lg:mt-12">
              {aboutIntro.facts.map((f, i) => (
                <div key={f.label} className={i > 0 ? "border-l border-white/15 pl-4 sm:pl-6" : "pr-4 sm:pr-6"}>
                  <dt className="text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/50 sm:text-[0.6875rem]">{f.label}</dt>
                  <dd className="mt-2 font-display text-lg leading-snug text-balance text-white sm:text-xl">{f.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <figure className="relative flex flex-col">
            <div className="relative min-h-[22rem] flex-1 overflow-hidden lg:min-h-[32rem]">
              <Image
                data-reveal-image
                src={aboutPage.intro.image.src}
                alt={aboutPage.intro.image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={{ objectPosition: aboutPage.intro.image.position }}
              />
              <span aria-hidden className="absolute inset-3 border border-gold-pale/30" />
            </div>
            {aboutPage.intro.image.caption && <figcaption className="mt-3 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/45">{aboutPage.intro.image.caption}</figcaption>}
          </figure>
        </div>

        {facts.length > 0 && (
          <dl className="mt-14 grid grid-cols-2 border-t border-white/15 sm:grid-cols-3 lg:grid-cols-5">
            {facts.map((f) => (
              <div key={f.label} className="border-b border-white/10 py-5 pr-4 lg:border-b-0">
                <dt className="flex items-center gap-2 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/50">
                  {f.label}
                  <PendingBadge status={f.status} />
                </dt>
                <dd className="mt-2 text-sm text-white/90">{f.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
