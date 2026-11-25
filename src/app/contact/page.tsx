import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { contactPage } from "@/content/pages/contact";

export const metadata: Metadata = {
  ...contactPage.meta,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-16 lg:pt-20 bg-navy">
      <ContactSection index="" headingLevel="h1" />
    </div>
  );
}
