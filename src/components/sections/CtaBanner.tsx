import { Button } from "@/components/ui/Button";
import { sharedContent } from "@/content/pages/shared";

const defaults = sharedContent.ctaBanner;

export function CtaBanner({ title = defaults.title, copy = defaults.copy }: { title?: string; copy?: string }) {
  return (
    <section data-nav-theme="dark" className="bg-maroon text-white">
      <div className="container-page flex flex-col gap-8 py-14 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div>
          <h2 className="display text-4xl lg:text-5xl">{title}</h2>
          <p className="mt-3 max-w-xl text-white/75">{copy}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={defaults.primary.href} variant="outline-light" className="border-gold-pale/60 bg-white/5">
            {defaults.primary.label}
          </Button>
          <Button href={defaults.secondary.href} variant="ghost-light" className="px-4!">
            {defaults.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
