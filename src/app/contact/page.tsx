import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Contact Adidev",
  description: "Project enquiries, vendor registration, partnerships and general enquiries.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="pt-16 lg:pt-20 bg-navy">
      <ContactSection index="" headingLevel="h1" />
    </div>
  );
}
