import { projects } from "@/data/projects";
import { publishable } from "@/lib/content";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProjectGallery } from "./ProjectGallery";

export function ProjectsSection() {
  const list = publishable(projects).sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <section id="projects" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <SectionHeading
          index="03"
          eyebrow="Selected projects"
          title="Proven Through"
          accent="Projects."
          intro="Completed and ongoing work across our four verticals — scope, location and execution highlights, published with client approval."
          align="split"
        />
        <div className="mt-12 lg:mt-16" data-reveal>
          {list.length > 0 ? (
            <ProjectGallery projects={list} limit={6} viewAllHref="/projects" />
          ) : (
            <div className="grid gap-6 border border-line bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <p className="display text-3xl text-navy">Case studies are being prepared for publication.</p>
              <Button href="/contact" variant="navy">
                Request project references
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
