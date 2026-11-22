import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects, projectBySlug, projectCategories } from "@/data/projects";
import { isPublishable } from "@/lib/content";
import { PageHero, HeroShell } from "@/components/ui/PageHero";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";

// Cache Components requires at least one param; unpublished slugs 404 below.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p || !isPublishable(p.status)) return {};
  return { title: p.name, description: p.scope, alternates: { canonical: `/projects/${p.slug}` } };
}

export default function ProjectPage({ params }: PageProps<"/projects/[slug]">) {
  return (
    <Suspense fallback={<HeroShell />}>
      <ProjectContent params={params} />
    </Suspense>
  );
}

async function ProjectContent({ params }: { params: PageProps<"/projects/[slug]">["params"] }) {
  const { slug } = await params;
  const p = projectBySlug(slug);
  if (!p || !isPublishable(p.status)) notFound();
  const c = verticalClasses[p.vertical];
  const category = projectCategories.find((x) => x.key === p.category);
  const facts = [
    ["Client", p.client],
    ["Location", p.location],
    ["Vertical", category?.label],
    ["Area / capacity", p.capacity],
    ["Duration", p.duration],
    ["Status", p.projectStatus],
  ].filter((f): f is [string, string] => !!f[1]);

  return (
    <>
      <PageHero
        eyebrow={category?.label ?? "Project"}
        title={p.name}
        intro={p.scope}
        bg={c.bg}
        accentClass={c.accent}
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: p.name }]}
      >
        <div className="mt-6">
          <PendingBadge status={p.status} />
        </div>
      </PageHero>
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <dl className="divide-y divide-line border-y border-line">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-6 py-4 text-sm">
                  <dt className="eyebrow text-gold-ink">{k}</dt>
                  <dd className="text-right text-charcoal">{v}</dd>
                </div>
              ))}
            </dl>
            <h2 className="display mt-12 text-3xl text-navy">Execution highlights</h2>
            <ul className="mt-5 space-y-3">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm text-charcoal">
                  <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-gold" />
                  {h}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <MediaSlot slot={`${p.imageSlot} — before`} alt={`${p.name} — before`} vertical={p.vertical} className="aspect-[4/3] sm:col-span-2" />
            <MediaSlot slot="During execution" alt={`${p.name} — during execution`} vertical={p.vertical} className="aspect-[4/3]" />
            <MediaSlot slot="Completed" alt={`${p.name} — completed`} vertical={p.vertical} className="aspect-[4/3]" />
          </div>
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
