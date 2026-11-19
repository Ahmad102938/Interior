import { Button } from "@/components/ui/Button";

export function CtaBanner({ title = "Have a project in mind?", copy = "Share your drawings, BOQ or a short brief — our team will review it and respond." }: { title?: string; copy?: string }) {
  return (
    <section data-nav-theme="dark" className="bg-maroon text-white">
      <div className="container-page flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div>
          <h2 className="display text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-3 max-w-xl text-white/75">{copy}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/request-a-quote" variant="outline-light" className="border-gold-pale/60 bg-white/5">
            Request a quote
          </Button>
          <Button href="/contact" variant="ghost-light" className="px-4!">
            Contact us
          </Button>
        </div>
      </div>
    </section>
  );
}
