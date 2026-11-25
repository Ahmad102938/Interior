import { aboutPage, mission, vision } from "@/content/pages/about";

/** Vision and mission as two mirrored statements on one navy field. */
export function VisionMission() {
  const items = [
    { label: aboutPage.visionMission.visionLabel, text: vision },
    { label: aboutPage.visionMission.missionLabel, text: mission },
  ];
  return (
    <section data-nav-theme="dark" aria-label="Vision and mission" className="section-y bg-navy text-white">
      <div className="container-page grid md:grid-cols-2">
        {items.map((it) => (
          <div key={it.label} className="py-8 first:pt-0 last:border-t last:border-white/15 last:pb-0 md:py-0 md:first:pr-12 md:last:border-t-0 md:last:border-l md:last:pl-12 lg:first:pr-16 lg:last:pl-16" data-reveal>
            <p className="eyebrow flex items-center gap-3 text-gold-pale">
              <span aria-hidden className="h-px w-10 bg-gold-pale/50" />
              {it.label}
            </p>
            <p className="display mt-6 text-[1.875rem] leading-[1.2] lg:text-[2.375rem]">{it.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
