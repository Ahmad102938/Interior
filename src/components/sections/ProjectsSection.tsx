import { listedProjects } from "@/content/projects";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProjectGallery } from "./ProjectGallery";
import { homePage } from "@/content/pages/home";

export function ProjectsSection() {
  const list = listedProjects;
  const c = homePage.projects;
  return (
    <section id="projects" data-nav-theme="light" className="section-y bg-ivory">
      <div className="container-page">
        <SectionHeading index="03" {...c.heading} align="split" />
        <div className="mt-12 lg:mt-16" data-reveal>
          {list.length > 0 ? (
            <ProjectGallery projects={list} limit={c.limit} viewAllHref="/projects" />
          ) : (
            <div className="grid gap-6 border border-line bg-white p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-12">
              <p className="display text-3xl text-navy">{c.empty.title}</p>
              <Button href={c.empty.cta.href} variant="navy">
                {c.empty.cta.label}
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
