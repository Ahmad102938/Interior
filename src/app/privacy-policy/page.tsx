import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";

export const metadata: Metadata = { title: "Privacy Policy", alternates: { canonical: "/privacy-policy" } };

export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy Policy" crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <section data-nav-theme="light" className="section-y bg-white">
        <div className="container-page max-w-3xl space-y-6 text-[0.9375rem] leading-relaxed text-charcoal [&_h2]:display [&_h2]:pt-4 [&_h2]:text-3xl [&_h2]:text-navy">
          <h2>Information we collect</h2>
          <p>When you submit an enquiry, quote request or application, we collect the details you provide — such as your name, organisation, contact details, project information and any documents you attach.</p>
          <h2>How we use it</h2>
          <p>We use this information only to review and respond to your enquiry, prepare proposals, and assess applications. We do not sell your personal information.</p>
          <h2>Documents</h2>
          <p>Uploaded drawings, BOQs and resumes are handled confidentially and shared only with the team responsible for your enquiry. Please do not upload confidential material unless it is required.</p>
          <h2>Your choices</h2>
          <p>You may ask us to access, correct or delete the personal information you have submitted by contacting us through the contact page.</p>
        </div>
      </section>
    </>
  );
}
