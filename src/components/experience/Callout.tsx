import { cn } from "@/lib/utils";

const RISE = 26; // px — diagonal part of the leader

/**
 * Architectural callout pinned to a point on the 3D model: a pulsing gold
 * marker, a leader line that draws itself out, and a box-less label — the
 * annotation language of a drawing set rather than a UI tooltip.
 *
 * The 3D scene writes `transform` (anchor position) and `--o` (0→1 reveal)
 * on the root element every frame; everything else is CSS.
 */
export function Callout({
  label,
  detail,
  side,
  reach,
  elRef,
}: {
  label: string;
  detail: string;
  side: "left" | "right";
  reach: number;
  elRef: (el: HTMLDivElement | null) => void;
}) {
  const len = RISE * Math.SQRT2 + reach;
  const right = side === "right";
  return (
    <div
      ref={elRef}
      className="absolute top-0 left-0 will-change-transform"
      style={{ opacity: 0, ["--o" as string]: 0 }}
    >
      {/* Marker */}
      <span aria-hidden className="absolute top-0 left-0 block -translate-1/2">
        <span className="absolute top-1/2 left-1/2 block size-6 -translate-1/2 animate-[callout-pulse_2.4s_ease-out_infinite] rounded-full border border-gold-pale/60" />
        <span className="relative block size-2.5 rounded-full border border-gold-pale bg-gold shadow-[0_0_12px_rgba(216,183,122,0.9)]" />
      </span>

      {/* Leader line */}
      <svg
        aria-hidden
        className="absolute top-0 overflow-visible"
        style={{ left: 0, transform: right ? undefined : "scaleX(-1)" }}
        width={RISE + reach}
        height={RISE}
      >
        <path
          d={`M 0 0 L ${RISE} ${-RISE} L ${RISE + reach} ${-RISE}`}
          fill="none"
          stroke="rgba(216,195,152,0.85)"
          strokeWidth={1}
          style={{ strokeDasharray: len, strokeDashoffset: `calc(${len}px * (1 - var(--o)))` }}
        />
      </svg>

      {/* Label */}
      <div
        className={cn("absolute whitespace-nowrap [text-shadow:0_1px_10px_rgba(5,10,20,0.9)]", right ? "text-left" : "text-right")}
        style={{
          bottom: RISE + 6,
          [right ? "left" : "right"]: RISE + 4,
          opacity: "clamp(0, calc((var(--o) - 0.45) * 2.2), 1)",
          transform: "translateY(calc((1 - var(--o)) * 6px))",
        }}
      >
        <p className="text-[0.625rem] font-semibold uppercase tracking-[0.22em] text-gold-pale">{label}</p>
        <p className="mt-0.5 font-display text-[1.0625rem] italic leading-tight text-white">{detail}</p>
      </div>
    </div>
  );
}
