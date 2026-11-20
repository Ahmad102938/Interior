import { cn } from "@/lib/utils";

/**
 * The one header pattern every About section uses: index + eyebrow and the
 * two-line title on the left, supporting copy (or an action) on the right,
 * both sitting on a shared baseline.
 */
export function AboutHeading({
  index,
  eyebrow,
  title,
  accent,
  children,
  tone = "light",
  className,
  end = false,
}: {
  index: string;
  eyebrow: string;
  title: string;
  accent: string;
  children?: React.ReactNode;
  tone?: "light" | "dark";
  className?: string;
  /** Right-align the side slot (for a lone action link). */
  end?: boolean;
}) {
  const dark = tone === "dark";
  return (
    <header className={cn("grid gap-6 lg:grid-cols-12 lg:items-end lg:gap-10", className)} data-reveal>
      <div className="lg:col-span-7">
        <p className={cn("eyebrow flex items-center gap-3", dark ? "text-gold-pale" : "text-gold")}>
          <span className="tabular-nums">{index}</span>
          <span aria-hidden className={cn("h-px w-10", dark ? "bg-gold-pale/50" : "bg-gold/60")} />
          {eyebrow}
        </p>
        <h2 className={cn("display mt-6 text-[2.5rem] sm:text-5xl lg:text-[3.5rem]", dark ? "text-white" : "text-navy")}>
          {title}
          <br />
          <em className={cn("font-normal", dark ? "text-gold-pale" : "text-maroon")}>{accent}</em>
        </h2>
      </div>
      {children && (
        <div className={cn("text-[0.9375rem] leading-relaxed lg:col-span-5 lg:pb-2", end && "lg:justify-self-end", dark ? "text-white/70" : "text-slate")}>{children}</div>
      )}
    </header>
  );
}
