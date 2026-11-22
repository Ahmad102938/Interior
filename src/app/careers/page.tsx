import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { EnquiryForm } from "@/components/sections/EnquiryForm";

export const metadata: Metadata = {
  title: "Careers",
  description: "Engineering, project, site, design and support roles at Adidev.",
  alternates: { canonical: "/careers" },
};

const areas = [
  { title: "Engineering opportunities", copy: "Civil, electrical, telecom, solar, and technical coordination roles." },
  { title: "Project & site roles", copy: "Project management, site execution, supervision, and quality." },
  { title: "Design & support roles", copy: "Design coordination, procurement, business development, and administration." },
];

/** Publish current openings only. Empty until HR supplies live roles. */
const openings: { role: string; location: string; department: string }[] = [];

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Build infrastructure" accent="with us." intro="We welcome engineers, site professionals and coordinators who take pride in careful, safe execution." crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]} />
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
              {openings.length ? `${openings.length} current openings.` : "There are no published openings right now. Send your details using the form — “Careers” is already selected, and you can attach your resume in step 2."}
            </p>
          </div>
          <EnquiryForm defaultType="Careers" />
        </div>
      </section>
    </>
  );
}
