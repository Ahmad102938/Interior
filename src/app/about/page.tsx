import type { Metadata } from "next";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutStory } from "@/components/about/AboutStory";
import { VisionMission } from "@/components/about/VisionMission";
import { ValuesLedger } from "@/components/about/ValuesLedger";
import { VerticalsMatrix } from "@/components/about/VerticalsMatrix";
import { OperatingSystem } from "@/components/about/OperatingSystem";
import { MethodAndPeople } from "@/components/about/MethodAndPeople";
import { ResponsibleExecution } from "@/components/about/ResponsibleExecution";
import { AboutJourney } from "@/components/about/AboutJourney";
import { AboutCta } from "@/components/about/AboutCta";

const title = "About ADIDEV | Integrated Engineering & Infrastructure Solutions";
const description =
  "Discover ADIDEV's integrated capabilities across telecom infrastructure, solar and renewable energy, civil construction, and commercial interior fit-out.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/about" },
  openGraph: { title, description, url: "/about", type: "website" },
};

/**
 * About — the company story. Owns: overview, vision & mission, values,
 * organisation and heritage. Services, capabilities, quality practice and
 * industries are summarised here and linked to their own pages.
 */
export default function AboutPage() {
  return (
    <>
      <AboutIntro />
      <AboutStory />
      <VisionMission />
      <ValuesLedger />
      <VerticalsMatrix />
      <OperatingSystem />
      <MethodAndPeople />
      <ResponsibleExecution />
      <AboutJourney />
      <AboutCta />
    </>
  );
}
