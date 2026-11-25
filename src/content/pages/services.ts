import type { Cta, Heading } from "../types";

/**
 * /services and the shared /services/[slug] template.
 * Each division's own copy, images and lists live in ../services/<vertical>.ts —
 * this file holds only the labels and headings every service page shares.
 */
export const servicesPage = {
  meta: {
    title: "Our Services",
    description: "Telecom infrastructure, solar & renewable energy, civil construction & infrastructure, and commercial interior & fit-out.",
  },

  hero: {
    heading: {
      eyebrow: "Our services",
      title: "Four verticals.",
      accent: "One delivery standard.",
      intro: "Each vertical has its own specialists and process — and shares the same planning, coordination, quality and handover discipline.",
    } satisfies Heading,
  },

  /** /services/[slug] — labels shared by every division page. */
  detail: {
    hero: { primaryLabel: "Request a quote", secondary: { label: "Explore capabilities", href: "#capabilities" } satisfies Cta },
    subnavCta: "Request a quote",
    /** Labels in the sticky in-page menu (the scope label comes from each service file: feature.navLabel). */
    subnav: { overview: "Overview", capabilities: "Capabilities", process: "Process", projects: "Projects", support: "Support", enquire: "Enquire" },
    overview: {
      eyebrow: "Overview",
      capabilityAreas: "Capability areas",
      processStages: "Process stages",
      sectorsServed: "Sectors served",
      scopeNoteLabel: "Scope note.",
    },
    capabilities: { eyebrow: "Capabilities", title: "What we", accent: "deliver." },
    process: { eyebrow: "Execution process" },
    support: {
      heading: {
        eyebrow: "Behind the delivery",
        title: "Engineering that",
        accent: "supports the site.",
        intro: "Every project draws on capabilities shared across Adidev. These matter most for this division.",
      } satisfies Heading,
      cardCta: "Capabilities",
      qualityLabel: "Quality checks on this work",
      qualityLink: { label: "Quality & safety", href: "/quality-safety-compliance" } satisfies Cta,
    },
    projects: {
      heading: { eyebrow: "Project references", title: "Proof on", accent: "the ground." },
      /** `{service}` is replaced with the division name (lower case). */
      intro: "Approved {service} references. Names, clients, locations and figures are published only once verified.",
      viewAll: "View all projects",
      conceptLabel: "Visual concept",
      empty: {
        title: "References are being prepared for publication.",
        copy: "The images above are visual concepts, not project records. References relevant to your scope can be shared on request.",
        cta: "Request references",
      },
    },
    enquiry: {
      eyebrow: "Enquire",
      primaryLabel: "Request a quote",
      secondary: { label: "Contact us", href: "/contact" } satisfies Cta,
      otherLabel: "Other divisions",
    },
  },
};
