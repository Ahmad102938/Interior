/**
 * Technical line drawings for the service feature sections. They explain where
 * each part of the scope sits — they are schematics, not records of a project,
 * and carry no dimensions, ratings or capacities.
 */

const grid = {
  backgroundImage: "linear-gradient(rgba(23,44,72,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(23,44,72,0.06) 1px, transparent 1px)",
  backgroundSize: "40px 40px",
};

const line = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, vectorEffect: "non-scaling-stroke" as const, strokeLinejoin: "round" as const };
const fine = { ...line, strokeWidth: 1 };

/** Typical telecom site: building with in-building nodes, tower, shelter, power and fibre route. 1000 × 600. */
export function TelecomSiteDrawing() {
  const legs = (y: number) => {
    // Tower tapers from x 380–500 at ground (y 470) to 425–455 at the top (y 70).
    const t = (470 - y) / 400;
    return [380 + 45 * t, 500 - 45 * t] as const;
  };
  const bands = [470, 400, 330, 265, 205, 150, 100];
  return (
    <div className="absolute inset-0 bg-ivory-soft text-navy" style={grid}>
      <svg viewBox="0 0 1000 600" className="absolute inset-0 size-full" aria-hidden>
        {/* Ground and graded site area */}
        <line x1="0" y1="470" x2="1000" y2="470" {...line} />
        <g {...fine} className="text-navy/35">
          {Array.from({ length: 24 }, (_, i) => (
            <line key={i} x1={185 + i * 7} y1="470" x2={178 + i * 7} y2="480" />
          ))}
        </g>
        <path d="M185 462 L360 462" {...fine} strokeDasharray="6 5" className="text-gold" />

        {/* Building with in-building telecom nodes */}
        <g {...line}>
          <rect x="30" y="190" width="140" height="280" />
          {[260, 330, 400].map((y) => (
            <line key={y} x1="30" y1={y} x2="170" y2={y} {...fine} />
          ))}
        </g>
        <g className="text-gold">
          {[225, 295, 365].map((y) => (
            <g key={y}>
              <circle cx="100" cy={y} r="5" fill="currentColor" />
              <path d={`M88 ${y - 12} A16 16 0 0 1 112 ${y - 12}`} {...fine} />
            </g>
          ))}
          <path d="M100 225 L100 365" {...fine} strokeDasharray="3 4" />
        </g>

        {/* Foundation below the tower */}
        <g {...line}>
          <path d="M360 470 L360 540 L520 540 L520 470" />
          <path d="M380 470 L380 530 M500 470 L500 530" {...fine} />
        </g>
        <g className="text-navy/30" {...fine}>
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={362 + i * 15} y1="538" x2={372 + i * 15} y2="528" />
          ))}
        </g>

        {/* Lattice tower */}
        <g {...line}>
          <path d="M380 470 L425 70 M500 470 L455 70" />
          {bands.map((y) => {
            const [l, r] = legs(y);
            return <line key={y} x1={l} y1={y} x2={r} y2={y} {...fine} />;
          })}
          {bands.slice(0, -1).map((y, i) => {
            const [l1, r1] = legs(y);
            const [l2, r2] = legs(bands[i + 1]);
            return <path key={y} d={`M${l1} ${y} L${r2} ${bands[i + 1]} M${r1} ${y} L${l2} ${bands[i + 1]}`} {...fine} />;
          })}
          {/* Platforms and antennas */}
          <path d="M405 150 L475 150 M412 100 L468 100" />
        </g>
        <g className="text-gold" {...line}>
          {[402, 470].map((x) => (
            <rect key={x} x={x - 4} y="76" width="8" height="30" />
          ))}
          <rect x="434" y="62" width="8" height="30" />
          <circle cx="478" cy="138" r="9" />
          <circle cx="402" cy="138" r="9" />
        </g>

        {/* Feeder from tower to shelter */}
        <path d="M480 440 L585 440" {...fine} strokeDasharray="4 4" />

        {/* Equipment shelter: DG, battery bank, SMPS */}
        <g {...line}>
          <rect x="585" y="370" width="120" height="100" />
          <path d="M580 370 L645 350 L710 370" />
        </g>
        <g {...fine}>
          <rect x="597" y="400" width="30" height="58" />
          {[410, 422, 434, 446].map((y) => (
            <line key={y} x1="633" y1={y} x2="663" y2={y} />
          ))}
          <rect x="633" y="400" width="30" height="58" />
          <rect x="671" y="400" width="24" height="58" />
          <line x1="675" y1="412" x2="691" y2="412" />
          <line x1="675" y1="420" x2="691" y2="420" />
        </g>

        {/* Electrical supply */}
        <g {...line}>
          <path d="M800 470 L800 300 M780 312 L820 312" />
        </g>
        <path d="M705 400 Q760 340 800 312" {...fine} className="text-gold" />

        {/* Fibre and duct route in a trench */}
        <g {...line}>
          <path d="M705 470 L705 560 L990 560 L990 470" {...fine} strokeDasharray="5 4" />
        </g>
        <g className="text-gold" {...line}>
          {[740, 790, 840, 890, 940].map((x) => (
            <circle key={x} cx={x} cy="535" r="9" />
          ))}
          <path d="M705 535 L990 535" {...fine} strokeDasharray="2 6" />
        </g>
      </svg>
    </div>
  );
}

/** Ground-mounted array in cross-section, from graded ground to the AC side. Viewport 1000 × 410 (y 150–560). */
export function SolarArrayDrawing() {
  const angle = -29.2; // rafter from (120, 400) to (460, 210)
  return (
    <div className="absolute inset-0 bg-ivory-soft text-emerald" style={grid}>
      <svg viewBox="0 150 1000 410" className="absolute inset-0 size-full" aria-hidden>
        {/* Ground: graded on the left, then the working platform */}
        <line x1="0" y1="480" x2="1000" y2="480" {...line} />
        <path d="M0 470 Q60 455 110 480" {...fine} strokeDasharray="5 4" className="text-emerald/50" />
        <g className="text-gold" {...fine}>
          {[30, 70, 110].map((x) => (
            <path key={x} d={`M${x} 480 L${x} 492 M${x - 6} 492 L${x + 6} 492`} />
          ))}
        </g>

        {/* Piles */}
        <g {...line}>
          {[180, 380].map((x) => (
            <rect key={x} x={x - 8} y="480" width="16" height="66" />
          ))}
        </g>
        <g className="text-emerald/30" {...fine}>
          {Array.from({ length: 30 }, (_, i) => (
            <line key={i} x1={i * 34} y1="500" x2={i * 34 + 10} y2="490" />
          ))}
        </g>

        {/* Mounting structure: posts, brace, rafter */}
        <g {...line}>
          <path d="M180 480 L180 366 M380 480 L380 255 M180 470 L380 300" />
          <path d="M120 400 L460 210" />
        </g>

        {/* Module: dark cells in a metal frame — drawn true to the material, not tinted */}
        <g transform={`translate(120 400) rotate(${angle})`}>
          <rect x="0" y="-22" width="390" height="16" fill="#1d2633" stroke="#8d97a3" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          {Array.from({ length: 11 }, (_, i) => (
            <line key={i} x1={32 + i * 32.5} y1="-22" x2={32 + i * 32.5} y2="-6" stroke="#55606d" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          ))}
        </g>

        {/* DC cabling to a combiner, then the inverter */}
        <path d="M440 222 L440 250 Q445 300 520 380 L540 380" {...fine} className="text-gold" />
        <g {...line}>
          <rect x="540" y="365" width="40" height="40" />
          <path d="M580 395 L660 395" {...fine} className="text-gold" />
          <rect x="660" y="330" width="80" height="150" />
          <path d="M675 350 L725 350 M675 362 L725 362" {...fine} />
          <path d="M690 420 l10 -16 l10 16" {...fine} />
        </g>

        {/* AC side: cable route to the LT panel / transformer */}
        <path d="M740 455 L840 455" {...fine} strokeDasharray="5 4" className="text-gold" />
        <g {...line}>
          <rect x="840" y="360" width="90" height="120" />
          <circle cx="870" cy="400" r="14" {...fine} />
          <circle cx="900" cy="400" r="14" {...fine} />
        </g>
      </svg>
    </div>
  );
}
