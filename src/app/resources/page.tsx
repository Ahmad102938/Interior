import type { Metadata } from "next";
import { faqs } from "@/content/capabilities";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { resourcesPage as page } from "@/content/pages/resources";
import { crumbsFor } from "@/content/navigation";

export const metadata: Metadata = {
  ...page.meta,
  alternates: { canonical: "/resources" },
};

/** Downloads are edited in src/content/pages/resources.ts. */
const downloads = page.downloads;

export default function ResourcesPage() {
  return (
    <>
      <PageHero {...page.hero} crumbs={crumbsFor("resources")} />
      <section data-nav-theme="light" className="section-y bg-ivory">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading {...page.faqHeading} />
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="font-display text-2xl text-gold-ink transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        {downloads.length > 0 && (
          <div className="container-page mt-14 lg:mt-20">
            <h2 className="display text-4xl text-navy">{page.downloadsTitle}</h2>
            <ul className="mt-8 grid gap-4 md:grid-cols-2">
              {downloads.map((d) => (
                <li key={d.href}>
                  <a href={d.href} className="flex justify-between border border-line bg-white p-5 hover:border-navy">
                    <span className="font-semibold text-navy">{d.title}</span>
                    <span className="text-xs text-slate">{d.meta}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
      <CtaBanner />
    </>
  );
}
