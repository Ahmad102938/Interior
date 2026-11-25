import type { VerticalKey } from "@/config/theme";
import type { Status } from "@/lib/content";
import type { Metric } from "../company";
import { renders } from "../media";
import { imageMap, type Cta, type Heading, type ImageAsset } from "../types";

/**
 * HOMEPAGE (/) — everything on the page, in the order it appears.
 *
 * Images: { src: "/images/…", alt: "…", position?: "50% 50%", caption?: "…" }.
 * Put the file in /public/images/… and write the path without "public".
 * Optional images (marked `?`) are not shown until you set them.
 *
 * Status: "verified" = always shown · "provisional" = shown · "pending" = hidden on the live site
 * (still visible in development, with an amber badge).
 *
 * Shown here, but edited in their own files because other pages use them too:
 *   - vertical panel text (summary, highlights) → ../verticals.ts
 *   - project cards                              → ../projects/<vertical>.ts
 *   - the six capabilities                       → ../capabilities.ts (capabilities)
 *   - the five execution stages                  → ../capabilities.ts (executionStages)
 *   - certifications                             → ../capabilities.ts (certifications)
 *   - contact details                            → ../company.ts (contact)
 *   - contact section heading + form             → ./shared.ts, ./forms.ts
 */

export type StoryChapter = {
  key: "design" | "plan" | "build" | "handover" | "interior";
  number: string;
  label: string;
  heading: string;
  copy: string;
  tags: string[];
};

export type EquipmentItem = {
  title: string;
  copy: string;
  model: "Owned" | "Leased" | "Hired" | "Partner-provided" | "[To confirm]";
  status: Status;
  /** Optional photo, e.g. "/images/equipment/excavator.jpg". */
  image?: string;
};

export const homePage = {
  /* ───────────── HERO — 3D "From Blueprint to Building" ───────────── */
  hero: {
    intro: {
      eyebrow: "Architecture · Interiors · Construction",
      title: "From Blueprint",
      accent: "to Building.",
      copy: "We design buildings and the spaces inside them — then construct them, end to end. Scroll to watch one take shape.",
      primary: { label: "Start your project", href: "/request-a-quote" } satisfies Cta,
      secondary: { label: "Our services", href: "/services" } satisfies Cta,
    },
    /** One chapter per scroll stage. Keep copy short — each is on screen for a few seconds. */
    chapters: [
      {
        key: "design",
        number: "01",
        label: "Design",
        heading: "It starts on the drawing board.",
        copy: "Every building begins as a plan — massed, zoned and modelled before anything is ordered.",
        tags: ["Space planning", "Design coordination", "2D drawings", "3D visualisation"],
      },
      {
        key: "plan",
        number: "02",
        label: "Plan",
        heading: "Engineered before we break ground.",
        copy: "Services, quantities and schedules are coordinated in the model, so the site has no surprises.",
        tags: ["Working drawings", "BOQ & costing", "MEP coordination", "Procurement"],
      },
      {
        key: "build",
        number: "03",
        label: "Build",
        heading: "Then it becomes real.",
        copy: "Our site teams turn the drawings into concrete and steel — floor by floor, supervised and quality-checked at every stage.",
        tags: ["Civil & structure", "MEP installation", "Site supervision", "Quality checks"],
      },
      {
        key: "interior",
        number: "04",
        label: "Interior",
        heading: "Step inside.",
        copy: "Workplaces designed and fitted out end to end — light, joinery, planting and services, delivered as one.",
        tags: ["Interior design", "Joinery & fit-out", "Lighting & MEP", "Turnkey delivery"],
      },
      {
        key: "handover",
        number: "05",
        label: "Handover",
        heading: "Delivered. Ready for business.",
        copy: "Façade, interiors, landscape and final snags closed — handed over complete, documented and ready to use.",
        tags: ["Façade & glazing", "Landscape", "Snag closure", "Handover"],
      },
    ] as StoryChapter[],
    /** Buttons after the last chapter. */
    outro: {
      primary: { label: "View projects", href: "/projects" } satisfies Cta,
      secondary: { label: "Request a quote", href: "/request-a-quote" } satisfies Cta,
      alsoLine: "Also delivering Telecom & Solar infrastructure",
      alsoHref: "#verticals",
    },
    /**
     * Still images of the hero: [intro, design, plan, build, interior, handover].
     * Shown while the 3D scene loads, and as the whole hero on phones with reduced motion / no WebGL.
     */
    posters: [renders.drawing.src, renders.massing.src, renders.model.src, renders.construction.src, renders.interior.src, renders.completed.src],
  },

  /* ───────────── 01 — WHO WE ARE ───────────── */
  heritage: {
    heading: {
      eyebrow: "Who we are",
      title: "Built on Experience.",
      accent: "Driven by Execution.",
      intro: "Adidev supports the development, execution and maintenance of projects across telecom, renewable energy, civil construction and commercial fit-outs.",
    } satisfies Heading,
    link: { label: "Our story, values & people", href: "/about" } satisfies Cta,
    /**
     * Company figures (the 2×2 stat grid). Replace the [placeholders] with real numbers
     * and set status: "verified" to publish them.
     */
    metrics: [
      { id: "experience", value: "[0]", label: "Years of operation", detail: "Calculated from the confirmed establishment year.", status: "verified", note: "Depends on the 2014 vs 2017 establishment date conflict." },
      { id: "states", value: "[00]", label: "States with project presence", detail: "Operational footprint across Indian states.", status: "verified", note: "Figma draft shows 18 States — unverified." },
      { id: "sites", value: "[0,000+]", label: "Telecom sites supported", detail: "Site development, installation and allied works.", status: "verified", note: "Figma draft shows 1,000+ LTE — unverified." },
      { id: "team", value: "[000+]", label: "Engineers & site professionals", detail: "Project management, engineering and site supervision.", status: "verified" },
    ] as Metric[],
  },

  /* ───────────── 02 — BUSINESS VERTICALS (also on /services) ───────────── */
  verticals: {
    heading: {
      eyebrow: "Business verticals",
      title: "Four Pillars",
      accent: "of Execution.",
      intro: "Four clear service pathways, each delivered with the same planning discipline, technical coordination and site supervision.",
    } satisfies Heading,
    cardCta: "Explore service",
    /** Large image on each vertical panel. For your own photo: telecom: { src: "/images/…", alt: "…" } (no caption). */
    images: imageMap<VerticalKey>({
      telecom: { src: "/images/projects/641-1.webp", alt: "Completed commercial building at dusk" },
      solar: { src: "/images/projects/solar.webp", alt: "Completed solar panel installation" },
      civil: { src: "/images/projects/const.jpg", alt: "Completed civil construction site" },
      interiors: { src: "/images/projects/int.png", alt: "Completed interior design project" },
    }),
  },

  /* ───────────── 03 — SELECTED PROJECTS ───────────── */
  projects: {
    heading: {
      eyebrow: "Selected projects",
      title: "Proven Through",
      accent: "Projects.",
      intro: "Completed and ongoing work across our four verticals — scope, location and execution highlights, published with client approval.",
    } satisfies Heading,
    /** How many project cards to show before the "View all" tile. */
    limit: 6,
    empty: { title: "Case studies are being prepared for publication.", cta: { label: "Request project references", href: "/contact" } satisfies Cta },
  },

  /* ───────────── 04 — ENGINEERING CAPABILITIES ───────────── */
  capabilities: {
    heading: {
      eyebrow: "Engineering capabilities",
      title: "One Integrated Approach.",
      accent: "Complete Project Control.",
      intro: "Planning, engineering coordination, procurement, field execution and handover managed as one connected system — so decisions made early carry through to site.",
    } satisfies Heading,
    note: "In-house expertise is clearly distinguished from qualified partner- or vendor-supported delivery on every project.",
    cta: { label: "Explore capabilities", href: "/capabilities" } satisfies Cta,
    /** Optional photo behind the whole section (shown dimmed under the navy). */
    backgroundImage: undefined as ImageAsset | undefined,
  },

  /* ───────────── 05 — EXECUTION FRAMEWORK ───────────── */
  execution: {
    heading: {
      eyebrow: "Execution framework",
      title: "From Requirements",
      accent: "to Handover.",
      intro: "A clear five-stage process so every client understands how a project moves from brief to completion.",
    } satisfies Heading,
    scrollHint: "Scroll to advance",
    stageLabel: "Stage",
    /**
     * Optional photo per stage (key = stage number), shown beside the stage text on large screens.
     * e.g. "01": { src: "/images/company/site-survey.jpg", alt: "Site survey" }
     */
    stageImages: {} as Record<string, ImageAsset>,
  },

  /* ───────────── 06 — QUALITY, SAFETY & GOVERNANCE (also on /quality-safety-compliance) ───────────── */
  quality: {
    heading: {
      eyebrow: "Quality, safety & governance",
      title: "Engineered with Discipline.",
      accent: "Delivered with Responsibility.",
      intro: "Clear practices on every site — from approved drawings and material verification to PPE, toolbox talks and documented handover.",
    } satisfies Heading,
    /**
     * icon: "clipboard" | "shield" | "leaf" | "landmark" · tone: "gold" | "emerald" | "navy"
     * Optional `image: { src, alt }` shows a photo at the top of that block.
     */
    blocks: [
      {
        title: "Quality assurance",
        icon: "clipboard",
        tone: "gold",
        items: ["Approved drawings and BOQ", "Material verification", "Workmanship inspection", "Stage-wise checks", "Defect / snag closure", "Testing records"],
      },
      {
        title: "Health & safety",
        icon: "shield",
        tone: "emerald",
        items: ["Site induction & toolbox talks", "PPE", "Risk identification", "Safe handling", "Housekeeping", "Incident reporting and corrective actions"],
      },
      {
        title: "Environmental responsibility",
        icon: "leaf",
        tone: "emerald",
        items: ["Responsible material use", "Waste management", "Resource efficiency", "Renewable energy support", "Responsible site practices"],
      },
      {
        title: "Governance & compliance",
        icon: "landmark",
        tone: "navy",
        items: ["Documented approvals", "Compliance documentation", "Transparent reporting", "Handover records"],
      },
    ] as { title: string; icon: "clipboard" | "shield" | "leaf" | "landmark"; tone: "gold" | "emerald" | "navy"; items: string[]; image?: ImageAsset }[],
    certificationsLabel: "Certifications & compliance",
    /** Optional photo behind the whole section (shown dimmed under the charcoal). */
    backgroundImage: undefined as ImageAsset | undefined,
  },

  /* ───────────── 07 — WHY ADIDEV, CLIENTS & RESOURCES (also on /clients-partners) ───────────── */
  clients: {
    heading: {
      eyebrow: "Clients, partners & resources",
      title: "Why Clients",
      accent: "Work With Adidev.",
      intro: "Capabilities translated into client benefits — supported by project evidence and verified information, never unverified promises.",
    } satisfies Heading,
    /** The numbered benefit cards. */
    whyCards: [
      { title: "Integrated capabilities", copy: "Multiple engineering and execution capabilities under one organisation." },
      { title: "Coordinated delivery", copy: "Planning, technical coordination, procurement, and site execution support." },
      { title: "Practical site approach", copy: "Solutions aligned with actual site conditions and project requirements." },
      { title: "Flexible project support", copy: "Support for individual work packages and broader project requirements." },
      { title: "Resource coordination", copy: "Coordination of materials, vendors, manpower, and execution resources." },
      { title: "Quality-focused working", copy: "Attention to specifications, workmanship, safety, and handover." },
    ],
    logosLabel: "Clients & partners",
    /**
     * Client / partner logos — publish only with permission.
     * logo: e.g. "/images/company/clients/acme.png" (transparent PNG or SVG; shown greyscale).
     */
    logos: Array.from({ length: 8 }, (_, i) => ({ name: `[Approved client ${i + 1}]`, status: "pending" as Status })) as { name: string; logo?: string; status: Status }[],
    /** Genuine, approved quotes only. e.g. { quote: "…", author: "Name", role: "Title, Company", status: "verified" } */
    testimonials: [] as { quote: string; author: string; role: string; status: Status }[],
  },

  /** Equipment block at the end of section 07 (also listed on /capabilities). */
  equipment: {
    eyebrow: "Equipment & technical resources",
    title: "Resources behind the work.",
    note: "Each resource is labelled as owned, leased, hired or partner-provided.",
    items: [
      { title: "Construction equipment", copy: "Excavators, lifting equipment, access systems and other machinery, where available.", model: "[To confirm]", status: "pending", image: "/images/projects/eqp1.jpeg" },
      { title: "Installation tools", copy: "Trade-specific tools and equipment for site installation and fit-out works.", model: "[To confirm]", status: "pending", image: "/images/projects/tool1.webp" },
      { title: "Testing instruments", copy: "Electrical and other testing instruments relevant to the approved work scope.", model: "[To confirm]", status: "pending", image: "/images/projects/test1.jpg" },
      { title: "Survey resources", copy: "Survey and measurement equipment for site assessment and setting out.", model: "[To confirm]", status: "pending", image: "/images/projects/sur1.g" },
    ] as EquipmentItem[],
  },
};
