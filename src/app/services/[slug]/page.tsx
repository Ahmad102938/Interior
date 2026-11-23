import { Fragment, Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { services, serviceBySlug, type SectionKey, type ServiceConfig, type Surface } from "@/data/services";
import { HeroShell } from "@/components/ui/PageHero";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceSubnav } from "@/components/services/ServiceSubnav";
import { ServiceOverview } from "@/components/services/ServiceOverview";
import { ServiceCapabilities } from "@/components/services/ServiceCapabilities";
import { ServiceFeature } from "@/components/services/ServiceFeature";
import { ServiceProcess } from "@/components/services/ServiceProcess";
import { ServiceProjects } from "@/components/services/ServiceProjects";
import { ServiceSupport } from "@/components/services/ServiceSupport";
import { ServiceCta } from "@/components/services/ServiceCta";
import { quoteHref } from "@/components/services/shared";

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: { title: `${s.title} | ADIDEV`, description: s.metaDescription, images: [s.heroImage.src] },
  };
}

export default function ServicePage({ params }: PageProps<"/services/[slug]">) {
  return (
    <Suspense fallback={<HeroShell />}>
      <ServiceContent params={params} />
    </Suspense>
  );
}

const sections: Record<SectionKey, { id: string; label: (s: ServiceConfig) => string; render: (s: ServiceConfig, tone: Surface) => React.ReactNode }> = {
  overview: { id: "overview", label: () => "Overview", render: (s, t) => <ServiceOverview s={s} tone={t} /> },
  capabilities: { id: "capabilities", label: () => "Capabilities", render: (s, t) => <ServiceCapabilities s={s} tone={t} /> },
  feature: { id: "scope", label: (s) => s.feature.navLabel, render: (s, t) => <ServiceFeature s={s} tone={t} /> },
  process: { id: "process", label: () => "Process", render: (s, t) => <ServiceProcess s={s} tone={t} /> },
  projects: { id: "projects", label: () => "Projects", render: (s, t) => <ServiceProjects s={s} tone={t} /> },
  support: { id: "support", label: () => "Support", render: (s, t) => <ServiceSupport s={s} tone={t} /> },
};

/** One data-driven template; each division sets its own section order and surfaces. */
async function ServiceContent({ params }: { params: PageProps<"/services/[slug]">["params"] }) {
  const { slug } = await params;
  const s = serviceBySlug(slug);
  if (!s) notFound();
  const nav = [...s.layout.map(({ section }) => ({ id: sections[section].id, label: sections[section].label(s) })), { id: "enquire", label: "Enquire" }];

  return (
    <>
      <ServiceHero s={s} />
      <ServiceSubnav items={nav} quote={quoteHref(s.key)} title={s.title} vertical={s.key} />
      {s.layout.map(({ section, surface }) => (
        <Fragment key={section}>{sections[section].render(s, surface)}</Fragment>
      ))}
      <ServiceCta s={s} />
    </>
  );
}
