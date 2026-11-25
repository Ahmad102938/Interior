import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { brand, verticalTheme } from "@/config/theme";
import { verticals } from "@/content/verticals";
import { disciplines, aboutPage } from "@/content/pages/about";
import { AboutHeading } from "./AboutHeading";

const C = 300; // centre of the 600×600 diagram
const R_OUT = 258; // vertical ring
const R_NODE = 172; // discipline ring

const polar = (r: number, deg: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};
const arc = (r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
};
/** Counter-clockwise arc — keeps labels upright on the lower half of the ring. */
const arcCcw = (r: number, a0: number, a1: number) => {
  const [x0, y0] = polar(r, a1);
  const [x1, y1] = polar(r, a0);
  return `M ${x0} ${y0} A ${r} ${r} 0 0 0 ${x1} ${y1}`;
};

/**
 * One integrated operating system: four verticals on the outer ring, six
 * shared disciplines on the inner ring — linked to each other and to one
 * delivery team at the centre. Detail lives on /capabilities.
 */
export function OperatingSystem() {
  const nodes = disciplines.map((_, i) => polar(R_NODE, i * 60));
  return (
    <section data-nav-theme="light" className="section-y overflow-hidden bg-white">
      <div className="container-page">
        <AboutHeading index="04" {...aboutPage.operatingSystem.heading}>
          {aboutPage.operatingSystem.intro}
        </AboutHeading>
        <div className="mt-14 grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div data-reveal>
          <ol className="border-t border-line">
            {disciplines.map((d, i) => (
              <li key={d} className="flex items-baseline gap-4 border-b border-line py-4">
                <span className="font-display text-lg text-gold-ink tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-[0.9375rem] font-medium text-navy">{d}</span>
              </li>
            ))}
          </ol>
          <p className="mt-6 text-xs leading-relaxed text-slate">{aboutPage.operatingSystem.note}</p>
          <Link href={aboutPage.operatingSystem.link.href} className="mt-4 inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-maroon hover:text-navy">
            {aboutPage.operatingSystem.link.label}
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>

        <figure data-reveal>
          <svg viewBox="0 0 600 600" role="img" aria-labelledby="os-title os-desc" className="mx-auto w-full max-w-[36rem]">
            <title id="os-title">{aboutPage.operatingSystem.diagramTitle}</title>
            <desc id="os-desc">{aboutPage.operatingSystem.diagramDescription}</desc>
            {/* Outer ring: verticals */}
            {verticals.map((v, i) => {
              const a0 = i * 90 + 4;
              const a1 = (i + 1) * 90 - 4;
              return (
                <g key={v.key}>
                  <path d={arc(R_OUT, a0, a1)} fill="none" stroke={verticalTheme[v.key].primary} strokeWidth={22} />
                  <path
                    id={`os-arc-${v.key}`}
                    d={i === 1 || i === 2 ? arcCcw(R_OUT - 24, a0 + 6, a1 - 6) : arc(R_OUT - 34, a0 + 6, a1 - 6)}
                    fill="none"
                  />
                  <text fontSize="13" fontWeight="600" letterSpacing="2.4" fill={verticalTheme[v.key].primary} style={{ textTransform: "uppercase" }}>
                    <textPath href={`#os-arc-${v.key}`} startOffset="50%" textAnchor="middle">
                      {v.number} {v.shortTitle}
                    </textPath>
                  </text>
                </g>
              );
            })}
            {/* Spokes and ring between disciplines */}
            {nodes.map(([x, y], i) => {
              const [nx, ny] = nodes[(i + 1) % nodes.length];
              return (
                <g key={i} stroke={brand.gold} strokeWidth={1}>
                  <line x1={C} y1={C} x2={x} y2={y} strokeOpacity={0.35} strokeDasharray="3 5" />
                  <line x1={x} y1={y} x2={nx} y2={ny} strokeOpacity={0.7} />
                </g>
              );
            })}
            {/* Centre: one delivery team */}
            <circle cx={C} cy={C} r={74} fill={brand.navy} />
            <circle cx={C} cy={C} r={82} fill="none" stroke={brand.gold} strokeOpacity={0.5} />
            <text x={C} y={C - 6} textAnchor="middle" fill="#ffffff" fontSize="22" style={{ fontFamily: "var(--font-display)" }}>
              {aboutPage.operatingSystem.centre[0]}
            </text>
            <text x={C} y={C + 20} textAnchor="middle" fill={brand.paleGold} fontSize="22" fontStyle="italic" style={{ fontFamily: "var(--font-display)" }}>
              {aboutPage.operatingSystem.centre[1]}
            </text>
            {/* Discipline nodes */}
            {nodes.map(([x, y], i) => (
              <g key={`n${i}`}>
                <circle cx={x} cy={y} r={24} fill="#ffffff" stroke={brand.gold} strokeWidth={1.5} />
                <text x={x} y={y + 6} textAnchor="middle" fill={brand.navy} fontSize="17" style={{ fontFamily: "var(--font-display)" }}>
                  {String(i + 1).padStart(2, "0")}
                </text>
              </g>
            ))}
          </svg>
        </figure>
        </div>
      </div>
    </section>
  );
}
