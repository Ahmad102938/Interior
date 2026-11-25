import type { Metadata } from "next";
import { ContactSection } from "@/components/sections/ContactSection";
import { quotePage } from "@/content/pages/contact";

export const metadata: Metadata = {
  ...quotePage.meta,
  alternates: { canonical: "/request-a-quote" },
};

export default function QuotePage() {
  return (
    <div className="pt-16 lg:pt-20 bg-navy">
      <ContactSection index="" headingLevel="h1" />
    </div>
  );
}
