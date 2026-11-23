import type { Project } from "./types";

/** DEVELOPMENT SAMPLES — layout placeholders only. Replace with approved case studies. */
export const interiorProjects: Project[] = [
  {
    id: "int-001",
    slug: "corporate-office-fit-out",
    name: "[Corporate office fit-out]",
    location: { city: "[City]", state: "[State]" },
    category: "interiors",
    primaryVertical: "interiors",
    projectStatus: "completed",
    metric: { label: "Area", value: "[Verified sq ft]" },
    summary: "[Approved introduction] Space planning, partitions, false ceiling, MEP coordination and turnkey fit-out.",
    scope: ["Space planning and design coordination", "False ceiling and partitions", "Electrical, lighting and HVAC coordination", "Furniture, fixtures and cabinetry", "Snagging and final handover"],
    highlights: ["[Verified execution highlight]", "[Verified execution highlight]"],
    featuredImage: { src: "/images/posters/stage-4.jpg", alt: "Sample image — fitted-out workplace (illustrative visualisation)", position: "50% 55%" },
    gallery: [
      { phase: "during", src: "/images/verticals/interiors.jpg", alt: "Sample image — open floor with glazed meeting room", caption: "Sample — replace with an approved execution photograph" },
      { phase: "after", src: "/images/posters/stage-4.jpg", alt: "Sample image — completed workplace", caption: "Sample — replace with an approved completion photograph" },
    ],
    publicationStatus: "draft",
  },
  {
    id: "int-002",
    slug: "showroom-refurbishment",
    name: "[Showroom refurbishment]",
    location: { city: "[City]", state: "[State]" },
    category: "interiors",
    primaryVertical: "interiors",
    tags: ["renovation"],
    projectStatus: "ongoing",
    summary: "[Approved introduction] Refurbishment of an existing showroom — flooring, ceilings, lighting and display fit-out.",
    scope: ["Flooring, tiling and skirting", "False ceiling", "Electrical and lighting coordination", "Showroom fit-out"],
    publicationStatus: "draft",
  },
];
