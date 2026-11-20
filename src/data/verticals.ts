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
  services: string[];
  process: string[];
  imageSlots: string[];
  industries: string[];
};

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
    services: [
      "Telecom site development and site preparation.",
      "Tower foundation and erection support.",
      "Tower installation, upgradation, and allied works.",
      "Fibre optic cable laying, trenching, and duct works.",
      "Telecom equipment installation and integration coordination.",
      "IBS / in-building telecom support, where applicable.",
      "DG, AC, battery bank, inverter, and SMPS installation support.",
      "Electrical and power infrastructure.",
      "Testing, commissioning, and preventive / corrective maintenance.",
    ],
    process: ["Site Assessment", "Civil Readiness", "Installation", "Integration", "Testing", "Handover"],
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
    services: [
      "Solar project execution support.",
      "Site clearing, preparation, levelling, and grading.",
      "Piling, foundations, RCC, and allied civil works.",
      "Module Mounting Structure (MMS) installation.",
      "Solar PV module installation.",
      "DC-side installation support.",
      "AC-side electrical works and inverter installation coordination.",
      "Testing, commissioning, operation, and maintenance support.",
      "Rectification and associated site works.",
    ],
    process: ["Site Preparation", "Foundations", "MMS", "Module Installation", "Electrical Works", "Testing & Handover"],
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
    services: [
      "Site development and preparation.",
      "Excavation, earthwork, levelling, grading, and backfilling.",
      "RCC foundations, pedestals, columns, beams, and slabs.",
      "Industrial sheds and warehouse construction.",
      "PEB-related civil works and structural steel / fabrication support.",
      "Commercial and industrial buildings.",
      "Roads, paving, drainage, and external development.",
      "Boundary works, renovation, repair, and maintenance.",
      "Waterproofing and industrial / commercial facility improvements.",
    ],
    process: ["Requirement Study", "Drawings & BOQ", "Site Preparation", "Execution", "Quality Inspection", "Handover"],
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
    services: [
      "Requirement study, site measurement, and functional zoning.",
      "Space planning and design coordination.",
      "2D layouts, working drawings, elevations, and detailing.",
      "3D visualisation, where available.",
      "BOQ, cost estimation, and procurement coordination.",
      "Masonry, plastering, flooring, tiling, and skirting.",
      "False ceiling, partitions, painting, and wall finishes.",
      "Electrical, lighting, HVAC, plumbing, and MEP coordination.",
      "Fire and low-voltage systems coordination.",
      "Furniture, fixtures, cabinetry, and office / retail / showroom fit-outs.",
      "Renovation, snagging, and final handover.",
    ],
    process: ["Client Brief", "Space Planning", "Design", "BOQ & Procurement", "Execution", "Snagging & Handover"],
    imageSlots: ["Completed commercial interior", "Office / retail", "Site execution"],
    industries: ["Commercial & Retail"],
  },
];

export const verticalBySlug = (slug: string) => verticals.find((v) => v.slug === slug);
export const verticalByKey = (key: VerticalKey) => verticals.find((v) => v.key === key)!;
export const serviceHref = (v: Pick<Vertical, "slug">) => `/services/${v.slug}`;
/** Interim illustrative render per vertical — replace with approved project photography. */
export const verticalImage = (v: Pick<Vertical, "key">) => `/images/verticals/${v.key}.jpg`;
