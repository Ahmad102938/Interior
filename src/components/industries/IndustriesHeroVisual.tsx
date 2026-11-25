import Image from "next/image";
import { industriesPage } from "@/content/pages/industries";

/** Edit in src/content/pages/industries.ts (hero.images). */
const shots = industriesPage.hero.images;

/** Drafting-style corner mark in antique gold. */
function Corner({ className }: { className: string }) {
  return <span aria-hidden className={`absolute size-5 border-gold/70 ${className}`} />;
}

/**
 * Hero composition for /industries (large screens): one dominant built
 * environment, an engineering-coordination inset and an interior inset —
 * the range of settings the page covers, without a second 3D experience.
 */
export function IndustriesHeroVisual() {
  return (
    <figure className="relative mt-14 hidden h-[30rem] lg:mt-0 lg:block xl:h-[32rem]">
      <div className="absolute inset-y-0 right-0 left-[14%] overflow-hidden">
        <Image src={shots.main.src} alt={shots.main.alt} fill priority sizes="(min-width: 1280px) 560px, 46vw" className="object-cover" style={{ objectPosition: shots.main.position }} />
        <div aria-hidden className="absolute inset-0 bg-linear-to-r from-navy/55 via-navy/10 to-transparent" />
      </div>
      <div className="absolute top-8 left-0 aspect-[4/3] w-[42%] overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <Image src={shots.plan.src} alt={shots.plan.alt} fill sizes="240px" className="object-cover" style={{ objectPosition: shots.plan.position }} />
      </div>
      <div className="absolute bottom-10 left-[6%] aspect-[5/4] w-[34%] overflow-hidden shadow-[0_24px_60px_-20px_rgba(0,0,0,0.6)] ring-1 ring-white/10">
        <Image src={shots.interior.src} alt={shots.interior.alt} fill sizes="200px" className="object-cover" style={{ objectPosition: shots.interior.position }} />
      </div>
      <Corner className="-top-3 -right-3 border-t border-r" />
      <Corner className="-right-3 -bottom-3 border-r border-b" />
      {shots.main.caption && (
        <figcaption className="absolute right-4 bottom-4 bg-black/40 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.16em] text-white/75">
          {shots.main.caption}
        </figcaption>
      )}
    </figure>
  );
}
