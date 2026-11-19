import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { QualitySection } from "@/components/sections/QualitySection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Quality, Safety & Compliance",
  description: "Quality assurance, health & safety, environmental responsibility and verified certifications.",
  alternates: { canonical: "/quality-safety-compliance" },
};

export default function QualityPage() {
  return (
    <>
      <PageHero
        eyebrow="Quality, safety & compliance"
        title="Discipline on"
        accent="every site."
        bg="bg-charcoal"
        intro="Clear practices and verified documents — only valid registrations, certifications and licences are published, each with issuer, validity and scope."
        crumbs={[{ label: "Home", href: "/" }, { label: "Quality & Safety" }]}
      />
      <QualitySection />
      <CtaBanner />
    </>
  );
}
