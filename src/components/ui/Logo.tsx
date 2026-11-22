import Link from "next/link";
import { useId } from "react";
import { cn } from "@/lib/utils";

/*
 * Vector redraw of the supplied logo (public/logo.jpg, 246×87 raster): sun,
 * solar panel and leaf around a lattice telecom tower, the "Adidev" wordmark
 * and the orange "Commitment First" band. Drawn in a 984×348 space (4× the
 * original) so proportions match the source.
 */

const BRAND = { sun: "#F28C28", ray: "#F6C46A", leaf: "#3E9B3A", vein: "#A8D88A", band: "#EE8A2C", bandText: "#FFF6EA" };

type P = [number, number];
const lerp = (a: P, b: P, t: number): P => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
const pt = (p: P) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;

// Solar panel: a curved wedge wrapping the sun, its right edge along the tower leg
const PANEL_TOP: P = [206, 92];
const PANEL_FOOT: P = [176, 238];
const PANEL_LEFT: P = [110, 236];
const curve = (t: number): P => {
  // cubic from PANEL_LEFT (t=0) up to PANEL_TOP (t=1)
  const c1: P = [126, 160];
  const c2: P = [164, 112];
  const u = 1 - t;
  return [
    u * u * u * PANEL_LEFT[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * PANEL_TOP[0],
    u * u * u * PANEL_LEFT[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * PANEL_TOP[1],
  ];
};
const edge = (t: number) => lerp(PANEL_FOOT, PANEL_TOP, t);
const PANEL = `M${pt(PANEL_LEFT)} C126 160 164 112 ${pt(PANEL_TOP)} L${pt(PANEL_FOOT)} Z`;
const PANEL_GRID = [
  ...[1, 2, 3, 4, 5, 6].map((i) => `M${pt(curve(i / 7))} L${pt(edge(i / 7))}`),
  ...[1 / 3, 2 / 3].map((u) => "M" + Array.from({ length: 13 }, (_, i) => pt(lerp(curve(i / 12), edge(i / 12), u))).join(" L")),
].join(" ");

// Sun rays around the upper-left half of the disc
const SUN: P = [118, 122];
const RAYS = Array.from({ length: 9 }, (_, i) => {
  const a = ((135 + i * 22.5) * Math.PI) / 180;
  const at = (r: number): P => [SUN[0] + Math.cos(a) * r, SUN[1] + Math.sin(a) * r];
  return `M${pt(at(62))} L${pt(at(92))}`;
}).join(" ");

// Lattice tower: apex over two splayed legs, X-braced between levels
const APEX: P = [224, 52];
const legL = (y: number): P => [224 - (44 * (y - 52)) / 190, y];
const legR = (y: number): P => [224 + (40 * (y - 52)) / 190, y];
const LEVELS = [96, 146, 196, 242];
const TOWER_LEGS = `M${pt(legL(242))} L${pt(APEX)} L${pt(legR(242))}`;
const TOWER_BRACING = LEVELS.map((y, i) => {
  const bar = `M${pt(legL(y))} L${pt(legR(y))}`;
  if (i === 0) return bar;
  const up = LEVELS[i - 1];
  return `${bar} M${pt(legL(up))} L${pt(legR(y))} M${pt(legR(up))} L${pt(legL(y))}`;
}).join(" ");

/** The emblem alone (sun, panel, leaf, tower) — square-ish crop for icons. */
export function LogoMark({ tone = "dark", className }: { tone?: "light" | "dark"; className?: string }) {
  return (
    <svg viewBox="12 4 262 248" className={className} aria-hidden>
      <Emblem ink={tone === "dark" ? "#172C48" : "#F7EFE2"} />
    </svg>
  );
}

function Emblem({ ink }: { ink: string }) {
  const gradient = `adidev-panel-${useId()}`;
  return (
    <>
      <defs>
        <linearGradient id={gradient} x1="0" y1="1" x2="0.4" y2="0">
          <stop offset="0" stopColor="#4C6CB0" />
          <stop offset="1" stopColor="#A9B9E3" />
        </linearGradient>
      </defs>
      <path d={RAYS} stroke={BRAND.ray} strokeWidth={13} strokeLinecap="round" />
      <circle cx={SUN[0]} cy={SUN[1]} r={46} fill={BRAND.sun} />
      <path d={PANEL} fill={`url(#${gradient})`} />
      <path d={PANEL_GRID} stroke="#FFFFFF" strokeOpacity={0.85} strokeWidth={3.5} fill="none" />
      <path d="M22 192 C56 164 102 176 116 230 C80 238 40 224 22 192 Z" fill={BRAND.leaf} />
      <path d="M32 194 Q74 198 110 226" stroke={BRAND.vein} strokeWidth={4} strokeLinecap="round" fill="none" />
      <g stroke={ink} strokeLinecap="round" strokeLinejoin="round" fill="none">
        <path d={TOWER_LEGS} strokeWidth={9} />
        <path d={TOWER_BRACING} strokeWidth={5} />
        <path d="M224 52 V18" strokeWidth={6} />
        <path d="M212 12 A16 16 0 0 0 212 36 M236 12 A16 16 0 0 1 236 36 M202 2 A28 28 0 0 0 202 46 M246 2 A28 28 0 0 1 246 46" strokeWidth={5} />
      </g>
    </>
  );
}

/** Full lockup: emblem, wordmark and the "Commitment First" band. */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const ink = tone === "dark" ? "#172C48" : "#F7EFE2";
  return (
    <Link href="/" className={cn("group flex items-center", className)}>
      <span className="sr-only">Adidev — Commitment First, home</span>
      <svg viewBox="12 -4 960 352" className="h-11 w-auto lg:h-12" aria-hidden>
        <Emblem ink={ink} />
        <text
          x={292}
          y={240}
          textLength={672}
          lengthAdjust="spacing"
          fill={ink}
          style={{ fontFamily: "var(--font-display)", fontSize: 284, fontWeight: 600 }}
        >
          Adidev
        </text>
        <rect x={16} y={264} width={950} height={78} rx={12} fill={BRAND.band} />
        <text
          x={491}
          y={325}
          textAnchor="middle"
          textLength={720}
          lengthAdjust="spacing"
          fill={BRAND.bandText}
          style={{ fontFamily: "var(--font-sans)", fontSize: 60, fontWeight: 600 }}
        >
          Commitment First
        </text>
      </svg>
    </Link>
  );
}
