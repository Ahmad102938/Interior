import { contact } from "@/content/company";
import { isPublishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { EnquiryForm } from "./EnquiryForm";
import { sharedContent } from "@/content/pages/shared";

export function ContactSection({ index = "08", headingLevel = "h2" }: { index?: string; headingLevel?: "h1" | "h2" }) {
  const rows = [contact.office, contact.phone, contact.email, contact.regional, contact.website].filter((c) => isPublishable(c.status));
  return (
    <section id="contact" data-nav-theme="dark" className="bg-navy py-[clamp(4rem,10svh,7rem)] text-white">
      <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-start lg:gap-20">
        {/* Pinned beside the form on large screens, so the contact details stay in view while it is filled in */}
        <div className="lg:sticky lg:top-[calc(5rem+2.5rem)]">
          <SectionHeading
            as={headingLevel}
            index={index}
            {...sharedContent.contact.heading}
            tone="dark"
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
        </div>
        <div data-reveal>
          <EnquiryForm tone="dark" />
        </div>
      </div>
    </section>
  );
}
