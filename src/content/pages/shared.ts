import type { Cta, Heading } from "../types";

/**
 * Blocks reused on several pages: the enquiry/contact section, the closing
 * CTA banner and the "view all projects" tile.
 */
export const sharedContent = {
  /** Contact + enquiry form section (homepage, /contact). Contact details come from ../company.ts. */
  contact: {
    heading: {
      eyebrow: "Contact / request a quote",
      title: "Let's Build",
      accent: "Something Together.",
      intro: "Share your requirement, drawings or BOQ. Our team will review your enquiry and contact you regarding the project requirements.",
    } satisfies Heading,
  },

  /** Maroon closing banner. Pages can override title/copy (see their page file). */
  ctaBanner: {
    title: "Have a project in mind?",
    copy: "Share your drawings, BOQ or a short brief — our team will review it and respond.",
    primary: { label: "Request a quote", href: "/request-a-quote" } satisfies Cta,
    secondary: { label: "Contact us", href: "/contact" } satisfies Cta,
  },

  /** Gallery: filter chips and the closing "View all projects" tile. */
  projectGallery: {
    allLabel: "All projects",
    emptyCategory: "No published projects in this category yet.",
    viewAll: { eyebrow: "Portfolio", title: "View all", accent: "projects", copy: "Telecom, solar, civil and interiors" },
  },

  /** 3D hero static fallback (reduced motion / no WebGL). */
  heroFallback: {
    stagesLabel: "Design → Plan → Build → Handover → Interior",
    swipeHint: "Swipe →",
    scrollHint: "Scroll to explore",
    /** Short vertical label beside the scroll line on large screens. */
    scrollShort: "Scroll",
  },
};
