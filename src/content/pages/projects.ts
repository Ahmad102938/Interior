import { renders } from "../media";
import { image, type Cta, type Heading } from "../types";

/**
 * /projects and /projects/[slug] — section copy and images.
 * The projects themselves (name, scope, photos, gallery) live in ../projects/<vertical>.ts.
 */
export const projectsPage = {
  meta: {
    title: "Projects & Portfolio",
    description: "Completed and ongoing work across telecom infrastructure, renewable energy, civil construction, industrial facilities and commercial fit-outs.",
  },

  hero: {
    heading: {
      eyebrow: "Projects & portfolio",
      title: "Proven Through",
      accent: "Projects.",
      intro: "Explore ADIDEV's completed and ongoing work across telecom infrastructure, renewable energy, civil construction, industrial facilities and commercial fit-outs.",
    } satisfies Heading,
    primaryLabel: "Explore projects",
    secondary: { label: "Request a quote", href: "/request-a-quote" } satisfies Cta,
    /** Hero image when no featured project has a photo. */
    fallbackImage: image({ ...renders.construction, position: "45% 55%" }),
    categoriesLabel: "Portfolio categories",
    /** Counters under the hero (numbers are counted automatically). */
    stats: { project: "Project", projects: "Projects", categories: "Categories" },
  },

  featured: { eyebrow: "Featured project", cta: "View case study" },

  portfolio: {
    heading: { eyebrow: "Portfolio", title: "Browse", accent: "the work.", intro: "Filter by category and status. Every case study lists the actual scope delivered on that project." } satisfies Heading,
    pendingHeading: {
      eyebrow: "Portfolio",
      title: "Case studies are being",
      accent: "prepared for publication.",
      intro: "Project names, clients, figures and photographs are published only once approved. Meanwhile, explore the scope behind each category.",
    } satisfies Heading,
  },

  /** Filters on the listing. */
  explorer: {
    categoryLabel: "Project category",
    allCategories: "All projects",
    statuses: { all: "All statuses", completed: "Completed", ongoing: "Ongoing" },
    allLocations: "All locations",
    locationLabel: "Location",
    searchLabel: "Search by project name or location",
    searchPlaceholder: "Search projects or locations",
    noResults: "No projects found for the selected filters.",
    clearFilters: "Clear filters",
    loadMore: "Load more projects",
  },

  card: { cta: "View case study" },

  cta: { title: "Request project references.", copy: "We can share relevant project references for your scope on request." },

  /** /projects/[slug] case-study template. */
  detail: {
    primaryLabel: "Request a quote",
    galleryLabel: "View gallery",
    infoLabel: "Project information",
    overview: { eyebrow: "Overview", title: "The", accent: "project." } satisfies Heading,
    scope: { title: "Scope of work", intro: "The activities Adidev undertook on this project." },
    highlightsTitle: "Execution highlights",
    gallery: { eyebrow: "Gallery", title: "On", accent: "site." } satisfies Heading,
    /** Tabs above the gallery. */
    phases: { all: "All", before: "Before", during: "During", after: "After" },
    relatedTitle: "Related projects",
    cta: { title: "Planning a similar project?", copy: "Connect with ADIDEV to discuss your project requirements and execution scope." },
    backLabel: "Back to projects",
  },
};
