import { values } from "@/data/about";
import { AboutHeading } from "./AboutHeading";

/** Core values as an even 3×2 ledger — operating commitments, not slogans. */
export function ValuesLedger() {
  return (
    <section data-nav-theme="light" className="section-y bg-white">
      <div className="container-page">
        <AboutHeading index="02" eyebrow="Core values" title="Six commitments" accent="on every site.">
          The standards our teams hold themselves to — on drawings, on site and with every client.
        </AboutHeading>
        <ol className="mt-14 grid border-t border-l border-line sm:grid-cols-2 lg:grid-cols-3" data-reveal>
          {values.map((v, i) => (
            <li key={v.name} className="group relative border-r border-b border-line p-6 sm:p-8">
              <span aria-hidden className="absolute top-[-1px] left-0 h-0.5 w-0 bg-gold transition-[width] duration-500 ease-(--ease-premium) group-hover:w-full" />
              <span className="font-display text-base text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h3 className="display mt-3 text-[1.875rem] text-navy">{v.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate">{v.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
