import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CapabilityExplorer } from "./CapabilityExplorer";

/**
 * Engineering capabilities: a compact index of six disciplines grouped by
 * phase, with one capability's scope in focus at a time. Sized to sit within
 * one viewport at every screen size — spacing and type scale with height.
 * `standalone`: directly under the Capabilities page hero (same colour), which
 * already carries the heading — only the explorer is shown.
 */
export function CapabilitiesSection({ standalone = false }: { standalone?: boolean }) {
  return (
    <section
      id="capabilities"
      data-nav-theme="dark"
      className={cn(
        "relative overflow-hidden bg-navy text-white",
        standalone
          ? "section-y pt-0!"
          : "flex min-h-svh flex-col justify-center pt-[calc(4.5rem+clamp(1rem,3svh,2rem))] pb-[calc(clamp(1.5rem,4svh,3rem)+var(--safe-bottom))] lg:pt-[calc(5rem+clamp(0.75rem,3svh,2.5rem))]",
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#d8c398 1px, transparent 1px), linear-gradient(90deg, #d8c398 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="container-page relative">
        {!standalone && (
          <header className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-10" data-reveal>
            <div>
              <p className="eyebrow flex items-center gap-3 text-gold-pale">
                <span className="tabular-nums">04</span>
                <span aria-hidden className="h-px w-10 bg-gold-pale/50" />
                Engineering capabilities
              </p>
              <h2 className="display mt-[clamp(0.75rem,2svh,1.25rem)] text-[min(8vw,max(1.75rem,4.6svh))] sm:text-[clamp(2.25rem,5.4svh,3.5rem)]">
                One Integrated Approach.
                <br />
                <em className="font-normal text-gold-pale">Complete Project Control.</em>
              </h2>
            </div>
            <div className="hidden space-y-4 sm:block [@media(max-height:740px)]:max-lg:hidden">
              <p className="max-w-xl text-[0.9375rem] leading-relaxed text-white/70">
                Planning, engineering coordination, procurement, field execution and handover managed as one connected system — so decisions made early carry
                through to site.
              </p>
              <div className="hidden flex-wrap items-center gap-x-6 gap-y-2 lg:flex">
                <p className="max-w-sm text-xs leading-relaxed text-white/50 [@media(max-height:800px)]:hidden">In-house expertise is clearly distinguished from qualified partner- or vendor-supported delivery on every project.</p>
                <CtaLink />
              </div>
            </div>
          </header>
        )}

        <div className={cn(!standalone && "mt-[clamp(1.25rem,4svh,3rem)]")} data-reveal>
          <CapabilityExplorer />
        </div>

        {!standalone && (
          <div className="mt-[clamp(0.25rem,1.5svh,1.5rem)] lg:hidden">
            <CtaLink />
          </div>
        )}
      </div>
    </section>
  );
}

function CtaLink() {
  return (
    <Link
      href="/capabilities"
      className="inline-flex min-h-11 items-center gap-2 border-b border-gold-pale/40 text-xs font-semibold tracking-[0.14em] text-white uppercase transition-colors hover:border-gold-pale hover:text-gold-pale"
    >
      Explore capabilities
      <ArrowUpRight aria-hidden className="size-4" />
    </Link>
  );
}
