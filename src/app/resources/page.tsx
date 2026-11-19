import type { Metadata } from "next";
import { faqs } from "@/data/capabilities";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "FAQs & Resources",
  description: "Frequently asked questions about Adidev services, project process, enquiries and approved downloads.",
  alternates: { canonical: "/resources" },
};

/** Downloads are added here only once an approved, current file exists in /public. */
const downloads: { title: string; href: string; meta: string }[] = [];

export default function ResourcesPage() {
  return (
    <>
      <PageHero eyebrow="FAQs & resources" title="Answers and" accent="approved downloads." crumbs={[{ label: "Home", href: "/" }, { label: "Resources" }]} />
      <section data-nav-theme="light" className="section-y bg-ivory">
        <div className="container-page grid gap-14 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Frequently asked questions" title="Before you enquire." />
          <div className="divide-y divide-line border-y border-line">
            {faqs.map((f) => (
              <details key={f.q} className="group py-2">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 text-base font-semibold text-navy [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden className="font-display text-2xl text-gold transition-transform group-open:rotate-45">+</span>
                </summary>
                <p className="pb-5 text-sm leading-relaxed text-slate">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
        {downloads.length > 0 && (
          <div className="container-page mt-20">
            <h2 className="display text-4xl text-navy">Downloads</h2>
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
