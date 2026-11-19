import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  eyebrow: string;
  title: React.ReactNode;
  accent?: React.ReactNode;
  intro?: React.ReactNode;
  /** Tailwind background class — defaults to navy; verticals pass their colour. */
  bg?: string;
  accentClass?: string;
  image?: { src: string; alt: string; caption?: string };
  crumbs?: { label: string; href?: string }[];
  children?: React.ReactNode;
};

export function PageHero({ eyebrow, title, accent, intro, bg = "bg-navy", accentClass = "text-gold-pale", image, crumbs, children }: Props) {
  return (
    <section data-nav-theme="overlay" className={cn("relative overflow-hidden text-white", bg)}>
      {image && (
        <div className="absolute inset-0 lg:left-[42%]">
          <Image src={image.src} alt={image.alt} fill priority sizes="(min-width: 1024px) 58vw, 100vw" className="object-cover" />
          <div aria-hidden className={cn("absolute inset-0 opacity-90 lg:opacity-100", bg)} style={{ maskImage: "linear-gradient(90deg, #000 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.05) 100%)" }} />
          {image.caption && (
            <p className="absolute right-4 bottom-4 hidden bg-black/40 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/75 lg:block">{image.caption}</p>
          )}
        </div>
      )}
      <div className="container-page relative pt-36 pb-16 lg:pt-48 lg:pb-24">
        {crumbs && (
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-1.5 text-xs text-white/55">
              {crumbs.map((c, i) => (
                <li key={c.label} className="flex items-center gap-1.5">
                  {i > 0 && <ChevronRight aria-hidden className="size-3" />}
                  {c.href ? (
                    <Link href={c.href} className="hover:text-white">
                      {c.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white/80">
                      {c.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className="max-w-3xl">
          <p className={cn("eyebrow flex items-center gap-3", accentClass)}>
            <span aria-hidden className="h-px w-10 bg-current opacity-60" />
            {eyebrow}
          </p>
          <h1 className="display mt-6 text-[2.75rem] sm:text-6xl lg:text-7xl">
            {title}
            {accent && (
              <>
                <br />
                <em className={cn("font-normal", accentClass)}>{accent}</em>
              </>
            )}
          </h1>
          {intro && <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 lg:text-lg">{intro}</p>}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Navigation placeholder while a dynamic page streams in. */
export function HeroShell() {
  return <section data-nav-theme="dark" aria-busy="true" className="min-h-[60svh] bg-navy" />;
}
