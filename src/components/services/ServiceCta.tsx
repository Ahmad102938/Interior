import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ServiceConfig } from "@/data/services";
import { services } from "@/data/services";
import { Button } from "@/components/ui/Button";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { quoteHref } from "./shared";

/** Contextual enquiry in the division's colour, then the other three divisions. */
export function ServiceCta({ s }: { s: ServiceConfig }) {
  const c = verticalClasses[s.key];
  const others = services.filter((o) => o.key !== s.key);

  return (
    <section id="enquire" data-nav-theme="dark" className={cn("scroll-mt-32 text-white", c.bg)}>
      <div className="container-page py-16 lg:py-24">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
          <div className="max-w-2xl">
            <p className="eyebrow flex items-center gap-3 text-gold-pale">
              <span aria-hidden className="h-px w-10 bg-gold-pale/50" />
              Enquire
            </p>
            <h2 className="display mt-5 text-[2.5rem] sm:text-5xl lg:text-6xl">{s.enquiry.title}</h2>
            <p className="mt-4 max-w-xl text-white/75">{s.enquiry.copy}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button href={quoteHref(s.key)} className="border-gold-pale bg-gold-pale text-navy-deep hover:border-white hover:bg-white">
              Request a quote
            </Button>
            <Button href="/contact" variant="outline-light">
              Contact us
            </Button>
          </div>
        </div>

        <nav aria-label="Other services" className="mt-14 border-t border-white/15 pt-8 lg:mt-20">
          <p className="eyebrow text-white/70">Other divisions</p>
          <ul className="mt-4 grid gap-px sm:grid-cols-3">
            {others.map((o) => (
              <li key={o.key}>
                <Link href={`/services/${o.slug}`} className="group flex min-h-16 items-center gap-4 border-b border-white/10 py-4 sm:border-0 sm:pr-6">
                  <span aria-hidden className={cn("size-2.5 shrink-0 ring-1 ring-white/40", verticalClasses[o.key].bg)} />
                  <span className="font-display text-base text-gold-pale tabular-nums">{o.serviceNumber}</span>
                  <span className="display flex-1 text-xl text-white transition-colors group-hover:text-gold-pale">{o.title}</span>
                  <ArrowRight aria-hidden className="size-4 shrink-0 text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-gold-pale" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
