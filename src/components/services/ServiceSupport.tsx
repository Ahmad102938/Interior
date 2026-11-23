import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";
import type { ServiceConfig, Surface } from "@/data/services";
import { capabilities } from "@/data/capabilities";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { surface } from "./shared";

/**
 * A short selection of the company-wide capabilities behind this division, and
 * the quality checks that matter most for its work — each linking to the full page.
 */
export function ServiceSupport({ s, tone }: { s: ServiceConfig; tone: Surface }) {
  const sf = surface(tone, s.key);
  const c = verticalClasses[s.key];
  const picked = s.relatedCapabilities.map((n) => capabilities.find((cap) => cap.number === n)!);
  const card = tone === "white" ? "bg-ivory" : "bg-white";

  return (
    <section id="support" data-nav-theme={sf.navTheme} className={cn("section-y scroll-mt-32", sf.className)}>
      <div className="container-page">
        <SectionHeading
          eyebrow="Behind the delivery"
          title="Engineering that"
          accent="supports the site."
          align="split"
          intro="Every project draws on capabilities shared across Adidev. These matter most for this division."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {picked.map((cap) => (
            <Link key={cap.number} href="/capabilities" className={cn("group relative flex flex-col border border-line p-6 transition-colors hover:border-navy/30 sm:p-8", card)} data-reveal>
              <span aria-hidden className={cn("absolute top-0 left-0 h-0.5 w-10 transition-[width] duration-500 group-hover:w-full", c.bg)} />
              <span className="font-display text-lg text-gold-ink tabular-nums">{cap.number}</span>
              <h3 className="display mt-2 text-2xl text-navy">{cap.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{cap.summary}</p>
              <p className="mt-4 text-xs leading-relaxed text-charcoal/80">{cap.items.join(" · ")}</p>
              <span className="mt-auto inline-flex items-center gap-2 pt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-maroon group-hover:text-navy">
                Capabilities
                <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          ))}
          <div className={cn("flex flex-col p-6 text-white sm:p-8", c.bg === "bg-navy" ? "bg-charcoal" : "bg-navy")} data-reveal>
            <p className="eyebrow text-gold-pale">Quality checks on this work</p>
            <ul className="mt-5 space-y-3">
              {s.qualityChecks.map((q) => (
                <li key={q} className="flex gap-3 text-sm leading-relaxed text-white/85">
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-gold-pale" />
                  {q}
                </li>
              ))}
            </ul>
            <Link
              href="/quality-safety-compliance"
              className="mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-gold-pale hover:text-white"
            >
              Quality &amp; safety
              <ArrowUpRight aria-hidden className="size-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
