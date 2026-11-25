import type { VerticalKey } from "@/config/theme";
import { SHOW_UNVERIFIED } from "@/lib/content";
import type { Project, ProjectCategory, PublicationStatus } from "./types";
import { telecomProjects } from "./telecom";
import { solarProjects } from "./solar";
import { civilProjects } from "./civil";
import { interiorProjects } from "./interiors";

export type * from "./types";

/**
 * NO APPROVED PROJECT DATA HAS BEEN SUPPLIED YET. Every record is a draft
 * layout sample and never reaches production. To publish a case study, replace
 * the sample with approved content and set publicationStatus to "approved" or
 * "published" — names, clients, figures and images all need sign-off first.
 */
export const projects: Project[] = [...solarProjects, ...telecomProjects, ...civilProjects, ...interiorProjects];

/** Portfolio categories in the client's order, each tied to its primary business vertical. */
export const projectCategories: { key: ProjectCategory; label: string; vertical: VerticalKey }[] = [
  { key: "telecom", label: "Telecom Infrastructure", vertical: "telecom" },
  { key: "solar", label: "Solar & Renewable Energy", vertical: "solar" },
  { key: "civil", label: "Civil Construction", vertical: "civil" },
  { key: "industrial", label: "Industrial Sheds & Warehouses", vertical: "civil" },
  { key: "interiors", label: "Commercial Interior & Fit-Out", vertical: "interiors" },
  { key: "renovation", label: "Renovation & Maintenance", vertical: "civil" },
];

const PUBLIC: PublicationStatus[] = ["approved", "published"];

export const isPublic = (p: Pick<Project, "publicationStatus">) => PUBLIC.includes(p.publicationStatus);
export const isListed = (p: Pick<Project, "publicationStatus">) => isPublic(p) || SHOW_UNVERIFIED;

/** Projects that may be shown: approved/published, plus drafts in development. Featured first. */
export const listedProjects = projects.filter(isListed).sort((a, b) => Number(!!b.featured) - Number(!!a.featured));

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const categoryOf = (key: ProjectCategory) => projectCategories.find((c) => c.key === key)!;
/** A project belongs to its primary category and any secondary tags. */
export const inCategory = (p: Project, key: ProjectCategory) => p.category === key || !!p.tags?.includes(key);
export const locationLabel = (p: Project) => [p.location.city, p.location.state].filter(Boolean).join(", ");
export const statusLabel = (p: Project) => (p.projectStatus === "completed" ? "Completed" : "Ongoing");
export const projectHref = (p: Pick<Project, "slug">) => `/projects/${p.slug}`;
