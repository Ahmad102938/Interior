import type { VerticalKey } from "@/config/theme";
import type { Surface } from "@/data/services";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";

export const quoteHref = (key: VerticalKey) => `/request-a-quote?vertical=${key}`;
/** Last service division viewed this session — lets general enquiry CTAs pre-select it. */
export const LAST_VERTICAL_KEY = "adidev:last-vertical";

/** Background, text tone and navbar theme for a section surface. */
export function surface(s: Surface, key: VerticalKey) {
  const dark = s === "brand";
  return {
    dark,
    navTheme: dark ? "dark" : "light",
    className: cn(dark ? cn(verticalClasses[key].bg, "text-white") : s === "ivory" ? "bg-ivory" : "bg-white"),
  } as const;
}

/** "01, 02, 03, 05" → "01–03, 05" */
export function formatCovers(numbers: string[]) {
  const n = numbers.map(Number);
  const out: string[] = [];
  for (let i = 0; i < n.length; i++) {
    let j = i;
    while (j + 1 < n.length && n[j + 1] === n[j] + 1) j++;
    out.push(j - i >= 2 ? `${numbers[i]}–${numbers[j]}` : numbers.slice(i, j + 1).join(", "));
    i = j;
  }
  return out.join(", ");
}

/** Drafting-style corner marks in antique gold. */
export function Corners({ className }: { className?: string }) {
  const c = "absolute size-5 border-gold/70";
  return (
    <span aria-hidden className={cn("pointer-events-none absolute -inset-2", className)}>
      <span className={cn(c, "top-0 left-0 border-t border-l")} />
      <span className={cn(c, "top-0 right-0 border-t border-r")} />
      <span className={cn(c, "bottom-0 left-0 border-b border-l")} />
      <span className={cn(c, "right-0 bottom-0 border-r border-b")} />
    </span>
  );
}
