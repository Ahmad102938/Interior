"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/ui/Button";
import { LAST_VERTICAL_KEY } from "@/components/services/shared";
import { capabilitiesPage } from "@/content/pages/capabilities";

const c = capabilitiesPage.cta;

const noop = () => () => {};
const read = () => {
  try {
    return sessionStorage.getItem(LAST_VERTICAL_KEY);
  } catch {
    return null;
  }
};

/** Final enquiry. Pre-selects the division the visitor last viewed, when there is one. */
export function CapabilitiesCta() {
  const vertical = useSyncExternalStore(noop, read, () => null);
  return (
    <section data-nav-theme="dark" className="bg-maroon text-white">
      <div className="container-page flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div>
          <h2 className="display max-w-2xl text-4xl lg:text-5xl">{c.title}</h2>
          <p className="mt-4 max-w-xl text-white/75">{c.copy}</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href={vertical ? `${c.primary.href}?vertical=${vertical}` : c.primary.href} className="border-gold-pale bg-gold-pale text-maroon hover:border-white hover:bg-white">
            {c.primary.label}
          </Button>
          <Button href={c.secondary.href} variant="outline-light">
            {c.secondary.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
