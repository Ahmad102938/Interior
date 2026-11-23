import type { Metadata } from "next";
import { industries } from "@/data/industries";
import { listedProjects } from "@/data/projects";
import { verticals } from "@/data/verticals";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { IndustriesHeroVisual } from "@/components/industries/IndustriesHeroVisual";
import { IndustryExplorer } from "@/components/industries/IndustryExplorer";
import { VerticalConnections } from "@/components/industries/VerticalConnections";
import { IndustryProjects } from "@/components/industries/IndustryProjects";
import { DeliveryApproach } from "@/components/industries/DeliveryApproach";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Telecom, renewable energy, industrial & manufacturing, commercial & retail, warehousing & logistics, and infrastructure & real estate.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries we serve"
        title="Where we"
        accent="deliver."
        intro="Explore the sectors and operating environments where Adidev brings engineering coordination, infrastructure expertise and project execution capabilities."
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
        aside={<IndustriesHeroVisual />}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#industries">Explore industries</Button>
          <Button href="/projects" variant="outline-light">
            View projects
          </Button>
        </div>
      </PageHero>

      <IndustryExplorer />
      <VerticalConnections />

      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <SectionHeading
            eyebrow="Project proof"
            title="Experience"
            accent="in the field."
            align="split"
            intro="Approved project references, filtered by sector. Names, clients and figures are published only once verified."
          />
          <div className="mt-12 lg:mt-16">
            <IndustryProjects projects={listedProjects} industries={industries} verticals={verticals.map(({ key, title, slug }) => ({ key, title, slug }))} />
          </div>
        </div>
      </section>

      <DeliveryApproach />
      <CtaBanner title="Have a project in mind?" copy="Tell us about your requirements and the environment in which you are planning to work." />
    </>
  );
}
