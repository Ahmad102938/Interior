import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ExecutionSection } from "@/components/sections/ExecutionSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Engineering & Project Capabilities",
  description: "Design coordination, BOQ and cost management, planning, procurement, site execution, quality and handover.",
  alternates: { canonical: "/capabilities" },
};

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Engineering capabilities"
        title="Plan. Coordinate."
        accent="Execute. Hand over."
        intro="What Adidev can plan, coordinate, manage and execute — with in-house expertise clearly distinguished from qualified partner-supported delivery."
        crumbs={[{ label: "Home", href: "/" }, { label: "Capabilities" }]}
      />
      <CapabilitiesSection standalone />
      <ExecutionSection />
      <CtaBanner />
    </>
  );
}
