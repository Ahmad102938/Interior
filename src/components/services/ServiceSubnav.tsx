"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { LAST_VERTICAL_KEY } from "./shared";
import { servicesPage } from "@/content/pages/services";

type Item = { id: string; label: string };

/**
 * Sticky in-page index under the main navbar. The active entry follows the
 * section at the middle of the viewport; anchors work without JS.
 */
export function ServiceSubnav({ items, quote, title, vertical }: { items: Item[]; quote: string; title: string; vertical: string }) {
  const [active, setActive] = useState<string>();

  // Remember the division so general enquiry CTAs elsewhere can pre-select it.
  useEffect(() => {
    try {
      sessionStorage.setItem(LAST_VERTICAL_KEY, vertical);
    } catch {}
  }, [vertical]);

  // Active = the last section whose top has passed the middle of the viewport (none above the first).
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      let current: string | undefined;
      for (const { id } of items) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= innerHeight / 2) current = id;
      }
      setActive(current);
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    schedule();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [items]);

  return (
    <nav aria-label={`${title} sections`} className="sticky top-[4.5rem] z-40 border-b border-line bg-white/95 backdrop-blur-sm lg:top-20">
      <div className="container-page flex items-center gap-6">
        <ol className="-mx-2 flex min-w-0 flex-1 overflow-x-auto [scrollbar-width:none]">
          {items.map((it) => (
            <li key={it.id} className="shrink-0">
              <a
                href={`#${it.id}`}
                aria-current={active === it.id ? "true" : undefined}
                className={cn(
                  "relative flex h-12 items-center px-2 text-[0.6875rem] font-semibold whitespace-nowrap uppercase tracking-[0.14em] transition-colors sm:px-3",
                  "after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:origin-left after:bg-gold after:transition-transform after:duration-300 sm:after:inset-x-3",
                  active === it.id ? "text-navy after:scale-x-100" : "text-slate hover:text-navy after:scale-x-0",
                )}
              >
                {it.label}
              </a>
            </li>
          ))}
        </ol>
        <a href={quote} className="hidden h-12 shrink-0 items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-maroon hover:text-navy md:inline-flex">
          {servicesPage.detail.subnavCta}
          <ArrowUpRight aria-hidden className="size-4" />
        </a>
      </div>
    </nav>
  );
}
