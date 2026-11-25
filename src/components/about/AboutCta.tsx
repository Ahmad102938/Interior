import { Button } from "@/components/ui/Button";
import { aboutPage } from "@/content/pages/about";

const c = aboutPage.cta;

/** Closing invitation — a calm, centred light panel ahead of the maroon footer. */
export function AboutCta() {
  return (
    <section data-nav-theme="light" className="section-y bg-white">
      <div className="container-page flex flex-col items-center text-center" data-reveal>
        <span aria-hidden className="h-px w-14 bg-gold" />
        <h2 className="display mt-8 text-[2.5rem] text-navy sm:text-5xl lg:text-[3.5rem]">
          {c.title}
          <br />
          <em className="font-normal text-maroon">{c.accent}</em>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href={c.primary.href} variant="primary">
            {c.primary.label}
          </Button>
          <Button href={c.secondary.href} variant="outline-dark">
            {c.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
