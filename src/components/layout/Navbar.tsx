"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { isActivePath, mainNav } from "@/data/navigation";
import { Logo } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";
import { MobileMenu } from "./MobileMenu";

/**
 * overlay — over a hero (3D scene, page heroes): see-through, scene stays visible
 * dark    — over dark content sections: solid navy
 * light   — over ivory / white sections: solid ivory, navy text
 */
type NavState = "overlay" | "dark" | "light";

const PROBE_Y = 40;

/** Reads the deepest `data-nav-theme` element under the bar. */
function useNavState(): NavState {
  const pathname = usePathname();
  const [state, setState] = useState<NavState>("overlay");
  useEffect(() => {
    let raf = 0;
    const read = () => {
      raf = 0;
      let theme: string | undefined;
      for (const s of document.querySelectorAll<HTMLElement>("[data-nav-theme]")) {
        const r = s.getBoundingClientRect();
        if (r.height > 0 && r.top <= PROBE_Y && r.bottom > PROBE_Y) theme = s.dataset.navTheme; // later = nested = more specific
      }
      setState(theme === "light" ? "light" : theme === "dark" ? "dark" : "overlay");
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, [pathname]);
  return state;
}

export function Navbar() {
  const pathname = usePathname();
  const state = useNavState();
  const light = state === "light";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,color] duration-500 ease-(--ease-premium)",
        state === "overlay" && "border-white/10 bg-linear-to-b from-navy-deep/70 to-navy-deep/0",
        state === "dark" && "border-white/10 bg-navy-deep/95 backdrop-blur-md",
        light && "border-line bg-ivory-soft/95 backdrop-blur-md",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-10 focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-navy"
      >
        Skip to content
      </a>

      <div className="container-page flex h-[4.5rem] items-center gap-6 lg:h-20">
        <Logo tone={light ? "dark" : "light"} className="shrink-0" />

        <nav aria-label="Main" className="ml-auto hidden lg:block">
          <ul className="flex items-center">
            {mainNav.slice(1).map((item) => {
              const active = isActivePath(pathname, item.href);
              return (
                <li key={item.href} className={cn("group relative", !item.primary && "hidden xl:block")}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    aria-haspopup={item.children ? "true" : undefined}
                    className={cn(
                      "relative flex h-11 items-center gap-1 px-2.5 text-[0.8125rem] font-medium whitespace-nowrap transition-colors 2xl:px-3.5",
                      light ? "text-charcoal/80 hover:text-navy" : "text-white/75 hover:text-white",
                      active && (light ? "text-navy" : "text-white"),
                    )}
                  >
                    {item.label}
                    {item.children && <ChevronDown aria-hidden className="size-3.5 opacity-60 transition-transform duration-300 group-hover:rotate-180 group-focus-within:rotate-180" />}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-2.5 bottom-1.5 h-px origin-left bg-gold transition-transform duration-300 2xl:inset-x-3.5",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>

                  {item.children && (
                    <div className="invisible absolute top-full left-1/2 -translate-x-1/2 translate-y-1 pt-3 opacity-0 transition-all duration-300 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
                      <ul className="w-80 border border-white/10 bg-navy-deep p-2 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.5)]">
                        {item.children.map((c) => {
                          const sub = pathname === c.href;
                          return (
                            <li key={c.href}>
                              <Link
                                href={c.href}
                                aria-current={sub ? "page" : undefined}
                                className={cn(
                                  "flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-white/5 hover:text-white",
                                  sub ? "bg-white/5 text-white" : "text-white/75",
                                )}
                              >
                                <span aria-hidden className={cn("size-2 shrink-0", verticalClasses[c.vertical].bg, "ring-1 ring-white/25")} />
                                {c.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2 lg:ml-2 xl:ml-4">
          <Button href="/request-a-quote" variant="primary" arrow={false} className="hidden h-11 min-h-0 px-5 text-xs sm:inline-flex">
            Request a Quote
          </Button>
          <MobileMenu tone={light ? "dark" : "light"} />
        </div>
      </div>
    </header>
  );
}
