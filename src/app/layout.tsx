import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { company } from "@/data/company";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.siteUrl),
  title: {
    default: `ADIDEV — ${company.positioning}`,
    template: "%s | ADIDEV",
  },
  description:
    "Adidev delivers integrated engineering, infrastructure and project execution solutions across telecom infrastructure, solar and renewable energy, civil construction and commercial interior fit-out.",
  openGraph: {
    type: "website",
    siteName: "ADIDEV",
    locale: "en_IN",
    title: `ADIDEV — ${company.tagline.join(" ")}`,
    description: company.heroIntro,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#172C48",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable} antialiased`}>
      <body className="min-h-svh">
        {/* Structured data limited to verified facts: name, website, positioning. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: "ADIDEV", url: company.siteUrl, slogan: company.tagline.join(" ") }),
          }}
        />
        <Navbar />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
