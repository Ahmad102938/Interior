import type { Project } from "./types";

/** Published projects. Add location, metric, duration, client, overview and highlights as real details are confirmed. */
export const telecomProjects: Project[] = [
  {
    id: "tel-001",
    slug: "telecom-tower-site-rollout",
    name: "Telecom tower site rollout",
    location: { state: "" },
    category: "telecom",
    primaryVertical: "telecom",
    projectStatus: "ongoing",
    summary: "Site development, tower foundations, erection support and power systems installation.",
    scope: ["Telecom site development and site preparation", "Tower foundation and erection support", "DG, battery bank and SMPS installation support"],
    featuredImage: { src: "/images/projects/telecom1.webp", alt: "Lattice telecom tower", position: "61% 30%" },
    publicationStatus: "published",
  },
  {
    id: "tel-002",
    slug: "fibre-network-trenching",
    name: "Fibre network & duct works",
    location: { state: "" },
    category: "telecom",
    primaryVertical: "telecom",
    projectStatus: "completed",
    summary: "Fibre optic cable laying, trenching and duct works.",
    scope: ["Fibre optic cable laying", "Trenching and duct works"],
    featuredImage: { src: "/images/projects/telecom2.jpg", alt: "Lattice telecom tower", position: "57% 34%" },
    publicationStatus: "published",
  },
];
