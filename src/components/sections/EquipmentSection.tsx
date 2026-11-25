import { publishable } from "@/lib/content";
import { MediaSlot } from "@/components/ui/MediaSlot";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { homePage } from "@/content/pages/home";

/**
 * Equipment & technical resources. Each item carries its resource model
 * (owned / leased / hired / partner-provided) so ownership is never implied.
 */
export function EquipmentSection() {
  const items = publishable(homePage.equipment.items);
  if (items.length === 0) return null;
  const c = homePage.equipment;
  return (
    <div className="mt-14 lg:mt-20" data-reveal>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-ink">{c.eyebrow}</p>
          <h3 className="display mt-3 text-3xl text-navy lg:text-4xl">{c.title}</h3>
        </div>
        <p className="max-w-md text-sm text-slate">{c.note}</p>
      </div>
      <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((e) => (
          <li key={e.title} className="border border-line bg-ivory-soft">
            <MediaSlot src={e.image} slot={`${e.title} photograph`} alt={e.title} className="aspect-[4/3]" />
            <div className="p-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="font-semibold text-navy">{e.title}</h4>
                <PendingBadge status={e.status} />
              </div>
              <p className="mt-2 text-sm leading-relaxed text-slate">{e.copy}</p>
              <p className="mt-4 inline-block border border-navy/15 px-2 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-navy">{e.model}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
