import Image from "next/image";
import type { VerticalKey } from "@/config/theme";
import { cn } from "@/lib/utils";
import { SHOW_UNVERIFIED } from "@/lib/content";

type Props = {
  /** Approved photograph. When absent a branded placeholder is shown. */
  src?: string;
  alt: string;
  /** Describes the photograph this slot expects — shown on the placeholder. */
  slot: string;
  vertical?: VerticalKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  /** Small caption over a real image, e.g. to mark an illustrative render. */
  caption?: string;
  /** CSS object-position — which part of the photo stays in frame. */
  position?: string;
};

const tints: Record<VerticalKey | "neutral", string> = {
  telecom: "from-navy via-[#1f3a5c] to-navy-deep",
  solar: "from-emerald via-[#24684a] to-[#123a29]",
  civil: "from-charcoal via-[#3a3d40] to-[#1c1d1f]",
  interiors: "from-maroon via-[#6b2836] to-[#3d141d]",
  neutral: "from-navy via-[#22395a] to-charcoal",
};

/**
 * Image slot. Renders next/image for real assets, or a restrained technical
 * placeholder (line drawing + slot description) that is clearly replaceable.
 */
export function MediaSlot({ src, alt, slot, vertical, className, sizes = "(min-width: 1024px) 50vw, 100vw", priority, caption, position }: Props) {
  if (src) {
    return (
      <div className={cn("relative overflow-hidden bg-navy", className)}>
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" style={{ objectPosition: position }} />
        {caption && (
          <p className="absolute bottom-3 left-3 bg-black/45 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/80 backdrop-blur-sm">
            {caption}
          </p>
        )}
      </div>
    );
  }
  return (
    <div role="img" aria-label={alt} className={cn("relative overflow-hidden bg-linear-to-br", tints[vertical ?? "neutral"], className)}>
      <div
        aria-hidden
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <Drawing vertical={vertical} />
      {/* Slot description is a development aid only — production shows the clean placeholder. */}
      {SHOW_UNVERIFIED && (
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-linear-to-t from-black/45 to-transparent p-4 pt-12">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/75">Image slot · {slot}</p>
        </div>
      )}
    </div>
  );
}

function Drawing({ vertical }: { vertical?: VerticalKey }) {
  const stroke = "rgba(216,195,152,0.38)";
  const common = { fill: "none", stroke, strokeWidth: 1, vectorEffect: "non-scaling-stroke" as const };
  return (
    <svg aria-hidden viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full">
      <line x1="0" y1="215" x2="400" y2="215" {...common} />
      {vertical === "telecom" && (
        <g {...common}>
          <path d="M200 30 L170 215 M200 30 L230 215" />
          {[60, 95, 130, 165, 200].map((y, i) => {
            const w = 4 + i * 5.5;
            return <path key={y} d={`M${200 - w} ${y} L${200 + w} ${y} M${200 - w} ${y} L${200 + w + 5} ${y + 35} M${200 + w} ${y} L${200 - w - 5} ${y + 35}`} />;
          })}
          <rect x="186" y="42" width="6" height="18" />
          <rect x="208" y="42" width="6" height="18" />
          <circle cx="226" cy="75" r="8" />
          <rect x="260" y="185" width="44" height="30" />
        </g>
      )}
      {vertical === "solar" && (
        <g {...common}>
          {[0, 1, 2, 3].map((r) => (
            <g key={r} transform={`translate(${40 + r * 12} ${70 + r * 38})`}>
              <path d="M0 22 L300 22 L290 0 L12 0 Z" />
              {Array.from({ length: 11 }, (_, i) => (
                <line key={i} x1={12 + i * 25.3} y1="0" x2={i * 27.3} y2="22" />
              ))}
              <line x1="40" y1="22" x2="40" y2="34" />
              <line x1="260" y1="22" x2="260" y2="34" />
            </g>
          ))}
        </g>
      )}
      {vertical === "civil" && (
        <g {...common}>
          {[70, 130, 190, 250, 310].map((x) => (
            <path key={x} d={`M${x} 215 L${x} 110 L${x + 30} 85 L${x + 60} 110`} />
          ))}
          <path d="M70 110 L370 110 M70 85 L370 85" strokeDasharray="4 4" />
          {[70, 130, 190, 250, 310, 370].map((x) => (
            <rect key={x} x={x - 6} y="210" width="12" height="8" />
          ))}
          <path d="M40 215 L40 40 M20 50 L150 50 M40 40 L60 50" />
        </g>
      )}
      {vertical === "interiors" && (
        <g {...common}>
          <path d="M60 215 L140 150 L260 150 L340 215" />
          <path d="M140 150 L140 40 L260 40 L260 150" />
          <path d="M60 20 L140 40 M340 20 L260 40" />
          {[165, 190, 215, 240].map((x) => (
            <line key={x} x1={x} y1="40" x2={x} y2="150" />
          ))}
          <rect x="160" y="165" width="80" height="10" />
          {[150, 180, 210].map((x) => (
            <line key={x} x1={x} y1="58" x2={x + 40} y2="58" strokeWidth="2" />
          ))}
        </g>
      )}
      {!vertical && (
        <g {...common}>
          <path d="M40 215 L120 120 L200 170 L280 80 L360 140" />
          <circle cx="280" cy="80" r="4" />
        </g>
      )}
    </svg>
  );
}
