import { ShieldCheck, ClipboardCheck, Leaf, Landmark } from "lucide-react";
import { certifications } from "@/content/capabilities";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/utils";
import { homePage } from "@/content/pages/home";
import { SectionBackdrop } from "@/components/ui/SectionBackdrop";
import { MediaSlot } from "@/components/ui/MediaSlot";

const icons = { clipboard: ClipboardCheck, shield: ShieldCheck, leaf: Leaf, landmark: Landmark };
const tones = {
  gold: { accent: "text-gold", rule: "bg-gold" },
  emerald: { accent: "text-[#5fae86]", rule: "bg-emerald" },
  navy: { accent: "text-[#8fa6c6]", rule: "bg-navy" },
};
/** Content: src/content/pages/home.ts → quality.blocks */
const blocks = homePage.quality.blocks.map((b) => ({ ...b, Icon: icons[b.icon], ...tones[b.tone] }));

/** `standalone`: directly under the Quality page hero (same colour), which already carries the heading. */
export function QualitySection({ standalone = false }: { standalone?: boolean }) {
  const certs = publishable(certifications);
  return (
    <section id="quality" data-nav-theme="dark" className={cn("section-y relative overflow-hidden bg-charcoal text-white", standalone && "pt-0!")}>
      <SectionBackdrop image={homePage.quality.backgroundImage} overlay="bg-charcoal/90" />
      <div className="container-page relative">
        {!standalone && (
          <SectionHeading index="06" {...homePage.quality.heading} tone="dark" align="split" />
        )}
        <div className={cn("grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2", !standalone && "mt-14 lg:mt-20")} data-reveal>
          {blocks.map(({ title, items, Icon, accent, rule, image }) => (
            <div key={title} className="relative bg-charcoal-light p-6 sm:p-8 lg:p-10">
              {image && <MediaSlot src={image.src} alt={image.alt} slot={title} position={image.position} caption={image.caption} className="-mx-6 -mt-6 mb-6 aspect-[16/7] sm:-mx-8 sm:-mt-8 lg:-mx-10 lg:-mt-10" sizes="(min-width: 768px) 50vw, 100vw" />}
              <span aria-hidden className={cn("absolute top-0 left-0 h-0.5 w-16", rule)} />
              <Icon aria-hidden className={cn("size-6", accent)} strokeWidth={1.5} />
              <h3 className="display mt-5 text-3xl">{title}</h3>
              <ul className="mt-5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
                {items.map((it) => (
                  <li key={it} className="flex gap-2.5 text-sm text-white/75">
                    <span aria-hidden className={cn("mt-2 size-1 shrink-0 rounded-full", rule)} />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {certs.length > 0 && (
          <div className="mt-10" data-reveal>
            <p className="eyebrow text-gold-pale">{homePage.quality.certificationsLabel}</p>
            <ul className="mt-5 grid gap-4 md:grid-cols-2">
              {certs.map((c) => (
                <li key={c.name} className="flex flex-wrap items-center justify-between gap-4 border border-white/10 bg-charcoal-light p-5">
                  <div>
                    <p className="font-semibold">{c.name}</p>
                    <p className="mt-1 text-xs text-white/55">
                      {c.issuer} · {c.scope} · {c.validity}
                    </p>
                  </div>
                  <PendingBadge status={c.status} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
