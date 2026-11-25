import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { VerticalsSection } from "@/components/sections/VerticalsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { servicesPage as page } from "@/content/pages/services";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        {...page.hero.heading}
        crumbs={crumbsFor("services")}
      />
      <VerticalsSection />
      <CtaBanner />
    </>
  );
}
