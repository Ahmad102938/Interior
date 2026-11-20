import { contact } from "@/data/company";
import { isPublishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { EnquiryForm } from "./EnquiryForm";

const enquiryRoutes = [
  { title: "Project enquiries", copy: "New projects, work packages and quotations." },
  { title: "Vendor registration", copy: "Suppliers and subcontractors seeking empanelment." },
  { title: "Business partnerships", copy: "Collaboration on larger or specialised scopes." },
  { title: "General enquiries", copy: "Anything else — we will route it to the right team." },
];

export function ContactSection({ index = "08", headingLevel = "h2" }: { index?: string; headingLevel?: "h1" | "h2" }) {
  const rows = [contact.office, contact.phone, contact.email, contact.regional, contact.website].filter((c) => isPublishable(c.status));
  return (
    <section id="contact" data-nav-theme="dark" className="section-y bg-navy text-white">
      <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading
            as={headingLevel}
            index={index}
            eyebrow="Contact / request a quote"
            title="Let's Build"
            accent="Something Together."
            tone="dark"
            intro="Share your requirement, drawings or BOQ. Our team will review your enquiry and contact you regarding the project requirements."
          />
          <dl className="mt-10 divide-y divide-white/10 border-y border-white/10">
            {rows.map((r) => (
              <div key={r.label} className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                <dt className="eyebrow text-gold-pale">{r.label}</dt>
                <dd className="flex items-center gap-2 text-sm text-white/85">
                  {r.href ? (
                    <a href={r.href} className="hover:text-gold-pale">
                      {r.value}
                    </a>
                  ) : (
                    r.value
                  )}
                  <PendingBadge status={r.status} />
                </dd>
              </div>
            ))}
          </dl>
          <ul className="mt-10 grid gap-px bg-white/10 sm:grid-cols-2">
            {enquiryRoutes.map((e) => (
              <li key={e.title} className="bg-navy p-5 pl-0 sm:pr-6">
                <p className="text-sm font-semibold">{e.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">{e.copy}</p>
              </li>
            ))}
          </ul>
        </div>
        <div data-reveal>
          <EnquiryForm tone="dark" />
        </div>
      </div>
    </section>
  );
}
