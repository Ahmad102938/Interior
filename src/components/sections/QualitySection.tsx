import { ShieldCheck, ClipboardCheck, Leaf, Landmark } from "lucide-react";
import { certifications, quality } from "@/data/capabilities";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/utils";

const blocks = [
  { ...quality.qa, Icon: ClipboardCheck, accent: "text-gold", rule: "bg-gold" },
  { ...quality.hse, Icon: ShieldCheck, accent: "text-[#5fae86]", rule: "bg-emerald" },
  { ...quality.sustainability, Icon: Leaf, accent: "text-[#5fae86]", rule: "bg-emerald" },
  { ...quality.governance, Icon: Landmark, accent: "text-[#8fa6c6]", rule: "bg-navy" },
];

export function QualitySection() {
  const certs = publishable(certifications);
  return (
    <section id="quality" data-nav-theme="dark" className="section-y bg-charcoal text-white">
      <div className="container-page">
        <SectionHeading
          index="06"
          eyebrow="Quality, safety & governance"
          title="Engineered with Discipline."
          accent="Delivered with Responsibility."
          tone="dark"
          align="split"
          intro="Clear practices on every site — from approved drawings and material verification to PPE, toolbox talks and documented handover."
        />
        <div className="mt-14 grid gap-px overflow-hidden border border-white/10 bg-white/10 md:grid-cols-2 lg:mt-20" data-reveal>
          {blocks.map(({ title, items, Icon, accent, rule }) => (
            <div key={title} className="relative bg-charcoal-light p-8 lg:p-10">
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
            <p className="eyebrow text-gold-pale">Certifications & compliance</p>
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
