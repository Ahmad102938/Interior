import type { Metadata } from "next";
import { projects } from "@/data/projects";
import { publishable } from "@/lib/content";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGallery } from "@/components/sections/ProjectGallery";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Projects & Portfolio",
  description: "Case studies across telecom, solar, civil construction and commercial interior fit-out — scope, location and execution highlights.",
  alternates: { canonical: "/projects" },
};

export default function ProjectsPage() {
  const list = publishable(projects).sort((a, b) => Number(!!b.featured) - Number(!!a.featured));
  return (
    <>
      <PageHero
        eyebrow="Projects & portfolio"
        title="Proven Through"
        accent="Projects."
        intro="Completed and ongoing work, published with client approval. Filter by vertical to explore scope and execution highlights."
        crumbs={[{ label: "Home", href: "/" }, { label: "Projects" }]}
      />
      <section data-nav-theme="light" className="section-y bg-ivory">
        <div className="container-page">
          {list.length > 0 ? (
            <ProjectGallery projects={list} />
          ) : (
            <p className="display max-w-2xl text-4xl text-navy">Case studies are being prepared for publication.</p>
          )}
        </div>
      </section>
      <CtaBanner title="Request project references." copy="We can share relevant project references for your scope on request." />
    </>
  );
}
