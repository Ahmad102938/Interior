import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Check } from "lucide-react";
import { verticals, verticalBySlug, verticalImage } from "@/data/verticals";
import { projects } from "@/data/projects";
import { publishable } from "@/lib/content";
import { PageHero, HeroShell } from "@/components/ui/PageHero";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { ProjectCard } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return verticals.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const v = verticalBySlug(slug);
  if (!v) return {};
  return {
    title: v.title,
    description: v.summary,
    alternates: { canonical: `/services/${v.slug}` },
    openGraph: { title: `${v.title} | ADIDEV`, description: v.summary },
  };
}

export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<HeroShell />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

async function ServiceContent({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const v = verticalBySlug(slug);
  if (!v) notFound();
  const c = verticalClasses[v.key];
  const related = publishable(projects).filter((p) => p.vertical === v.key);

  return (
    <>
      <PageHero
        eyebrow={`${v.number} — ${v.title}`}
        title={v.headline}
        intro={v.summary}
        bg={c.bg}
        accentClass={c.accent}
        image={{ src: verticalImage(v), alt: `${v.title} — illustrative visualisation`, caption: "Illustrative visualisation" }}
        crumbs={[{ label: "Home", href: "/" }, { label: "Services", href: "/services" }, { label: v.title }]}
      />

      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading eyebrow="Services" title="What we deliver." intro="Scope is confirmed per project. Delivery may combine in-house teams with qualified partners, identified clearly at proposal stage." />
          <ul className="grid gap-px border border-line bg-line sm:grid-cols-2" data-reveal>
            {v.services.map((s) => (
              <li key={s} className="flex gap-3 bg-white p-5 text-sm leading-relaxed text-charcoal">
                <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", c.text)} />
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section data-nav-theme="light" className="section-y bg-ivory">
        <div className="container-page">
          <SectionHeading eyebrow="Process" title="How the work moves." />
          <ol className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6" data-reveal>
            {v.process.map((step, i) => (
              <li key={step} className="relative bg-white p-6">
                <span className={cn("font-display text-3xl", c.text)}>{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-sm font-semibold text-navy">{step}</p>
                {i < v.process.length - 1 && <span aria-hidden className="absolute top-9 right-0 hidden h-px w-6 translate-x-1/2 bg-gold lg:block" />}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <SectionHeading eyebrow="Project imagery" title="On site." intro="Approved project photographs will appear here." />
          <div className="mt-12 grid gap-4 md:grid-cols-3" data-reveal>
            {v.imageSlots.map((slot, i) => (
              <MediaSlot key={slot} slot={slot} alt={slot} vertical={v.key} className={cn("aspect-[4/3]", i === 0 && "md:col-span-2 md:aspect-auto")} />
            ))}
          </div>
          {related.length > 0 && (
            <div className="mt-20">
              <h2 className="display text-4xl text-navy">Related projects</h2>
              <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <ProjectCard key={p.slug} project={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBanner title={`Discuss a ${v.shortTitle.toLowerCase()} project.`} />
    </>
  );
}
