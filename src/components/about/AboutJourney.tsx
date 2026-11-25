import { history } from "@/content/history";
import { publishable } from "@/lib/content";
import { CompanyTimeline } from "@/components/sections/CompanyTimeline";
import { AboutHeading } from "./AboutHeading";
import { aboutPage } from "@/content/pages/about";

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
        <AboutHeading index="07" {...aboutPage.journey.heading} />
        <div className="mt-12" data-reveal>
          <CompanyTimeline items={milestones} />
        </div>
      </div>
    </section>
  );
}
