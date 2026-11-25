import Image from "next/image";
import { capabilities, executionStages } from "@/content/capabilities";
import { capabilitiesPage } from "@/content/pages/capabilities";

const hero = capabilitiesPage.hero;

/**
 * Hero composition (large screens): a coordinated building model with an
 * illustrative programme card — six capabilities laid across the five stages.
 * The bars show where each capability typically sits in the sequence; they are
 * not dates or durations. Not `priority`: hidden on phones, so never fetched there.
 */
const span: Record<string, [number, number]> = {
  "01": [0, 2],
  "02": [1, 2],
  "03": [1, 4],
  "04": [2, 4],
  "05": [3, 4],
  "06": [3, 5],
};

const short = hero.shortNames;

export function CapabilitiesHeroVisual() {
  return (
    <div className="relative mt-14 hidden h-[27rem] lg:mt-0 lg:block xl:h-[29rem]">
      <figure className="absolute inset-y-0 right-0 left-[16%] overflow-hidden ring-1 ring-white/10">
        <Image src={hero.image.src} alt={hero.image.alt} fill sizes="(min-width: 1280px) 520px, 42vw" className="object-cover" style={{ objectPosition: hero.image.position }} />
        <div aria-hidden className="absolute inset-0 bg-linear-to-tr from-navy/75 via-navy/20 to-transparent" />
        {hero.image.caption && <figcaption className="absolute top-3 right-3 text-[0.5625rem] font-semibold uppercase tracking-[0.16em] text-white/70">{hero.image.caption}</figcaption>}
      </figure>

      <div aria-hidden className="absolute bottom-6 left-0 w-[62%] bg-navy-deep/95 p-5 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10 backdrop-blur-sm">
        <p className="eyebrow text-[0.5625rem] text-gold-pale">{hero.programmeLabel}</p>
        <div className="mt-3 grid grid-cols-[7rem_repeat(5,minmax(0,1fr))] gap-y-1.5 text-[0.5625rem] uppercase tracking-[0.1em] text-white/45">
          <span />
          {executionStages.map((s) => (
            <span key={s.number} className="truncate border-l border-white/10 pl-1">
              {s.title.split(" ")[0]}
            </span>
          ))}
          {capabilities.map((c, i) => {
            const [from, to] = span[c.number];
            const row = i + 2;
            return (
              <div key={c.number} className="contents">
                <span className="truncate pr-2 font-semibold text-white/70 normal-case tracking-normal" style={{ gridRow: row, gridColumn: 1 }}>
                  <span className="mr-1.5 font-display text-gold-pale">{c.number}</span>
                  {short[c.number]}
                </span>
                <span className="relative h-2.5 self-center" style={{ gridRow: row, gridColumn: `${from + 2} / ${to + 2}` }}>
                  <span className={`absolute inset-0 ${c.group === "pre-construction" ? "bg-gold-pale/80" : c.group === "field-execution" ? "bg-emerald" : "bg-maroon-light"}`} />
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
