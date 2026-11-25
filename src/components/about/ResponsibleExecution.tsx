import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { responsibility, aboutPage } from "@/content/pages/about";
import { certifications } from "@/content/capabilities";
import { publishable } from "@/lib/content";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { AboutHeading } from "./AboutHeading";

/** Operating culture: three principles (practice detail lives on the Quality & Safety page). */
export function ResponsibleExecution() {
  const certs = publishable(certifications);
  return (
    <section data-nav-theme="dark" className="section-y bg-navy text-white">
      <div className="container-page">
        <AboutHeading index="06" {...aboutPage.responsible.heading} tone="dark" end>
          <Link href={aboutPage.responsible.link.href} className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-gold-pale hover:text-white">
            {aboutPage.responsible.link.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </AboutHeading>
        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-12" data-reveal>
          {responsibility.map((r, i) => (
            <li key={r.title} className="border-t border-white/15 pt-8">
              <p className="font-display text-lg text-white/40 tabular-nums">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="display mt-1 text-3xl">{r.title}</h3>
              <p className="mt-4 text-[0.9375rem] leading-relaxed text-white/70">{r.principle}</p>
            </li>
          ))}
        </ol>
        {certs.length > 0 && (
          <ul className="mt-10 flex flex-wrap gap-3" data-reveal>
            {certs.map((c) => (
              <li key={c.name} className="flex items-center gap-3 border border-white/15 px-4 py-3 text-sm">
                <span>
                  {c.name} <span className="text-white/50">· {c.issuer} · {c.validity}</span>
                </span>
                <PendingBadge status={c.status} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
