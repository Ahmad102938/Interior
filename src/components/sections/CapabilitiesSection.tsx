import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { CapabilityExplorer } from "./CapabilityExplorer";

/**
 * Engineering capabilities: a compact index of six disciplines grouped by
 * phase, with one capability's scope in focus at a time.
 */
export function CapabilitiesSection({ showCta = true }: { showCta?: boolean }) {
  return (
    <section id="capabilities" data-nav-theme="dark" className="section-y relative overflow-hidden bg-navy text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage: "linear-gradient(#d8c398 1px, transparent 1px), linear-gradient(90deg, #d8c398 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <div className="container-page relative">
        <SectionHeading
          index="04"
          eyebrow="Engineering capabilities"
          title="One Integrated Approach."
          accent="Complete Project Control."
          tone="dark"
          align="split"
          intro="Planning, engineering coordination, procurement, field execution and handover managed as one connected system — so decisions made early carry through to site."
        />

        <div className="mt-14 lg:mt-20" data-reveal>
          <CapabilityExplorer />
        </div>

        {showCta && (
          <div className="mt-16 flex flex-wrap items-center justify-between gap-6 border-t border-white/10 pt-8">
            <p className="max-w-xl text-sm text-white/60">
              In-house expertise is clearly distinguished from qualified partner- or vendor-supported delivery on every project.
            </p>
            <Button href="/capabilities" variant="outline-light">
              Explore capabilities
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
