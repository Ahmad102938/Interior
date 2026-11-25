import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { industries, industryBySlug, industryHref } from "@/content/industries";
import { capabilities } from "@/content/capabilities";
import { listedProjects } from "@/content/projects";
import { serviceHref, verticalByKey, verticals } from "@/content/verticals";
import { PageHero, HeroShell } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustryProjects } from "@/components/industries/IndustryProjects";
import { cn } from "@/lib/utils";
import { industriesPage } from "@/content/pages/industries";
import { breadcrumbLabels } from "@/content/navigation";

const copy = industriesPage.detail;

export function generateStaticParams() {
  return industries.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/industries/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) return {};
  return {
    title: `${ind.name} — Industries`,
    description: ind.shortDescription,
    alternates: { canonical: industryHref(ind) },
    openGraph: { title: `${ind.name} | ADIDEV`, description: ind.shortDescription },
  };
}

export default function IndustryPage({ params }: PageProps<"/industries/[slug]">) {
  return (
    <Suspense fallback={<HeroShell />}>
      <IndustryContent params={params} />
    </Suspense>
  );
}

/** Shared template for every industry: overview → requirements → capabilities → references → enquiry. */
async function IndustryContent({ params }: { params: PageProps<"/industries/[slug]">["params"] }) {
  const { slug } = await params;
  const ind = industryBySlug(slug);
  if (!ind) notFound();
  const index = industries.indexOf(ind);
  const prev = industries[(index - 1 + industries.length) % industries.length];
  const next = industries[(index + 1) % industries.length];
  const related = ind.relatedVerticals.map(verticalByKey);
  const primary = related[0];
  const c = verticalClasses[ind.brandAccent];

  return (
    <>
      <PageHero
        eyebrow={`${ind.id} — ${copy.eyebrowSuffix}`}
        title={ind.name}
        intro={ind.shortDescription}
        bg={c.bg}
        accentClass={c.accent}
        image={{ src: ind.image.src, alt: ind.image.alt, caption: ind.image.caption }}
        crumbs={[{ label: breadcrumbLabels.home, href: "/" }, { label: breadcrumbLabels.industries, href: "/industries" }, { label: ind.name }]}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href={copy.primary.href}>{copy.primary.label}</Button>
          <Button href={serviceHref(primary)} variant="outline-light">
            {copy.secondaryLabel.replace("{vertical}", primary.shortTitle)}
          </Button>
        </div>
      </PageHero>

      {/* Overview: where the work happens, and what it typically involves */}
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading {...copy.environment} />
            <p className="mt-6 max-w-xl font-display text-2xl leading-snug text-navy">{ind.environment}</p>
          </div>
          <div>
            <p className="eyebrow text-gold-ink">{copy.requirementsLabel}</p>
            <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2" data-reveal>
              {ind.requirements.map((r) => (
                <li key={r} className="flex gap-3 bg-white p-5 text-sm leading-relaxed text-charcoal">
                  <Check aria-hidden className={cn("mt-0.5 size-4 shrink-0", verticalClasses[primary.key].text)} />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs leading-relaxed text-slate">
              Scope is confirmed per project. The full service scope is listed on the {related.map((v) => v.title).join(" and ")} {related.length > 1 ? "pages" : "page"}.
            </p>
          </div>
        </div>
      </section>

      {/* Capabilities: the related verticals, then the disciplines common to all */}
      <section data-nav-theme="light" className="section-y bg-ivory">
        <div className="container-page">
          <SectionHeading {...copy.capabilities} />
          <ul className="mt-12 grid gap-4 md:grid-cols-2">
            {related.map((v) => (
              <li key={v.key} className="group relative flex flex-col border border-line bg-white p-6 sm:p-8" data-reveal>
                <span aria-hidden className={cn("absolute top-0 left-0 h-1 w-16", verticalClasses[v.key].bg)} />
                <span className="font-display text-lg text-gold-ink tabular-nums">{v.number}</span>
                <h3 className="display mt-2 text-3xl text-navy">{v.title}</h3>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate">{v.summary}</p>
                <Link
                  href={serviceHref(v)}
                  className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-5 text-xs font-semibold uppercase tracking-[0.14em] text-maroon after:absolute after:inset-0 hover:text-navy"
                >
                  {copy.viewService}
                  <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </Link>
              </li>
            ))}
            {/* The six disciplines common to every vertical: beside a single vertical, otherwise below */}
            <li className={cn("border border-line bg-white p-6 sm:p-8", related.length > 1 && "md:col-span-2")} data-reveal>
              <p className="eyebrow text-gold-ink">{copy.deliveredWithLabel}</p>
              <ul className={cn("mt-4 grid gap-x-6 sm:grid-cols-2", related.length > 1 && "lg:grid-cols-3")}>
                {capabilities.map((cap) => (
                  <li key={cap.number}>
                    <Link href="/capabilities" className="group flex min-h-11 items-center gap-3 border-b border-line text-sm text-navy hover:text-maroon">
                      <span className="font-display text-base text-gold-ink tabular-nums">{cap.number}</span>
                      {cap.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          </ul>
        </div>
      </section>

      {/* Approved references only; otherwise a capability overview */}
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <SectionHeading {...copy.references} />
          <div className="mt-12">
            <IndustryProjects only={ind.slug} projects={listedProjects} industries={[ind]} verticals={verticals.map(({ key, title, slug }) => ({ key, title, slug }))} />
          </div>
        </div>
      </section>

      {/* Neighbouring sectors */}
      <nav aria-label="Other industries" className="border-t border-line bg-ivory">
        <div className="container-page grid grid-cols-2">
          <Link href={industryHref(prev)} className="group flex min-h-24 flex-col justify-center gap-1 border-r border-line py-6 pr-4">
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-slate">
              <ArrowLeft aria-hidden className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
              {copy.previous}
            </span>
            <span className="display text-xl text-navy sm:text-2xl">{prev.name}</span>
          </Link>
          <Link href={industryHref(next)} className="group flex min-h-24 flex-col items-end justify-center gap-1 py-6 pl-4 text-right">
            <span className="inline-flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-slate">
              {copy.next}
              <ArrowRight aria-hidden className="size-3.5 transition-transform group-hover:translate-x-0.5" />
            </span>
            <span className="display text-xl text-navy sm:text-2xl">{next.name}</span>
          </Link>
        </div>
      </nav>

      <CtaBanner {...industriesPage.cta} />
    </>
  );
}
