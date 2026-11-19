import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { VerticalsSection } from "@/components/sections/VerticalsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Our Services",
  description: "Telecom infrastructure, solar & renewable energy, civil construction & infrastructure, and commercial interior & fit-out.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Our services"
        title="Four verticals."
        accent="One delivery standard."
        intro="Each vertical has its own specialists and process — and shares the same planning, coordination, quality and handover discipline."
        crumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
      />
      <VerticalsSection />
      <CtaBanner />
    </>
  );
}
