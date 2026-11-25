"use client";

import { useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import type { Capability } from "@/content/capabilities";
import { capabilityGroups, groupLabel } from "@/content/capabilityGroups";
import { PendingBadge } from "@/components/ui/PendingBadge";
import { cn } from "@/lib/utils";
import { CapabilityVisual } from "./CapabilityVisual";
import { capabilitiesPage } from "@/content/pages/capabilities";

/** Verified delivery-model label per capability (server-filtered); `pending` marks development-only placeholders. */
export type DeliveryNote = { number: string; label?: string; pending: boolean };

/**
 * The page's signature component. Large screens: grouped index beside one
 * detail panel (a vertical tablist — arrow keys, Home and End move between
 * capabilities). Panels are stacked in one grid cell (inactive ones hidden with
 * visibility), so the panel keeps the tallest height and switching never shifts the page. Phones and tablets: an accordion, one capability open at a time.
 */
export function CapabilityExplorer({ items, delivery }: { items: Capability[]; delivery: DeliveryNote[] }) {
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<number | null>(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const total = String(items.length).padStart(2, "0");

  const select = (i: number) => {
    setActive(i);
    tabs.current[i]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const next = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    select((next + items.length) % items.length);
  };

  return (
    <>
      {/* Large screens */}
      <div className="hidden lg:grid lg:grid-cols-12 lg:gap-12 xl:gap-16">
        <div role="tablist" aria-label="Engineering capabilities" aria-orientation="vertical" onKeyDown={onKey} className="lg:col-span-4">
          {capabilityGroups.map((g) => (
            <div key={g.key} className="mb-6 last:mb-0">
              <p className="eyebrow mb-2 flex items-center gap-3 text-[0.625rem] text-gold-ink">
                <span aria-hidden className="h-px w-6 bg-gold/60" />
                {g.label}
              </p>
              {items
                .map((c, i) => ({ c, i }))
                .filter(({ c }) => c.group === g.key)
                .map(({ c, i }) => {
                  const on = i === active;
                  return (
                    <button
                      key={c.number}
                      ref={(el) => {
                        tabs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`capx-tab-${i}`}
                      aria-selected={on}
                      aria-controls={`capx-panel-${i}`}
                      tabIndex={on ? 0 : -1}
                      onClick={() => setActive(i)}
                      className={cn(
                        "group relative flex w-full items-center gap-4 border-b border-navy/10 py-4 pl-5 text-left transition-colors",
                        on ? "bg-white" : "hover:bg-white/60",
                      )}
                    >
                      <span aria-hidden className={cn("absolute inset-y-0 left-0 w-0.5 origin-top bg-maroon transition-transform duration-500 ease-(--ease-premium)", on ? "scale-y-100" : "scale-y-0")} />
                      <span className={cn("font-display text-xl tabular-nums transition-colors", on ? "text-gold-ink" : "text-slate")}>{c.number}</span>
                      <span className={cn("flex-1 text-[0.9375rem] font-semibold transition-colors", on ? "text-navy" : "text-navy/75 group-hover:text-navy")}>{c.title}</span>
                      <span aria-hidden className={cn("mr-4 size-1.5 rounded-full bg-gold transition-opacity", on ? "opacity-100" : "opacity-0")} />
                    </button>
                  );
                })}
            </div>
          ))}
        </div>

        <div className="grid border border-line bg-white lg:col-span-8">
          {items.map((c, i) => (
            <div
              key={c.number}
              id={`capx-panel-${i}`}
              role="tabpanel"
              aria-labelledby={`capx-tab-${i}`}
              aria-hidden={i !== active}
              className={cn("[grid-area:1/1] grid grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]", i !== active && "invisible")}
            >
              <Detail c={c} total={total} note={delivery[i]} on={i === active} />
              <CapabilityVisual number={c.number} className={cn("m-3 ml-0", i === active && "animate-panel-in")} sizes="(min-width: 1280px) 400px, 30vw" />
            </div>
          ))}
        </div>
      </div>

      {/* Phones and tablets: accordion */}
      <div className="border-t border-navy/15 lg:hidden">
        {items.map((c, i) => {
          const expanded = open === i;
          const newGroup = i === 0 || c.group !== items[i - 1].group;
          return (
            <div key={c.number}>
              {newGroup && <p className="eyebrow pt-6 pb-2 text-[0.625rem] text-gold-ink">{groupLabel(c.group)}</p>}
              <h3 className="border-b border-navy/15">
                <button
                  type="button"
                  aria-expanded={expanded}
                  aria-controls={`capx-acc-${i}`}
                  onClick={() => setOpen(expanded ? null : i)}
                  className="flex min-h-16 w-full items-center gap-4 py-4 text-left"
                >
                  <span className={cn("font-display text-xl tabular-nums", expanded ? "text-gold-ink" : "text-slate")}>{c.number}</span>
                  <span className="flex-1 text-base font-semibold text-navy">{c.title}</span>
                  <ChevronDown aria-hidden className={cn("size-5 shrink-0 text-navy/50 transition-transform duration-300", expanded && "rotate-180")} />
                </button>
              </h3>
              <div id={`capx-acc-${i}`} role="region" aria-label={c.title} hidden={!expanded} className="border-b border-navy/15 pb-6">
                <div className="animate-panel-in">
                  <p className="mt-4 font-display text-xl leading-snug text-maroon italic">{c.summary}</p>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{c.description}</p>
                  <Activities items={c.items} />
                  <NoteLine note={delivery[i]} />
                  <CapabilityVisual number={c.number} className="mt-5 aspect-[16/10]" sizes="100vw" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Detail({ c, total, note, on }: { c: Capability; total: string; note: DeliveryNote; on: boolean }) {
  // Adding the animation class on activation replays the crossfade + upward reveal.
  return (
    <div className={cn("relative flex flex-col p-8 xl:p-10", on && "animate-panel-in")}>
      <span aria-hidden className="pointer-events-none absolute top-2 right-4 font-display text-[7rem] leading-none text-navy/[0.04] select-none">
        {c.number}
      </span>
      <p className="eyebrow text-gold-ink">
        {groupLabel(c.group)} · <span className="tabular-nums">{c.number} / {total}</span>
      </p>
      <h3 className="display mt-4 text-[2.25rem] text-navy xl:text-[2.5rem]">{c.title}</h3>
      <p className="mt-4 font-display text-xl leading-snug text-maroon italic">{c.summary}</p>
      <p className="mt-4 text-[0.9375rem] leading-relaxed text-slate">{c.description}</p>
      <Activities items={c.items} />
      <NoteLine note={note} />
    </div>
  );
}

function Activities({ items }: { items: string[] }) {
  return (
    <>
      <p className="eyebrow mt-6 text-[0.625rem] text-slate">{capabilitiesPage.explorer.activitiesLabel}</p>
      <ul className="mt-3 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
        {items.map((it) => (
          <li key={it} className="flex items-start gap-2.5 text-sm text-charcoal">
            <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-emerald" />
            {it}
          </li>
        ))}
      </ul>
    </>
  );
}

/** Delivery model — shown only once verified; a development-only marker until then. */
function NoteLine({ note }: { note: DeliveryNote }) {
  if (!note.label && !note.pending) return null;
  return (
    <p className="mt-6 flex flex-wrap items-center gap-2 border-t border-line pt-4 text-xs text-slate">
      <span className="font-semibold uppercase tracking-[0.12em] text-navy">{capabilitiesPage.explorer.deliveryLabel}</span>
      {note.label ?? "To be confirmed by management"}
      {note.pending && <PendingBadge status="pending" />}
    </p>
  );
}
