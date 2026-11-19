import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { industries } from "@/data/capabilities";
import { verticalByKey, serviceHref } from "@/data/verticals";
import { PageHero } from "@/components/ui/PageHero";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { CtaBanner } from "@/components/sections/CtaBanner";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Industries We Serve",
  description: "Telecom, renewable energy, industrial & manufacturing, warehousing & logistics, commercial & retail, and infrastructure & real estate.",
  alternates: { canonical: "/industries" },
};

export default function IndustriesPage() {
  return (
    <>
      <PageHero
        eyebrow="Industries we serve"
        title="Where we"
        accent="deliver."
        intro="Sectors and operating environments where Adidev has relevant experience or a credible delivery capability."
        crumbs={[{ label: "Home", href: "/" }, { label: "Industries" }]}
      />
      <section data-nav-theme="light" className="section-y bg-ivory">
        <ul className="container-page grid gap-px border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => {
            const v = verticalByKey(ind.vertical);
            const c = verticalClasses[ind.vertical];
            return (
              <li key={ind.title} data-reveal className="flex flex-col bg-white p-8 lg:p-10">
                <span aria-hidden className={cn("h-1 w-12", c.bg)} />
                <h2 className="display mt-6 text-3xl text-navy">{ind.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">{ind.copy}</p>
                <Link href={serviceHref(v)} className={cn("mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-xs font-semibold uppercase tracking-[0.14em]", c.text)}>
                  {v.title}
                  <ArrowUpRight aria-hidden className="size-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
      <CtaBanner />
    </>
  );
}
