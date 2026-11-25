import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { legalPages } from "@/content/pages/legal";
import { crumbsFor } from "@/content/navigation";

const page = legalPages.privacy;

export const metadata: Metadata = { title: page.title, alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow={page.eyebrow} title={page.title} crumbs={crumbsFor("privacy")} />
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page max-w-3xl space-y-6 text-[0.9375rem] leading-relaxed text-charcoal [&_h2]:display [&_h2]:pt-4 [&_h2]:text-3xl [&_h2]:text-navy">
          {page.sections.map((sec) => (
            <div key={sec.heading} className="space-y-6">
              {sec.heading && <h2>{sec.heading}</h2>}
              {sec.body.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
