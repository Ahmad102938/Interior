import { renders } from "../media";
import { image, type Cta, type Heading } from "../types";

/**
 * /industries and /industries/[slug] — section copy and images.
 * The six industries themselves (name, description, image, requirements) live in ../industries.ts.
 */
export const industriesPage = {
  meta: {
    title: "Industries We Serve",
    description: "Telecom, renewable energy, industrial & manufacturing, commercial & retail, warehousing & logistics, and infrastructure & real estate.",
  },

  hero: {
    heading: {
      eyebrow: "Industries we serve",
      title: "Where we",
      accent: "deliver.",
      intro: "Explore the sectors and operating environments where Adidev brings engineering coordination, infrastructure expertise and project execution capabilities.",
    } satisfies Heading,
    primary: { label: "Explore industries", href: "#industries" } satisfies Cta,
    secondary: { label: "View projects", href: "/projects" } satisfies Cta,
    /** Three-image composition on large screens. */
    images: {
      main: image({ src: "/images/projects/telecom2.jpg", alt: "Telecom", position: "60% 50%" }),
      plan: image({ src: "/images/projects/solarimg.webp", alt: "Telecom", position: "55% 45%" }),
      interior: image({ src: "/images/projects/constr.jpg", alt: "Telecom", position: "40% 60%" }),
    },
  },

  explorer: {
    heading: {
      eyebrow: "Industries we serve",
      title: "Find your sector.",
      accent: "Six operating environments.",
      intro: "Industries describe where we work. Choose one to see the requirements we support there, the services involved and, where approved, project references.",
    } satisfies Heading,
  },

  verticals: {
    heading: {
      eyebrow: "Business verticals",
      title: "Capabilities that",
      accent: "connect industries.",
      intro: "Four business verticals carry our delivery into each sector. The links below show typical relationships — the exact scope is confirmed for every project.",
    } satisfies Heading,
    servesLabel: "Typically serves",
  },

  projects: {
    heading: {
      eyebrow: "Project proof",
      title: "Experience",
      accent: "in the field.",
      intro: "Approved project references, filtered by sector. Names, clients and figures are published only once verified.",
    } satisfies Heading,
    allLabel: "All industries",
    empty: {
      title: "Project references are being prepared for publication.",
      copy: "Only approved case studies are published. Select a sector above to see what we deliver there, or ask for references relevant to your scope.",
      cta: { label: "Request references", href: "/request-a-quote" } satisfies Cta,
    },
    noReference: {
      eyebrow: "No public reference yet",
      copy: "Approved project references for this sector will appear here. Until then, these are the requirements we support — references can be shared on request.",
    },
  },

  approach: {
    heading: {
      eyebrow: "Integrated delivery",
      title: "One method,",
      accent: "every environment.",
      intro: "Whether the site is a tower, a solar field, a warehouse or a showroom, projects move through the same five documented stages.",
    } satisfies Heading,
    link: { label: "The full execution framework", href: "/capabilities#execution" } satisfies Cta,
  },

  cta: {
    title: "Have a project in mind?",
    copy: "Tell us about your requirements and the environment in which you are planning to work.",
  },

  /** /industries/[slug] — the shared template for every industry. */
  detail: {
    eyebrowSuffix: "Industries we serve",
    primary: { label: "Request a quote", href: "/request-a-quote" } satisfies Cta,
    /** `{vertical}` is replaced with the primary vertical's short name. */
    secondaryLabel: "{vertical} services",
    environment: { eyebrow: "Operating environment", title: "Where the work", accent: "happens." } satisfies Heading,
    requirementsLabel: "Key requirements we support",
    capabilities: { eyebrow: "Relevant capabilities", title: "What we bring", accent: "to this sector." } satisfies Heading,
    deliveredWithLabel: "Delivered with",
    viewService: "View service",
    references: { eyebrow: "Project references", title: "Experience", accent: "in the field." } satisfies Heading,
    previous: "Previous",
    next: "Next",
  },
};
