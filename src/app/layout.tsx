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
  // Draw edge to edge; bottom-anchored UI clears browser chrome via --safe-bottom (globals.css).
  viewportFit: "cover",
};

/*
 * Safari's floating bottom toolbar can sit over the page without shrinking
 * 100svh. Measure how much of the small viewport the visible area actually
 * loses at the bottom and expose it as --vv-bottom. Skipped while a field is
 * focused (keyboard) or the page is pinch-zoomed; capped so it never swallows
 * a panel.
 */
const viewportScript = `(function(){var d=document.documentElement,v=window.visualViewport,p=document.createElement("div");if(!v)return;p.setAttribute("aria-hidden","true");p.style.cssText="position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";function u(){var a=document.activeElement;if(a&&/^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName))return;if(Math.abs(v.scale-1)>0.01)return;var o=Math.round(Math.min(120,Math.max(0,p.getBoundingClientRect().height-v.height-v.offsetTop)));d.style.setProperty("--vv-bottom",o+"px")}document.body.appendChild(p);u();v.addEventListener("resize",u);addEventListener("orientationchange",u);addEventListener("pageshow",u)})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${cormorant.variable} ${manrope.variable} antialiased`} suppressHydrationWarning>
      <body className="min-h-svh">
        <script dangerouslySetInnerHTML={{ __html: viewportScript }} />
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
