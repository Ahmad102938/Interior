import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { storyIntro, storyOutro, type StoryChapter } from "@/data/story";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/** Opening frame copy — HTML over the 3D world, never rendered in the canvas. */
export function IntroPanel({ className }: { className?: string }) {
  return (
    <div className={cn("max-w-[40rem]", className)}>
      <p className="eyebrow flex items-center gap-3 text-gold-pale">
        <span aria-hidden className="h-px w-10 bg-gold-pale/60" />
        {storyIntro.eyebrow}
      </p>
      <h1 className={"display mt-4 text-[2.75rem] text-white sm:text-6xl md:mt-6 lg:text-[5.5rem] [@media(max-height:700px)_and_(max-width:767px)]:text-[2.25rem]"}>
        {storyIntro.title}
        <br />
        <em className="font-normal text-gold-pale">{storyIntro.accent}</em>
      </h1>
      <p className="mt-4 max-w-[30rem] text-[0.9375rem] leading-relaxed text-white/75 md:mt-7 md:text-base lg:text-[1.0625rem]">{storyIntro.copy}</p>
      <div className="mt-6 flex flex-wrap gap-3 md:mt-9">
        <Button href={storyIntro.primary.href} variant="primary">
          {storyIntro.primary.label}
        </Button>
        <Button href={storyIntro.secondary.href} variant="outline-light">
          {storyIntro.secondary.label}
        </Button>
      </div>
    </div>
  );
}

export function ChapterPanel({
  chapter,
  final = false,
  className,
  headingLevel: H = "h2",
}: {
  chapter: StoryChapter;
  final?: boolean;
  className?: string;
  headingLevel?: "h2" | "h3";
}) {
  return (
    <div className={cn("max-w-[34rem]", className)}>
      <p className="eyebrow flex items-center gap-3 text-gold-pale">
        <span className="font-display text-lg tracking-normal text-white/90 tabular-nums">{chapter.number}</span>
        <span aria-hidden className="h-px w-10 bg-gold-pale/60" />
        {chapter.label}
      </p>
      <H className={"display mt-4 text-[2.375rem] text-white sm:text-5xl md:mt-6 lg:text-[4.25rem] [@media(max-height:700px)_and_(max-width:767px)]:text-[1.875rem]"}>{chapter.heading}</H>
      <p className="mt-4 max-w-[28rem] text-[0.9375rem] leading-relaxed text-white/75 md:mt-6 md:text-base lg:text-[1.0625rem]">{chapter.copy}</p>
      <ul aria-label={`${chapter.label} scope`} className="mt-5 hidden flex-wrap gap-2 md:mt-7 md:flex">
        {chapter.tags.map((t) => (
          <li key={t} className="border border-white/20 bg-white/5 px-3 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-white/80 backdrop-blur-[2px]">
            {t}
          </li>
        ))}
      </ul>
      {final && (
        <div className="mt-7 flex flex-col items-start gap-5 md:mt-9">
          <div className="flex flex-wrap gap-3">
            <Button href={storyOutro.primary.href} variant="primary">
              {storyOutro.primary.label}
            </Button>
            <Button href={storyOutro.secondary.href} variant="outline-light">
              {storyOutro.secondary.label}
            </Button>
          </div>
          <Link href={storyOutro.alsoHref} className="group inline-flex min-h-11 items-center gap-2 text-sm text-white/65 transition-colors hover:text-gold-pale">
            {storyOutro.alsoLine}
            <ArrowUpRight aria-hidden className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      )}
    </div>
  );
}
