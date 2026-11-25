import { capabilities } from "@/content/capabilities";
import { homePage } from "@/content/pages/home";
import { capabilityDelivery, deliveryModels, type DeliveryModelKey } from "@/content/deliveryModels";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/utils";
import { capabilitiesPage } from "@/content/pages/capabilities";

/** Each arrangement has its own glyph (shape, not colour), so labels read without colour. */
function Glyph({ model, className }: { model: DeliveryModelKey; className?: string }) {
  const base = "inline-block size-3.5 shrink-0";
  return (
    <span
      aria-hidden
      className={cn(
        base,
        model === "in-house" && "bg-gold-pale",
        model === "partner" && "border-2 border-gold-pale",
        model === "vendor" && "border-2 border-dashed border-gold-pale",
        model === "project" && "bg-linear-to-br from-gold-pale from-50% to-transparent to-50% ring-1 ring-gold-pale",
        className,
      )}
    />
  );
}

/**
 * In-house vs partner- and vendor-supported delivery (client brief, slide 12).
 * The four labels are explained publicly; which applies to which capability is
 * shown only once management verifies it. In development, the pending
 * classification table and resource models are visible for review.
 */
export function DeliveryModel() {
  const verified = capabilityDelivery.filter((d) => d.status === "verified" && d.model);
  const review = publishable(capabilityDelivery).filter((d) => d.status !== "verified");
  const resources = publishable(homePage.equipment.items);

  return (
    <section data-nav-theme="dark" className="section-y bg-charcoal text-white">
      <div className="container-page">
        <SectionHeading tone="dark" align="split" {...capabilitiesPage.deliveryModel.heading} />

        <ul className="mt-12 grid gap-px bg-white/10 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
          {deliveryModels.map((m) => (
            <li key={m.key} className="bg-charcoal p-6 sm:p-8" data-reveal>
              <Glyph model={m.key} />
              <h3 className="mt-5 text-sm font-semibold uppercase tracking-[0.12em]">{m.label}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/65">{m.copy}</p>
            </li>
          ))}
        </ul>

        {verified.length > 0 && (
          <dl className="mt-10 grid gap-x-10 border-t border-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {verified.map((d) => {
              const m = deliveryModels.find((x) => x.key === d.model)!;
              return (
                <div key={d.number} className="flex items-center justify-between gap-4 border-b border-white/10 py-4">
                  <dt className="text-sm text-white/85">{capabilities.find((c) => c.number === d.number)?.title}</dt>
                  <dd className="flex items-center gap-2 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-gold-pale">
                    <Glyph model={m.key} className="size-3" />
                    {m.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        )}

        {/* Development only: what still needs a management decision */}
        {review.length > 0 && (
          <div className="mt-10 border border-dashed border-amber-500/40 p-5 text-sm text-white/70">
            <p className="flex items-center gap-2 font-semibold text-white">
              Classification awaiting approval <PendingBadge status="pending" />
            </p>
            <p className="mt-1">{review.map((d) => capabilities.find((c) => c.number === d.number)?.title).join(" · ")}</p>
          </div>
        )}

        {resources.length > 0 && (
          <div className="mt-14 border-t border-white/10 pt-10 lg:mt-16">
            <p className="eyebrow text-gold-pale">{capabilitiesPage.deliveryModel.resourcesLabel}</p>
            <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {resources.map((e) => (
                <li key={e.title}>
                  <p className="flex items-center gap-2 font-semibold">
                    {e.title} <PendingBadge status={e.status} />
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-white/60">{e.copy}</p>
                  <p className="mt-3 inline-block border border-white/20 px-2 py-1 text-[0.625rem] font-semibold uppercase tracking-[0.12em] text-gold-pale">{e.model}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
