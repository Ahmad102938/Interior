import Image from "next/image";
import type { ServiceConfig, Surface } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { cn } from "@/lib/utils";
import { CalloutFigure } from "./CalloutFigure";
import { SolarArrayDrawing, TelecomSiteDrawing } from "./drawings";
import { formatCovers, surface } from "./shared";

/**
 * Each division's signature section. Same heading, spacing and interaction
 * conventions — a different composition suited to the work:
 * telecom and solar as technical schematics, civil as an annotated building,
 * interiors as a design-to-completion sequence.
 */
export function ServiceFeature({ s, tone }: { s: ServiceConfig; tone: Surface }) {
  const sf = surface(tone, s.key);
  const f = s.feature;

  return (
    <section id="scope" data-nav-theme={sf.navTheme} className={cn("section-y scroll-mt-32", sf.className)}>
      <div className="container-page">
        <SectionHeading eyebrow={f.eyebrow} title={f.title[0]} accent={f.title[1]} align="split" intro={f.intro} tone={sf.dark ? "dark" : "light"} />
        <div className="mt-12 lg:mt-16">
          {f.kind === "telecom-site" && (
            <CalloutFigure callouts={f.callouts} aspect="aspect-[5/3]" note="Schematic of a typical site — not to scale">
              <TelecomSiteDrawing />
            </CalloutFigure>
          )}
          {f.kind === "solar-array" && (
            <CalloutFigure callouts={f.callouts} aspect="aspect-[100/41]" note="Schematic cross-section — not to scale">
              <SolarArrayDrawing />
            </CalloutFigure>
          )}
          {f.kind === "civil-anatomy" && (
            <CalloutFigure callouts={f.callouts} aspect="aspect-[16/10]" note="Illustrative visualisation" dark={sf.dark}>
              <Image src={f.image.src} alt={f.image.alt} fill sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
            </CalloutFigure>
          )}
          {f.kind === "interior-journey" && <InteriorJourney steps={f.steps} />}
        </div>
      </div>
    </section>
  );
}

type Steps = Extract<ServiceConfig["feature"], { kind: "interior-journey" }>["steps"];

/** A connected sequence: image steps alternate sides, text-only steps sit on the spine. */
function InteriorJourney({ steps }: { steps: Steps }) {
  let side = 0;
  return (
    <ol className="relative">
      <span aria-hidden className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-line lg:left-1/2" />
      <span aria-hidden data-spine-fill className="absolute top-2 bottom-2 left-[0.6875rem] w-px bg-gold lg:left-1/2" />
      {steps.map((st, i) => {
        const flip = st.image ? side++ % 2 === 1 : false;
        return (
          <li key={st.title} className={cn("relative pb-12 pl-12 last:pb-0 lg:pl-0", st.image ? "lg:pb-20" : "lg:pb-16")}>
            <span aria-hidden className="absolute top-1 left-0 grid size-6 place-items-center rounded-full border border-gold bg-white lg:left-1/2 lg:-translate-x-1/2">
              <span className="size-2 rounded-full bg-maroon" />
            </span>
            {st.image ? (
              <div className="grid gap-6 lg:grid-cols-2 lg:items-center lg:gap-24">
                <div className={cn(flip ? "lg:order-2" : "lg:text-right")}>
                  <Text i={i} title={st.title} copy={st.copy} covers={st.covers} align={flip ? "left" : "right"} />
                </div>
                <div className={cn("relative aspect-[4/3] overflow-hidden", flip && "lg:order-1")} data-reveal-image>
                  <Image src={st.image.src} alt={st.image.alt} fill sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover" style={{ objectPosition: st.image.position }} />
                  <p className="absolute bottom-3 left-3 bg-black/45 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/80">Illustrative visualisation</p>
                </div>
              </div>
            ) : (
              <div className="lg:mx-auto lg:max-w-md lg:bg-ivory lg:p-8 lg:text-center">
                <Text i={i} title={st.title} copy={st.copy} covers={st.covers} align="center" />
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function Text({ i, title, copy, covers, align }: { i: number; title: string; copy: string; covers: string[]; align: "left" | "right" | "center" }) {
  return (
    <div className={cn(align === "right" && "lg:ml-auto", "max-w-md")}>
      <p className="font-display text-lg text-gold-ink tabular-nums">Step {String(i + 1).padStart(2, "0")}</p>
      <h3 className="display mt-1 text-3xl text-navy lg:text-4xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-slate lg:text-base">{copy}</p>
      <p className="mt-4 text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-maroon tabular-nums">
        {covers.length > 1 ? "Capabilities" : "Capability"} {formatCovers(covers)}
      </p>
    </div>
  );
}
