import type { Metadata } from "next";
import { company } from "@/data/company";
import { PageHero } from "@/components/ui/PageHero";
import { HeritageSection } from "@/components/sections/HeritageSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "About Adidev",
  description: company.overview,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Adidev"
        title="Engineering partners"
        accent="for dependable delivery."
        intro={company.howWeWork}
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <HeritageSection />
      <TeamSection index="02" />
      <CtaBanner />
    </>
  );
}
