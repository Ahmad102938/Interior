import { CinematicExperience } from "@/components/experience/CinematicExperience";
import { HeritageSection } from "@/components/sections/HeritageSection";
import { VerticalsSection } from "@/components/sections/VerticalsSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CapabilitiesSection } from "@/components/sections/CapabilitiesSection";
import { ExecutionSection } from "@/components/sections/ExecutionSection";
import { QualitySection } from "@/components/sections/QualitySection";
import { ClientsSection } from "@/components/sections/ClientsSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <CinematicExperience />
      <HeritageSection />
      <VerticalsSection />
      <ProjectsSection />
      <CapabilitiesSection />
      <ExecutionSection />
      <QualitySection />
      <ClientsSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
