import type { Project } from "./types";

/** Published projects. Add location, metric, duration, client, overview and highlights as real details are confirmed. */
export const solarProjects: Project[] = [
  {
    id: "sol-001",
    slug: "utility-scale-solar-installation",
    name: "Utility-scale solar installation",
    client: { name: "Client, if authorised", visibility: "public" },
    location: { state: "" },
    category: "solar",
    primaryVertical: "solar",
    projectStatus: "completed",
    summary: "Site preparation, piling, MMS installation, PV module installation and DC-side works.",
    scope: ["Site clearing, levelling and grading", "Piling and foundations", "Module Mounting Structure (MMS) installation", "Solar PV module installation", "DC-side installation support"],
    featuredImage: { src: "/images/projects/solar1.webp", alt: "Ground-mounted solar arrays", position: "50% 62%" },
    gallery: [
      { phase: "before", src: "/images/projects/solar3.webp", alt: "Site layout drawing" },
      { phase: "during", src: "/images/projects/solar5.webp", alt: "Works in progress" },
      { phase: "after", src: "/images/projects/solar4.webp", alt: "Completed arrays" },
    ],
    featured: true,
    publicationStatus: "published",
  },
  {
    id: "sol-002",
    slug: "rooftop-solar-installation",
    name: "Rooftop solar installation",
    location: { state: "" },
    category: "solar",
    primaryVertical: "solar",
    projectStatus: "ongoing",
    featuredImage: { src: "/images/projects/solar6.webp", alt: "Ground-mounted solar arrays", position: "50% 62%" },
    summary: "Rooftop MMS, module installation and AC-side electrical works.",
    scope: ["Module Mounting Structure (MMS) installation", "Solar PV module installation", "AC-side electrical works", "Inverter installation coordination"],
    publicationStatus: "published",
  },
];
