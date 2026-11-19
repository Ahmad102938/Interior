import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { TeamSection } from "@/components/sections/TeamSection";
import { CtaBanner } from "@/components/sections/CtaBanner";

export const metadata: Metadata = {
  title: "Team & Leadership",
  description: "The leadership and functional teams supporting Adidev project delivery.",
  alternates: { canonical: "/team" },
};

export default function TeamPage() {
  return (
    <>
      <PageHero eyebrow="Team & leadership" title="One delivery" accent="team." crumbs={[{ label: "Home", href: "/" }, { label: "Team" }]} />
      <TeamSection index="01" />
      <CtaBanner title="Join the team." copy="Engineering, project, site and design roles — see current openings." />
    </>
  );
}
