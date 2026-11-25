import type { Project } from "./types";

/** DEVELOPMENT SAMPLES — layout placeholders only. Replace with approved case studies. */
export const solarProjects: Project[] = [
  {
    id: "sol-001",
    slug: "utility-scale-solar-installation",
    name: "[Utility-scale solar installation]",
    client: { name: "[Client, if authorised]", visibility: "public" },
    location: { city: "[City]", state: "[State]" },
    category: "solar",
    primaryVertical: "solar",
    projectStatus: "completed",
    duration: "[Start – completion]",
    metric: { label: "Capacity", value: "[Verified MW]" },
    summary: "[Approved introduction] Site preparation, piling, MMS installation, PV module installation and DC-side works.",
    overview: [
      "[Project context — the site, the client's requirement where shareable, and the environment.]",
      "[Adidev's involvement — the packages delivered and how they were coordinated.]",
    ],
    scope: ["Site clearing, levelling and grading", "Piling and foundations", "Module Mounting Structure (MMS) installation", "Solar PV module installation", "DC-side installation support"],
    highlights: ["[Verified execution highlight]", "[Verified execution highlight]", "[Verified execution highlight]"],
    featuredImage: { src: "/images/verticals/solar.jpg", alt: "Sample image — ground-mounted solar arrays (illustrative visualisation)", position: "50% 62%" },
    gallery: [
      { phase: "before", src: "/images/posters/stage-0.jpg", alt: "Sample image — site layout drawing", caption: "Sample — replace with an approved pre-project photograph" },
      { phase: "during", src: "/images/posters/stage-3.jpg", alt: "Sample image — works in progress", caption: "Sample — replace with an approved execution photograph" },
      { phase: "after", src: "/images/verticals/solar.jpg", alt: "Sample image — completed arrays", caption: "Sample — replace with an approved completion photograph" },
    ],
    documents: [{ title: "[Approved project profile]", href: "#", format: "PDF", size: "[Size]" }],
    featured: true,
    publicationStatus: "draft",
  },
  {
    id: "sol-002",
    slug: "rooftop-solar-installation",
    name: "[Rooftop solar installation]",
    location: { city: "[City]", state: "[State]" },
    category: "solar",
    primaryVertical: "solar",
    projectStatus: "ongoing",
    metric: { label: "Capacity", value: "[Verified kWp]" },
    summary: "[Approved introduction] Rooftop MMS, module installation and AC-side electrical works.",
    scope: ["Module Mounting Structure (MMS) installation", "Solar PV module installation", "AC-side electrical works", "Inverter installation coordination"],
    publicationStatus: "draft",
  },
];
