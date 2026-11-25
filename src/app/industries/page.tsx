import type { Metadata } from "next";
import { industries } from "@/content/industries";
import { listedProjects } from "@/content/projects";
import { verticals } from "@/content/verticals";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustriesHeroVisual } from "@/components/industries/IndustriesHeroVisual";
import { IndustryExplorer } from "@/components/industries/IndustryExplorer";
import { VerticalConnections } from "@/components/industries/VerticalConnections";
import { IndustryProjects } from "@/components/industries/IndustryProjects";
import { DeliveryApproach } from "@/components/industries/DeliveryApproach";
import { industriesPage as page } from "@/content/pages/industries";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        {...page.hero.heading}
        crumbs={crumbsFor("industries")}
        aside={<IndustriesHeroVisual />}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href={page.hero.primary.href}>{page.hero.primary.label}</Button>
          <Button href={page.hero.secondary.href} variant="outline-light">
            {page.hero.secondary.label}
          </Button>
        </div>
      </PageHero>

      <IndustryExplorer />
      <VerticalConnections />

      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <SectionHeading {...page.projects.heading} align="split" />
          <div className="mt-12 lg:mt-16">
            <IndustryProjects projects={listedProjects} industries={industries} verticals={verticals.map(({ key, title, slug }) => ({ key, title, slug }))} />
          </div>
        </div>
      </section>

      <DeliveryApproach />
      <CtaBanner {...page.cta} />
    </>
  );
}
