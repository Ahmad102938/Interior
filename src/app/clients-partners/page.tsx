import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Clients & Partners",
  description: "Approved client and partner relationships, genuine testimonials and project references.",
  alternates: { canonical: "/clients-partners" },
};

export default function ClientsPage() {
  return (
    <>
      <PageHero
        eyebrow="Clients & partners"
        title="Relationships built"
        accent="on delivery."
        intro="Client names, logos and testimonials are shown only with permission."
        crumbs={[{ label: "Home", href: "/" }, { label: "Clients & Partners" }]}
      />
      <ClientsSection />
      <CtaBanner />
    </>
  );
}
