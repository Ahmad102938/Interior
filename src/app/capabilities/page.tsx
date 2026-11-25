import type { Metadata } from "next";
import { capabilities } from "@/content/capabilities";
import { capabilityDelivery, deliveryModel } from "@/content/deliveryModels";
import { services } from "@/content/services";
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
import { capabilitiesPage as page } from "@/content/pages/capabilities";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
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
        {...page.hero.heading}
        crumbs={crumbsFor("capabilities")}
        aside={<CapabilitiesHeroVisual />}
      >
        <div className="mt-9 flex flex-wrap gap-3">
          <Button href={page.hero.primary.href}>{page.hero.primary.label}</Button>
          <Button href={page.hero.secondary.href} variant="outline-light">
            {page.hero.secondary.label}
          </Button>
        </div>
      </PageHero>

      <section id="capabilities" data-nav-theme="light" className="section-y scroll-mt-20 bg-ivory">
        <div className="container-page">
          <SectionHeading align="split" {...page.explorer.heading} />
          <div className="mt-12 lg:mt-16">
            <CapabilityExplorer items={capabilities} delivery={delivery} />
          </div>
        </div>
      </section>

      <IntegratedDelivery />

      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page">
          <SectionHeading align="split" {...page.crossVertical.heading} />
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
