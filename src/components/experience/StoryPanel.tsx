import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { company } from "@/data/company";
import { serviceHref, type Vertical } from "@/data/verticals";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Opening frame copy — HTML over the 3D world, never rendered in the canvas. */
export function IntroPanel({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-[40rem]", className)}>
      <p className="eyebrow flex items-center gap-3 text-gold-pale">
        <span aria-hidden className="h-px w-10 bg-gold-pale/60" />
        {company.positioning}
      </p>
      <h1 className="display mt-4 text-[2.375rem] text-white sm:text-6xl md:mt-6 lg:text-[5.25rem] [@media(max-height:700px)_and_(max-width:767px)]:text-[2rem]">
        {company.tagline[0]}
        <br />
        <em className="font-normal text-gold-pale">{company.tagline[1]}</em>
      </h1>
      <p className="mt-4 max-w-[34rem] text-[0.9375rem] leading-relaxed text-white/75 md:mt-7 md:text-base lg:text-[1.0625rem]">{company.heroIntro}</p>
      <div className="mt-6 flex flex-wrap gap-3 md:mt-9">
        <Button href="#verticals" variant="primary">
          Explore our capabilities
        </Button>
        <Button href="#contact" variant="outline-light">
          Request a quote
        </Button>
      </div>
    </div>
  );
}

export function ChapterPanel({ vertical, className, headingLevel: H = "h2" }: { vertical: Vertical; className?: string; headingLevel?: "h2" | "h3" }) {
  return (
    <div className={cn("max-w-[36rem]", className)}>
      <p className="eyebrow flex items-center gap-3 text-gold-pale">
        <span className="font-display text-lg tracking-normal text-white/90 tabular-nums">{vertical.number}</span>
        <span aria-hidden className="h-px w-10 bg-gold-pale/60" />
        {vertical.title}
      </p>
      <H className="display mt-4 text-[2.25rem] text-white sm:text-5xl md:mt-6 lg:text-[4rem] [@media(max-height:700px)_and_(max-width:767px)]:text-[1.875rem]">{vertical.story.heading}</H>
      <p className="mt-4 max-w-[30rem] text-[0.9375rem] leading-relaxed text-white/75 md:mt-6 md:text-base lg:text-[1.0625rem]">{vertical.story.copy}</p>
      <Link
        href={serviceHref(vertical)}
        className="group mt-6 inline-flex min-h-12 md:mt-9 items-center gap-3 border-b border-gold-pale/50 pb-1 text-[0.8125rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white hover:text-gold-pale"
      >
        {vertical.story.cta}
        <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </Link>
    </div>
  );
}
