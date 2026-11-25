import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { clientsPage as page } from "@/content/pages/clients";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/clients-partners" },
};

export default function ClientsPage() {
  return (
    <>
      <PageHero
        {...page.hero}
        crumbs={crumbsFor("clients")}
      />
      <ClientsSection />
      <CtaBanner />
    </>
  );
}
