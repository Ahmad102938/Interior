import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { EnquiryForm } from "@/components/sections/EnquiryForm";
import { careersPage as page } from "@/content/pages/careers";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/careers" },
};

const { areas, openings } = page;

export default function CareersPage() {
  return (
    <>
      <PageHero {...page.hero} crumbs={crumbsFor("careers")} />
      <section data-nav-theme="light" className="section-y bg-ivory">
        <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <ul className="divide-y divide-line border-y border-line">
              {areas.map((a) => (
                <li key={a.title} className="py-6">
                  <h2 className="display text-3xl text-navy">{a.title}</h2>
                  <p className="mt-2 text-sm text-slate">{a.copy}</p>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-slate">
              {openings.length ? page.openingsText.replace("{count}", String(openings.length)) : page.noOpeningsText}
            </p>
          </div>
          <EnquiryForm defaultType="Careers" />
        </div>
      </section>
    </>
  );
}
