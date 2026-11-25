import Image from "next/image";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { EquipmentSection } from "./EquipmentSection";
import { homePage } from "@/content/pages/home";

/** Why Adidev, approved client logos, testimonials and resources. */
export function ClientsSection() {
  const c = homePage.clients;
  const logos = publishable(c.logos);
  const quotes = publishable(c.testimonials);
  return (
    <section id="clients" data-nav-theme="light" className="section-y bg-white">
      <div className="container-page">
        <SectionHeading index="07" {...c.heading} align="split" />
        <ul className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:mt-16 lg:grid-cols-3" data-reveal>
          {c.whyCards.map((w, i) => (
            <li key={w.title} className="border-r border-b border-line p-7 lg:p-9">
              <p className="font-display text-xl text-gold-ink">{String(i + 1).padStart(2, "0")}</p>
              <h3 className="mt-3 text-lg font-semibold text-navy">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate">{w.copy}</p>
            </li>
          ))}
        </ul>

        {logos.length > 0 && (
          <div className="mt-12 lg:mt-16" data-reveal>
            <p className="eyebrow text-gold-ink">{c.logosLabel}</p>
            <ul className="mt-6 grid grid-cols-2 border-t border-l border-line sm:grid-cols-4">
              {logos.map((l) => (
                <li key={l.name} className="flex h-28 flex-col items-center justify-center gap-2 border-r border-b border-line px-4 text-center text-xs text-slate grayscale">
                  {l.logo ? (
                    <span className="relative h-12 w-full">
                      <Image src={l.logo} alt={l.name} fill sizes="200px" className="object-contain" />
                    </span>
                  ) : (
                    l.name
                  )}
                  <PendingBadge status={l.status} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {quotes.length > 0 && (
          <ul className="mt-12 grid gap-6 lg:mt-16 md:grid-cols-2" data-reveal>
            {quotes.map((q) => (
              <li key={q.author}>
                <figure className="border-l-2 border-gold pl-6">
                  <blockquote className="font-display text-2xl leading-snug text-navy">“{q.quote}”</blockquote>
                  <figcaption className="mt-4 text-sm text-slate">
                    {q.author}, {q.role}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        )}

        <EquipmentSection />
      </div>
    </section>
  );
}
