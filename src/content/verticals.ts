import { verticalImages } from "./media";
import type { VerticalKey } from "@/config/theme";

export type Vertical = {
  key: VerticalKey;
  slug: string;
  number: string;
  title: string;
  shortTitle: string;
  /** Cinematic hero chapter copy. */
  story: { heading: string; copy: string; cta: string };
  summary: string;
  headline: string;
  highlights: string[];
  imageSlots: string[];
  industries: string[];
};

/** Division summaries used across the site. Full service-page content lives in data/services. */
export const verticals: Vertical[] = [
  {
    key: "telecom",
    slug: "telecom-infrastructure",
    number: "01",
    title: "Telecom Infrastructure",
    shortTitle: "Telecom",
    story: {
      heading: "Connecting the infrastructure behind communication.",
      copy: "Tower infrastructure, fibre networks, power systems and associated telecom project execution.",
      cta: "Explore Telecom",
    },
    summary:
      "Telecom site development, tower-related civil and structural works, fibre infrastructure, equipment, and power systems.",
    headline: "Connecting infrastructure. Enabling communication.",
    highlights: [
      "Site development & tower foundations",
      "Tower erection, upgradation & allied works",
      "Fibre laying, trenching & duct works",
      "DG, battery, SMPS & power infrastructure",
    ],
    imageSlots: ["Telecom tower / site execution", "Fibre / trenching", "Power / equipment"],
    industries: ["Telecom & Telecommunications"],
  },
  {
    key: "solar",
    slug: "solar-renewable-energy",
    number: "02",
    title: "Solar & Renewable Energy",
    shortTitle: "Solar",
    story: {
      heading: "Engineering the transition towards cleaner energy.",
      copy: "Site preparation, foundations, mounting structures, solar installation and electrical infrastructure.",
      cta: "Explore Solar",
    },
    summary:
      "Site preparation, piling, foundations, mounting structures, module installation, and associated electrical works.",
    headline: "Supporting the transition towards clean energy.",
    highlights: [
      "Site clearing, levelling & grading",
      "Piling, foundations & RCC works",
      "MMS & PV module installation",
      "DC / AC electrical & inverter coordination",
    ],
    imageSlots: ["Solar farm / rooftop installation", "MMS / foundations", "PV modules / electrical"],
    industries: ["Renewable Energy"],
  },
  {
    key: "civil",
    slug: "civil-construction-infrastructure",
    number: "03",
    title: "Civil Construction & Infrastructure",
    shortTitle: "Civil",
    story: {
      heading: "Building the foundations of industry and progress.",
      copy: "Industrial construction, RCC structures, foundations, sheds, warehouses, roads and associated infrastructure.",
      cta: "Explore Civil",
    },
    summary: "Civil and structural solutions for industrial, commercial, and infrastructure projects.",
    headline: "Building strong foundations for every project.",
    highlights: [
      "RCC foundations, columns, beams & slabs",
      "Industrial sheds & warehouse construction",
      "PEB civil works & structural steel support",
      "Roads, paving, drainage & external development",
    ],
    imageSlots: ["Civil / industrial construction", "RCC / foundations", "Industrial shed / warehouse"],
    industries: ["Industrial & Manufacturing", "Warehousing & Logistics", "Infrastructure & Real Estate"],
  },
  {
    key: "interiors",
    slug: "commercial-interior-fit-out",
    number: "04",
    title: "Commercial Interior & Fit-Out",
    shortTitle: "Interiors",
    story: {
      heading: "Creating environments where business comes to life.",
      copy: "Space planning, design coordination, MEP integration, workplace interiors and turnkey fit-out execution.",
      cta: "Explore Interiors",
    },
    summary:
      "Space planning, design coordination, BOQ, civil works, finishing, MEP coordination, and fit-out execution.",
    headline: "Creating functional and future-ready commercial spaces.",
    highlights: [
      "Space planning & design coordination",
      "BOQ, estimation & procurement",
      "Ceilings, partitions, flooring & finishes",
      "Electrical, HVAC & MEP coordination",
    ],
    imageSlots: ["Completed commercial interior", "Office / retail", "Site execution"],
    industries: ["Commercial & Retail"],
  },
];

export const verticalBySlug = (slug: string) => verticals.find((v) => v.slug === slug);
export const verticalByKey = (key: VerticalKey) => verticals.find((v) => v.key === key)!;
export const serviceHref = (v: Pick<Vertical, "slug">) => `/services/${v.slug}`;
/** Interim illustrative render per vertical — replace with approved project photography. */
/** Image per vertical — edit in src/content/media.ts (verticalImages). */
export const verticalImage = (v: Pick<Vertical, "key">) => verticalImages[v.key].src;
