import { Button } from "@/components/ui/Button";

/** Closing invitation — a calm, centred light panel ahead of the maroon footer. */
export function AboutCta() {
  return (
    <section data-nav-theme="light" className="section-y bg-white">
      <div className="container-page flex flex-col items-center text-center" data-reveal>
        <span aria-hidden className="h-px w-14 bg-gold" />
        <h2 className="display mt-8 text-[2.5rem] text-navy sm:text-5xl lg:text-[3.5rem]">
          Talk to the team
          <br />
          <em className="font-normal text-maroon">that plans it and builds it.</em>
        </h2>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Button href="/request-a-quote" variant="primary">
            Request a quote
          </Button>
          <Button href="/projects" variant="outline-dark">
            View projects
          </Button>
        </div>
      </div>
    </section>
  );
}
