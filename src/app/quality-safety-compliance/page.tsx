import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { QualitySection } from "@/components/sections/QualitySection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { qualityPage as page } from "@/content/pages/quality";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/quality-safety-compliance" },
};

export default function QualityPage() {
  return (
    <>
      <PageHero
        {...page.hero}
        bg="bg-charcoal"
        crumbs={crumbsFor("quality")}
      />
      <QualitySection standalone />
      <CtaBanner />
    </>
  );
}
