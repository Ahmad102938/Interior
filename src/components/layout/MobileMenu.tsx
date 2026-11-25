"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { headerContent, isActivePath, mainNav } from "@/content/navigation";
import { contact } from "@/content/company";
import { isPublishable } from "@/lib/content";
import { Logo } from "@/components/ui/Logo";
import { verticalClasses } from "@/components/ui/VerticalBadge";
import { cn } from "@/lib/utils";

/**
 * Site menu for < 1280px. Rendered in a portal on <body>: the header uses
 * backdrop-filter, which would otherwise become the containing block for this
 * fixed panel and clip it to the header's height.
 */
export function MobileMenu({ tone }: { tone: "light" | "dark" }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  const close = (restoreFocus = true) => {
    setOpen(false);
    if (restoreFocus) trigger.current?.focus();
  };

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    root.style.overflow = "hidden";
    panel.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        trigger.current?.focus();
      }
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled])");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    // Close if the viewport grows into the full desktop bar.
    const desktop = window.matchMedia("(min-width: 1280px)");
    const onDesktop = () => desktop.matches && setOpen(false);

    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onDesktop);
    return () => {
      root.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onDesktop);
    };
  }, [open]);

  const phone = isPublishable(contact.phone.status) ? contact.phone.value : null;
  const email = isPublishable(contact.email.status) ? contact.email.value : null;

  return (
    <>
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
        className={cn(
          "flex h-11 min-w-11 items-center justify-center gap-2.5 border px-3 text-xs font-semibold uppercase tracking-[0.14em] transition-colors xl:hidden",
          tone === "dark" ? "border-navy/20 text-navy hover:border-navy" : "border-white/25 text-white hover:border-white/60",
        )}
      >
        <span className="hidden lg:inline">{headerContent.menuLabel}</span>
        <Menu className="size-5" aria-hidden />
      </button>

      {open &&
        createPortal(
          <div
            id="site-menu"
            ref={panel}
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            className="fixed inset-0 z-[100] flex animate-[menu-in_0.35s_var(--ease-premium)] flex-col overflow-y-auto overscroll-contain bg-navy-deep text-ivory"
          >
            {/* Mirrors the header row exactly so the close button replaces the menu button in place */}
            <div className="sticky top-0 z-10 border-b border-white/10 bg-navy-deep">
              <div className="container-page flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
                <Logo className="shrink-0" />
                <button
                  type="button"
                  data-autofocus
                  aria-label="Close menu"
                  onClick={() => close()}
                  className="flex h-11 min-w-11 items-center justify-center gap-2.5 border border-white/25 px-3 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:border-white/60"
                >
                  <span className="hidden lg:inline">{headerContent.closeLabel}</span>
                  <X className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            <div
              className="container-page grid flex-1 content-start gap-10 pt-8 pb-[calc(2rem+var(--safe-bottom))] md:grid-cols-[1.3fr_1fr] md:gap-16 md:pt-12 md:pb-[calc(3rem+var(--safe-bottom))]"
              onClick={(e) => {
                if ((e.target as HTMLElement).closest("a")) close(false);
              }}
            >
              <nav aria-label="Site">
                <ol className="border-t border-white/10">
                  {mainNav.map((item, i) => {
                    const active = isActivePath(pathname, item.href);
                    return (
                      <li key={item.href} className="border-b border-white/10">
                        <Link
                          href={item.href}
                          aria-current={active ? "page" : undefined}
                          className={cn(
                            "group flex min-h-14 items-center gap-4 py-2 transition-colors md:min-h-16",
                            active ? "text-white" : "text-ivory/85 hover:text-white",
                          )}
                        >
                          <span className={cn("w-6 text-[0.6875rem] font-semibold tabular-nums tracking-[0.1em]", active ? "text-gold-pale" : "text-white/35")}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="font-display text-[1.75rem] leading-none md:text-[2.125rem]">{item.label}</span>
                          {active ? (
                            <span aria-hidden className="ml-auto h-px w-8 bg-gold" />
                          ) : (
                            <ArrowUpRight aria-hidden className="ml-auto size-4 text-white/30 transition-colors group-hover:text-gold-pale" />
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </nav>

              <div className="flex flex-col gap-10">
                <section aria-labelledby="menu-services">
                  <h2 id="menu-services" className="eyebrow text-gold-pale">
                    {headerContent.verticalsLabel}
                  </h2>
                  <ul className="mt-4 grid gap-1">
                    {mainNav
                      .find((n) => n.children)
                      ?.children?.map((c) => (
                        <li key={c.href}>
                          <Link
                            href={c.href}
                            aria-current={pathname === c.href ? "page" : undefined}
                            className={cn(
                              "flex min-h-12 items-center gap-3 px-3 text-sm transition-colors hover:bg-white/5 hover:text-white",
                              pathname === c.href ? "bg-white/5 text-white" : "text-white/75",
                            )}
                          >
                            <span aria-hidden className={cn("size-2 shrink-0 ring-1 ring-white/25", verticalClasses[c.vertical].bg)} />
                            {c.label}
                          </Link>
                        </li>
                      ))}
                  </ul>
                </section>

                <div className="mt-auto grid gap-3">
                  <Link
                    href={headerContent.quoteCta.href}
                    className="flex min-h-13 items-center justify-center gap-2 bg-maroon text-sm font-semibold uppercase tracking-[0.14em] text-white transition-colors hover:bg-maroon-light"
                  >
                    {headerContent.quoteCta.label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </Link>
                  {phone && (
                    <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex min-h-12 items-center justify-center border border-white/25 text-sm font-semibold uppercase tracking-[0.12em] text-white">
                      Call {phone}
                    </a>
                  )}
                  {email && (
                    <a href={`mailto:${email}`} className="text-center text-sm text-white/65 hover:text-gold-pale">
                      {email}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
