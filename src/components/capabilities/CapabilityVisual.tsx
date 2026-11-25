import Image from "next/image";
import { cn } from "@/lib/utils";
import { mediaLabels } from "@/content/media";
import { capabilitiesPage } from "@/content/pages/capabilities";

/**
 * One visual per capability: our renders where they show the activity, and
 * line diagrams for document-led work (BOQ, programme, procurement). Diagrams
 * carry no figures, rates or dates — they show the kind of work, not a record.
 */

/** Edit in src/content/pages/capabilities.ts (explorer.images). */
const images = capabilitiesPage.explorer.images;

const grid = {
  backgroundImage: "linear-gradient(rgba(23,44,72,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(23,44,72,0.06) 1px, transparent 1px)",
  backgroundSize: "32px 32px",
};
const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.25, vectorEffect: "non-scaling-stroke" as const };

export function CapabilityVisual({ number, className, sizes = "(min-width: 1024px) 30vw, 100vw" }: { number: string; className?: string; sizes?: string }) {
  const img = images[number];
  return (
    <figure className={cn("relative overflow-hidden", className)}>
      {img ? (
        <Image src={img.src} alt={img.alt} fill sizes={sizes} className="object-cover" style={{ objectPosition: img.position }} />
      ) : (
        <div className="absolute inset-0 bg-ivory-soft text-navy" style={grid}>
          {number === "02" && <BoqSheet />}
          {number === "03" && <Programme />}
          {number === "04" && <SupplyFlow />}
        </div>
      )}
      {(!img || img.caption) && (
        <figcaption className={cn("absolute bottom-3 left-3 px-2 py-1 text-[0.5625rem] font-semibold uppercase tracking-[0.16em]", img ? "bg-black/45 text-white/85" : "bg-white/80 text-slate")}>
          {img ? img.caption : mediaLabels.diagram}
        </figcaption>
      )}
    </figure>
  );
}

/** A bill of quantities: item / description / unit / quantity / rate columns, no values. */
function BoqSheet() {
  const rows = Array.from({ length: 9 }, (_, i) => 92 + i * 30);
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full" aria-hidden>
      <rect x="40" y="36" width="320" height="282" {...stroke} fill="#fff" className="text-navy/40" />
      <rect x="40" y="36" width="320" height="34" className="fill-navy" />
      <g className="text-white" fill="currentColor" fontSize="9" fontFamily="var(--font-sans)" letterSpacing="1.2">
        <text x="52" y="57">ITEM</text>
        <text x="96" y="57">DESCRIPTION</text>
        <text x="236" y="57">UNIT</text>
        <text x="272" y="57">QTY</text>
        <text x="314" y="57">RATE</text>
      </g>
      <g {...stroke} className="text-navy/15">
        {rows.map((y) => (
          <line key={y} x1="40" y1={y} x2="360" y2={y} />
        ))}
        {[86, 226, 262, 302].map((x) => (
          <line key={x} x1={x} y1="70" x2={x} y2="318" />
        ))}
      </g>
      <g className="fill-navy/20">
        {rows.slice(0, 8).map((y, i) => (
          <g key={y}>
            <rect x="52" y={y - 18} width="18" height="5" />
            <rect x="96" y={y - 18} width={60 + ((i * 37) % 64)} height="5" />
            <rect x="236" y={y - 18} width="16" height="5" />
            <rect x="272" y={y - 18} width="20" height="5" />
          </g>
        ))}
      </g>
      {/* Take-off marks and a highlighted line under review */}
      <rect x="40" y="152" width="320" height="30" className="fill-gold/15" />
      <path d="M312 160 l6 7 l12 -14" {...stroke} strokeWidth={2} className="text-gold" />
      <path d="M312 220 l6 7 l12 -14" {...stroke} strokeWidth={2} className="text-gold" />
    </svg>
  );
}

/** A programme: activity bars over a time grid, with a progress line. */
function Programme() {
  const bars: [number, number, number][] = [
    [0, 40, 70],
    [1, 70, 90],
    [2, 120, 110],
    [3, 150, 80],
    [4, 190, 120],
    [5, 260, 70],
  ];
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full" aria-hidden>
      <g {...stroke} className="text-navy/15">
        {Array.from({ length: 9 }, (_, i) => (
          <line key={i} x1={40 + i * 40} y1="60" x2={40 + i * 40} y2="300" />
        ))}
      </g>
      <line x1="40" y1="60" x2="360" y2="60" {...stroke} className="text-navy/40" />
      {bars.map(([row, x, w], i) => (
        <g key={row}>
          <rect x="40" y={84 + row * 36} width="18" height="5" className="fill-navy/25" />
          <rect x={x} y={78 + row * 36} width={w} height="16" className={i < 3 ? "fill-navy" : "fill-navy/25"} />
          {i === 3 && <rect x={x} y={78 + row * 36} width={w * 0.5} height="16" className="fill-navy" />}
        </g>
      ))}
      {/* Milestones */}
      {[[200, 300], [330, 300]].map(([x, y]) => (
        <path key={x} d={`M${x} ${y - 8} l8 8 l-8 8 l-8 -8 Z`} className="fill-gold" />
      ))}
      {/* Progress (status) line */}
      <line x1="230" y1="54" x2="230" y2="306" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 4" vectorEffect="non-scaling-stroke" className="text-maroon" />
      <circle cx="230" cy="54" r="4" className="fill-maroon" />
    </svg>
  );
}

/** Material planning → vendors → delivery to site, with monitoring checkpoints. */
function SupplyFlow() {
  return (
    <svg viewBox="0 0 400 340" className="absolute inset-0 size-full" aria-hidden>
      {/* Vendors */}
      {[90, 170, 250].map((y) => (
        <g key={y}>
          <rect x="44" y={y - 22} width="80" height="44" {...stroke} fill="#fff" className="text-navy/50" />
          <rect x="56" y={y - 8} width="40" height="5" className="fill-navy/25" />
          <rect x="56" y={y + 2} width="26" height="5" className="fill-navy/15" />
        </g>
      ))}
      {/* Routes converge on site */}
      <g {...stroke} className="text-gold">
        {[90, 170, 250].map((y) => (
          <path key={y} d={`M124 ${y} C190 ${y} 200 170 262 170`} strokeDasharray="5 4" />
        ))}
      </g>
      {[[190, 118], [196, 170], [190, 222]].map(([x, y]) => (
        <circle key={y} cx={x} cy={y} r="5" className="fill-gold" />
      ))}
      {/* Site */}
      <g {...stroke} className="text-navy">
        <rect x="262" y="120" width="96" height="100" style={{ fill: "#fff" }} />
        <path d="M276 200 L276 150 L300 136 L324 150 L324 200 M336 200 L336 160 L346 160 L346 200" />
        <line x1="262" y1="200" x2="358" y2="200" />
      </g>
      <rect x="262" y="120" width="96" height="6" className="fill-navy" />
    </svg>
  );
}
