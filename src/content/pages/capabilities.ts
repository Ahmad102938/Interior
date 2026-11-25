import { renders } from "../media";
import { image, imageMap, type Cta, type Heading } from "../types";

/**
 * /capabilities — section copy and images, in page order.
 * The six capabilities, delivery flow and execution stages live in ../capabilities.ts;
 * delivery-model labels in ../deliveryModels.ts.
 */
export const capabilitiesPage = {
  meta: {
    title: "Engineering & Project Capabilities",
    description:
      "Engineering and design coordination, BOQ and cost management, project planning, procurement and vendors, site execution, and quality and handover — and how they connect from requirement to handover.",
  },

  hero: {
    heading: {
      eyebrow: "Engineering capabilities",
      title: "Plan. Coordinate.",
      accent: "Execute. Hand over.",
      intro: "Discover how ADIDEV brings together engineering coordination, cost management, project planning, resource coordination and on-ground execution to support infrastructure projects.",
    } satisfies Heading,
    primary: { label: "Explore capabilities", href: "#capabilities" } satisfies Cta,
    secondary: { label: "Discuss a project", href: "/request-a-quote" } satisfies Cta,
    image: image({ src: "/images/projects/cmt1.jpg", alt: "Site Execution — Site", position: "55% 45%" }),
    programmeLabel: "Capabilities across the sequence",
    /** Short names on the hero programme card, by capability number. */
    shortNames: { "01": "Engineering", "02": "BOQ & cost", "03": "Planning", "04": "Procurement", "05": "Site execution", "06": "Quality" } as Record<string, string>,
  },

  explorer: {
    heading: {
      eyebrow: "Six capabilities",
      title: "What ADIDEV can plan,",
      accent: "coordinate, manage and execute.",
      intro: "Six capabilities in three groups — from defining the requirement to handing over a documented, inspected project.",
    } satisfies Heading,
    activitiesLabel: "Supporting activities",
    deliveryLabel: "Delivery model",
    /** Image per capability number; capabilities without one show a line diagram. */
    images: imageMap<string>({
      "01": { ...renders.drawing, position: "60% 45%" },
      "05": { src: "/images/projects/civil1.png", alt: "Site Execution — Site", position: "48% 55%" },
      "06": { src: "/images/projects/int9.jpg", alt: "Site Execution — Site", position: "55% 50%" },
    }),
  },

  integrated: {
    heading: {
      eyebrow: "Integrated delivery",
      title: "One Integrated Approach.",
      accent: "Connected Project Delivery.",
      intro: "Each capability hands a defined output to the next, so decisions made at the requirement stage carry through to site and handover.",
    } satisfies Heading,
    note: "The line is not one-way: progress tracking and reporting (03) and stage-wise checks (06) run alongside site execution and feed back into the plan.",
  },

  crossVertical: {
    heading: {
      eyebrow: "Across the verticals",
      title: "One Engineering Framework.",
      accent: "Four Business Verticals.",
      intro: "The same six capabilities sit behind every division. Which of them a project draws on — and how much — depends on its approved scope.",
    } satisfies Heading,
    frameworkLabel: "The framework",
    hint: "Point to a division to highlight the capabilities its work typically leans on.",
    /** `{division}` is replaced with the division name. */
    activeHint: "Typical emphasis for {division}. All six may apply, depending on the approved scope.",
    emphasisLabel: "Typical emphasis",
    cardCta: "View service",
  },

  deliveryModel: {
    heading: {
      eyebrow: "Delivery model",
      title: "Clear Responsibilities.",
      accent: "Coordinated Execution.",
      intro: "Projects can draw on different arrangements of expertise and resources, depending on scope and technical requirements. Adidev coordinates the appropriate expertise and resources for the approved scope — and each proposal states which arrangement applies.",
    } satisfies Heading,
    resourcesLabel: "Equipment & technical resources",
  },

  methodology: {
    heading: {
      eyebrow: "Execution methodology",
      title: "Five stages,",
      accent: "brief to handover.",
      intro: "Where the capabilities describe what Adidev can do, the methodology is the order in which a project moves — documented and coordinated with the client at every stage.",
    } satisfies Heading,
  },

  projects: {
    heading: { eyebrow: "Project evidence", title: "Capabilities", accent: "Put Into Practice." } satisfies Heading,
    introWithProjects: "Selected case studies, each listing the scope actually delivered.",
    introWithoutProjects: "Approved project references are being prepared for publication. Until then, this is how the capability groups come together on site.",
    viewAll: { label: "View all projects", href: "/projects" } satisfies Cta,
    /** Stand-in image per capability group, shown until approved case studies exist. */
    groupImages: imageMap<string>({
      "pre-construction": renders.massing,
      "field-execution": { ...renders.civil, alt: "Steel shed frame rising on RCC pedestals — illustrative visualisation" },
      "quality-completion": { ...renders.interior, alt: "Completed workplace interior — illustrative visualisation" },
    }),
  },

  cta: {
    title: "Have a Project to Plan, Coordinate or Execute?",
    copy: "Connect with ADIDEV to discuss your requirements and explore the appropriate engineering and project delivery capabilities.",
    primary: { label: "Request a quote", href: "/request-a-quote" } satisfies Cta,
    secondary: { label: "Explore our services", href: "/services" } satisfies Cta,
  },
};
