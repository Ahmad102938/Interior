import type { Project } from "./types";

/** DEVELOPMENT SAMPLES — layout placeholders only. Replace with approved case studies. */
export const telecomProjects: Project[] = [
  {
    id: "tel-001",
    slug: "telecom-tower-site-rollout",
    name: "[Telecom tower site rollout]",
    location: { city: "[City]", state: "[State]" },
    category: "telecom",
    primaryVertical: "telecom",
    projectStatus: "ongoing",
    metric: { label: "Sites", value: "[Verified number of sites]" },
    summary: "[Approved introduction] Site development, tower foundations, erection support and power systems installation.",
    overview: ["[Project context, the client's requirement where shareable, and Adidev's involvement.]"],
    scope: ["Telecom site development and site preparation", "Tower foundation and erection support", "DG, battery bank and SMPS installation support"],
    highlights: ["[Verified execution highlight]", "[Verified execution highlight]"],
    featuredImage: { src: "/images/verticals/telecom.jpg", alt: "Sample image — lattice telecom tower (illustrative visualisation)", position: "61% 30%" },
    publicationStatus: "draft",
  },
  {
    id: "tel-002",
    slug: "fibre-network-trenching",
    name: "[Fibre network & duct works]",
    location: { city: "[City]", state: "[State]" },
    category: "telecom",
    primaryVertical: "telecom",
    projectStatus: "completed",
    metric: { label: "Route length", value: "[Verified route km]" },
    summary: "[Approved introduction] Fibre optic cable laying, trenching and duct works.",
    scope: ["Fibre optic cable laying", "Trenching and duct works"],
    publicationStatus: "draft",
  },
];
