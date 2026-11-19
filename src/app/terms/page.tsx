import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Terms & Conditions", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Terms & Conditions" crumbs={[{ label: "Home", href: "/" }, { label: "Terms & Conditions" }]} />
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page max-w-3xl space-y-6 text-[0.9375rem] leading-relaxed text-charcoal [&_h2]:display [&_h2]:pt-4 [&_h2]:text-3xl [&_h2]:text-navy">
          <h2>Use of this website</h2>
          <p>This website provides general information about Adidev and its services. Content may be updated without notice and does not constitute an offer or a contractual commitment.</p>
          <h2>Project information</h2>
          <p>Scope, timelines and commercial terms for any project are agreed only through a formal proposal and contract.</p>
          <h2>Intellectual property</h2>
          <p>Text, imagery and visualisations on this website may not be reproduced without permission.</p>
        </div>
      </section>
    </>
  );
}
