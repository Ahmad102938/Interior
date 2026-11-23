import type { Metadata } from "next";
import { capabilities } from "@/data/capabilities";
import { capabilityDelivery, deliveryModel } from "@/data/deliveryModels";
import { services } from "@/data/services";
import { isPublishable } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CapabilitiesHeroVisual } from "@/components/capabilities/CapabilitiesHeroVisual";
import { CapabilityExplorer, type DeliveryNote } from "@/components/capabilities/CapabilityExplorer";
import { IntegratedDelivery } from "@/components/capabilities/IntegratedDelivery";
import { CrossVertical } from "@/components/capabilities/CrossVertical";
import { DeliveryModel } from "@/components/capabilities/DeliveryModel";
import { ExecutionMethodology } from "@/components/capabilities/ExecutionMethodology";
import { CapabilityProjects } from "@/components/capabilities/CapabilityProjects";
import { CapabilitiesCta } from "@/components/capabilities/CapabilitiesCta";

export const metadata: Metadata = {
  title: "Engineering & Project Capabilities",
  description:
    "Engineering and design coordination, BOQ and cost management, project planning, procurement and vendors, site execution, and quality and handover — and how they connect from requirement to handover.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  // Delivery model per capability: a label only once verified; a development marker while pending.
  const delivery: DeliveryNote[] = capabilities.map((c) => {
    const d = capabilityDelivery.find((x) => x.number === c.number);
    const verified = d?.status === "verified" && d.model;
    return { number: c.number, label: verified ? deliveryModel(d.model!).label : undefined, pending: !verified && !!d && isPublishable(d.status) };
  });
  const divisions = services.map((s) => ({ key: s.key, number: s.serviceNumber, title: s.title, href: `/services/${s.slug}`, emphasis: s.relatedCapabilities }));

  return (
    <>
      <PageHero
        eyebrow="Engineering capabilities"
        title="Plan. Coordinate."
        accent="Execute. Hand over."
        intro="Discover how ADIDEV brings together engineering coordination, cost management, project planning, resource coordination and on-ground execution to support infrastructure projects."
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
        aside={<CapabilitiesHeroVisual />}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href="#capabilities">Explore capabilities</Button>
          <Button href="/request-a-quote" variant="outline-light">
            Discuss a project
          </Button>
        </div>
      </PageHero>

      <section id="capabilities" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
        <div className="container-page">
          <SectionHeading
            align="split"
            eyebrow="Six capabilities"
            title="What ADIDEV can plan,"
            accent="coordinate, manage and execute."
            intro="Six capabilities in three groups — from defining the requirement to handing over a documented, inspected project."
          />
          <div className="mt-12 lg:mt-16">
            <CapabilityExplorer items={capabilities} delivery={delivery} />
          </div>
        </div>
      </section>

      <IntegratedDelivery />

      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <SectionHeading
            align="split"
            eyebrow="Across the verticals"
            title="One Engineering Framework."
            accent="Four Business Verticals."
            intro="The same six capabilities sit behind every division. Which of them a project draws on — and how much — depends on its approved scope."
          />
          <div className="mt-12 lg:mt-16">
            <CrossVertical caps={capabilities.map(({ number, title }) => ({ number, title }))} divisions={divisions} />
          </div>
        </div>
      </section>

      <DeliveryModel />
      <ExecutionMethodology />
      <CapabilityProjects />
      <CapabilitiesCta />
    </>
  );
}
