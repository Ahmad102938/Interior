import { cn } from "@/lib/utils";

type Props = {
  index?: string;
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  intro?: React.ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "split";
  className?: string;
  as?: "h1" | "h2";
};

/** Section header: numbered eyebrow, serif title with an italic accent line, optional intro. */
export function SectionHeading({ index, eyebrow, title, accent, intro, tone = "light", align = "left", className, as: H = "h2" }: Props) {
  const dark = tone === "dark";
  return (
    <div className={cn(align === "split" && "grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end", className)}>
      <div>
        <p className={cn("eyebrow flex items-center gap-3", dark ? "text-gold-pale" : "text-gold")}>
          {index && <span className="tabular-nums">{index}</span>}
          <span aria-hidden className={cn("h-px w-10", dark ? "bg-gold-pale/50" : "bg-gold/60")} />
          {eyebrow}
        </p>
        <H className={cn("display mt-5 text-[2.5rem] sm:text-5xl lg:text-[4rem]", dark ? "text-white" : "text-navy")}>
          {title}
          {accent && (
            <>
              <br />
              <em className={cn("font-normal", dark ? "text-gold-pale" : "text-maroon")}>{accent}</em>
            </>
          )}
        </H>
      </div>
      {intro && (
        <p className={cn("max-w-xl text-base leading-relaxed lg:text-[1.0625rem]", align === "left" && "mt-6", dark ? "text-white/70" : "text-slate")}>
          {intro}
        </p>
      )}
    </div>
  );
}
