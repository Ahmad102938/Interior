import { history } from "@/data/history";
import { publishable } from "@/lib/content";
import { CompanyTimeline } from "@/components/sections/CompanyTimeline";
import { AboutHeading } from "./AboutHeading";

/**
 * Heritage timeline. Renders only verified milestones — until management
 * approves the history (incl. the 2014 vs 2017 question) it stays unpublished.
 */
export function AboutJourney() {
  const milestones = publishable(history);
  if (milestones.length === 0) return null;
  return (
    <section data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <AboutHeading index="07" eyebrow="Our journey" title="From one discipline" accent="to an integrated model." />
        <div className="mt-12" data-reveal>
          <CompanyTimeline items={milestones} />
        </div>
      </div>
    </section>
  );
}
