import { Suspense } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, ChevronRight, FileDown, MapPin } from "lucide-react";
import { categoryOf, inCategory, isListed, isPublic, listedProjects, locationLabel, projectBySlug, projects, statusLabel, type Project } from "@/content/projects";
import { services } from "@/content/services";
import { company } from "@/content/company";
import { HeroShell } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { ProjectCard, StatusBadge } from "@/components/ui/ProjectCard";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { Corners, quoteHref } from "@/components/services/shared";
import { BackToProjects } from "@/components/projects/BackToProjects";
import { ProjectMedia } from "@/components/projects/ProjectMedia";
import { cn } from "@/lib/utils";
import { projectsPage } from "@/content/pages/projects";
import { breadcrumbLabels } from "@/content/navigation";

const copy = projectsPage.detail;

// Cache Components requires at least one param; unpublished slugs 404 below.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p || !isListed(p)) return {};
  return {
    title: p.name,
    description: p.summary,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.name} | ADIDEV`, description: p.summary, images: p.featuredImage ? [p.featuredImage.src] : undefined },
    robots: isPublic(p) ? undefined : { index: false },
  };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<HeroShell />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

/** Two or three case studies from the same category first, then the same vertical. */
function relatedTo(p: Project) {
  const score = (o: Project) => (inCategory(o, p.category) || p.tags?.some((t) => inCategory(o, t)) ? 2 : 0) + (o.primaryVertical === p.primaryVertical ? 1 : 0);
  return listedProjects
    .filter((o) => o.slug !== p.slug && score(o) > 0)
    .sort((a, b) => score(b) - score(a))
    .slice(0, 3);
}

/** One template; sections appear only when the project has approved content for them. */
async function ProjectContent({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p || !isListed(p)) notFound();
  const cat = categoryOf(p.category);
  const c = verticalClasses[p.primaryVertical];
  const service = services.find((s) => s.key === p.primaryVertical)!;
  const related = relatedTo(p);
  const hasMedia = (p.gallery?.length ?? 0) + (p.videos?.length ?? 0) > 0;

  const facts = [
    ["Project", p.name],
    ["Client", p.client?.visibility === "public" ? p.client.name : undefined],
    ["Location", locationLabel(p)],
    ["Vertical", service.title],
    ["Category", cat.label],
    ["Status", statusLabel(p)],
    [p.metric?.label ?? "", p.metric?.value],
    ["Duration", p.duration],
  ].filter((f): f is [string, string] => !!f[0] && !!f[1]);

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: breadcrumbLabels.home, item: company.siteUrl },
      { "@type": "ListItem", position: 2, name: breadcrumbLabels.projects, item: `${company.siteUrl}/projects` },
      { "@type": "ListItem", position: 3, name: p.name, item: `${company.siteUrl}/projects/${p.slug}` },
    ],
  };

  return (
    <>
      {isPublic(p) && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />}

      {/* Hero */}
      <section data-nav-theme="overlay" className={cn("relative overflow-hidden text-white", c.bg)}>
        <div className="container-page relative pt-32 pb-14 sm:pb-16 lg:pt-40 lg:pb-20">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
            <nav aria-label="Breadcrumb">
              <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
                <li>
                  <Link href="/" className="hover:text-white">
                    {breadcrumbLabels.home}
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3" />
                  <Link href="/projects" className="hover:text-white">
                    {breadcrumbLabels.projects}
                  </Link>
                </li>
                <li className="flex items-center gap-1.5">
                  <ChevronRight aria-hidden className="size-3" />
                  <span aria-current="page" className="text-white/80">
                    {p.name}
                  </span>
                </li>
              </ol>
            </nav>
            <BackToProjects className="text-white/75 hover:text-gold-pale" />
          </div>

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow flex items-center gap-3 text-gold-pale">
                <span aria-hidden className="h-px w-10 bg-current opacity-60" />
                {cat.label}
              </p>
              <h1 className="display mt-6 text-[2.5rem] sm:text-6xl lg:text-[4rem]">{p.name}</h1>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-white/80">
                {locationLabel(p) && (
                  <span className="inline-flex items-center gap-2">
                    <MapPin aria-hidden className="size-4" />
                    {locationLabel(p)}
                  </span>
                )}
                <StatusBadge project={p} tone="dark" />
                {!isPublic(p) && <PendingBadge status="pending" />}
              </div>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-white/75 lg:text-lg">{p.summary}</p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Button href={quoteHref(p.primaryVertical)} className={cn(p.primaryVertical === "interiors" && "border-gold-pale bg-gold-pale text-maroon hover:border-white hover:bg-white")}>
                  {copy.primaryLabel}
                </Button>
                {hasMedia && (
                  <Button href="#gallery" variant="outline-light">
                    {copy.galleryLabel}
                  </Button>
                )}
              </div>
            </div>
            <figure className="relative">
              <div className="relative aspect-[16/10] overflow-hidden ring-1 ring-white/10 lg:aspect-[4/3]">
                {p.featuredImage ? (
                  <Image src={p.featuredImage.src} alt={p.featuredImage.alt} fill priority sizes="(min-width: 1024px) 52vw, 100vw" className="object-cover" style={{ objectPosition: p.featuredImage.position }} />
                ) : (
                  <MediaSlot slot={cat.label} alt={`${p.name} — photograph to follow`} vertical={p.primaryVertical} className="absolute inset-0" />
                )}
              </div>
              <Corners />
            </figure>
          </div>
        </div>
      </section>

      {/* Information panel + overview, scope and highlights */}
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page grid gap-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-20">
          <aside className="lg:col-start-2 lg:row-start-1">
            <div className="lg:sticky lg:top-28">
              <div className="border-t-2 border-gold bg-ivory p-6 sm:p-8">
                <h2 className="eyebrow text-gold-ink">{copy.infoLabel}</h2>
                <dl className="mt-4 divide-y divide-navy/10">
                  {facts.map(([k, v]) => (
                    <div key={k} className="grid grid-cols-[7.5rem_1fr] gap-4 py-3 text-sm">
                      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-slate">{k}</dt>
                      <dd className="text-charcoal">{v}</dd>
                    </div>
                  ))}
                </dl>
              </div>
              {p.documents && p.documents.length > 0 && (
                <ul className="mt-4 space-y-2">
                  {p.documents.map((d) => (
                    <li key={d.title}>
                      <a href={d.href} download className="group flex min-h-14 items-center gap-4 border border-line px-5 py-3 text-sm text-navy transition-colors hover:border-navy/40">
                        <FileDown aria-hidden className="size-5 shrink-0 text-gold-ink" />
                        <span className="flex-1">
                          <span className="block font-semibold">{d.title}</span>
                          <span className="text-xs text-slate">
                            {d.format}
                            {d.size && ` · ${d.size}`}
                          </span>
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>

          <div className="lg:col-start-1 lg:row-start-1">
            {p.overview && (
              <div>
                <SectionHeading {...copy.overview} />
                <div className="mt-8 max-w-2xl space-y-5 text-base leading-relaxed text-slate lg:text-[1.0625rem]">
                  {p.overview.map((para) => (
                    <p key={para}>{para}</p>
                  ))}
                </div>
              </div>
            )}

            <div className={cn(p.overview && "mt-16 lg:mt-20")}>
              <h2 className="display text-4xl text-navy lg:text-5xl">{copy.scope.title}</h2>
              <p className="mt-3 max-w-xl text-sm text-slate">{copy.scope.intro}</p>
              <ol className="mt-8 grid gap-px border border-line bg-line sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
                {p.scope.map((s, i) => (
                  <li key={s} className="flex gap-4 bg-white p-5">
                    <span className="font-display text-lg text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-sm leading-relaxed text-charcoal">{s}</span>
                  </li>
                ))}
              </ol>
            </div>

            {p.highlights && p.highlights.length > 0 && (
              <div className="mt-16 lg:mt-20">
                <h2 className="display text-4xl text-navy lg:text-5xl">{copy.highlightsTitle}</h2>
                <ol className="mt-8 space-y-px">
                  {p.highlights.map((h, i) => (
                    <li key={`${h}-${i}`} className="relative flex gap-6 border-l-2 border-line py-4 pl-6">
                      <span aria-hidden className={cn("absolute top-5 -left-[5px] size-2 rounded-full", c.bg)} />
                      <span className="w-8 shrink-0 font-display text-2xl text-navy tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                      <span className="pt-1 text-[0.9375rem] leading-relaxed text-charcoal">{h}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      {hasMedia && (
        <section id="gallery" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
          <div className="container-page">
            <SectionHeading {...copy.gallery} className="mb-10 lg:mb-12" />
            <ProjectMedia images={p.gallery ?? []} videos={p.videos} name={p.name} />
          </div>
        </section>
      )}

      {/* Related service and related case studies */}
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <Link href={`/services/${service.slug}`} className={cn("group relative flex flex-col gap-6 overflow-hidden p-6 text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:p-12", c.bg)}>
            <div>
              <p className="eyebrow text-gold-pale">Related service · {service.serviceNumber}</p>
              <p className="display mt-3 text-3xl sm:text-4xl">Explore {service.title}</p>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/70">{service.description}</p>
            </div>
            <span className="grid size-14 shrink-0 place-items-center rounded-full border border-gold-pale/50 transition-colors group-hover:border-white group-hover:bg-white group-hover:text-navy">
              <ArrowUpRight aria-hidden className="size-5 transition-transform group-hover:rotate-45" />
            </span>
          </Link>

          {related.length > 0 && (
            <div className="mt-16 lg:mt-20">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <h2 className="display text-4xl text-navy lg:text-5xl">{copy.relatedTitle}</h2>
                <Link href={`/projects?category=${p.category}`} className="inline-flex min-h-11 items-center gap-2 border-b border-navy/25 text-xs font-semibold uppercase tracking-[0.14em] text-navy hover:border-maroon hover:text-maroon">
                  More in {cat.label}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </div>
              <ul className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {related.map((r) => (
                  <li key={r.slug}>
                    <ProjectCard project={r} className="h-full" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Enquiry */}
      <section data-nav-theme="dark" className="bg-maroon text-white">
        <div className="container-page flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-20">
          <div>
            <h2 className="display text-4xl lg:text-5xl">{copy.cta.title}</h2>
            <p className="mt-3 max-w-xl text-white/75">{copy.cta.copy}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={quoteHref(p.primaryVertical)} className="border-gold-pale bg-gold-pale text-maroon hover:border-white hover:bg-white">
              {copy.primaryLabel}
            </Button>
            <BackToProjects className="px-2 text-gold-pale hover:text-white" />
          </div>
        </div>
      </section>
    </>
  );
}
