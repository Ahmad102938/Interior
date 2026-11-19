import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";

export const metadata: Metadata = {
  title: "Request a Quote",
  description: "Share your project location, scope, drawings or BOQ and request a quotation from Adidev.",
  alternates: { canonical: "/request-a-quote" },
};

export default function QuotePage() {
  return (
    <div className="pt-16 lg:pt-20 bg-navy">
      <ContactSection index="" headingLevel="h1" />
    </div>
  );
}
