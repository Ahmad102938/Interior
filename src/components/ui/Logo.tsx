import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark placeholder — replace with the client's original SVG logo when supplied. */
export function Logo({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const dark = tone === "dark";
  return (
    <Link href="/" aria-label="ADIDEV — home" className={cn("group flex items-center gap-3", className)}>
      <span aria-hidden className={cn("grid size-9 place-items-center border", dark ? "border-navy/30" : "border-gold/60")}>
        <span className={cn("font-display text-xl leading-none", dark ? "text-maroon" : "text-gold-pale")}>A</span>
      </span>
      <span className="leading-none">
        <span className={cn("block font-display text-[1.375rem] font-semibold tracking-[0.2em]", dark ? "text-navy" : "text-white")}>ADIDEV</span>
        <span className={cn("mt-1 block text-[0.5625rem] font-semibold uppercase tracking-[0.2em] max-[359px]:hidden lg:max-xl:hidden", dark ? "text-slate" : "text-white/55")}>
          Engineering & Infrastructure
        </span>
      </span>
    </Link>
  );
}
