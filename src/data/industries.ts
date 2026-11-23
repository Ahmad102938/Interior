import type { VerticalKey } from "@/config/theme";
import type { Status } from "@/lib/content";
import type { ProjectCategory } from "./projects";

/**
 * Industries = WHERE Adidev works. Services (verticals.ts) = WHAT it delivers;
 * projects (projects.ts) = what it has executed. Descriptions follow the client
 * presentation (slide 6); "requirements" are taken verbatim from the related
 * verticals' service lists (data/services), so nothing here extends the approved scope.
 */
export type Industry = {
  id: string;
  slug: string;
  name: string;
  /** Short tile headline — a restatement of the description, not a new claim. */
  headline: string;
  shortDescription: string;
  /** Where the work happens, restated from the description for the detail page. */
  environment: string;
  /** Typical requirements, drawn from the related verticals' service lists. */
  requirements: string[];
  /** Restrained accent: the colour of the primary related vertical. */
  brandAccent: VerticalKey;
  /** Primary vertical first. */
  relatedVerticals: VerticalKey[];
  /** Project categories that count as references for this industry. */
  projectCategories: ProjectCategory[];
  image: { src: string; alt: string; position?: string };
  publicationStatus: Status;
};

export const industries: Industry[] = [
  {
    id: "01",
    slug: "telecom-telecommunications",
    name: "Telecom & Telecommunications",
    headline: "Network infrastructure",
    shortDescription: "Supporting network infrastructure through tower-related civil and structural works, fibre systems and associated power infrastructure.",
    environment: "Tower sites, fibre and duct routes, and the power systems that keep networks running.",
    requirements: [
      "Telecom site development and site preparation",
      "Tower foundation and erection support",
      "Fibre optic cable laying, trenching, and duct works",
      "DG, AC, battery bank, inverter, and SMPS installation support",
    ],
    brandAccent: "telecom",
    relatedVerticals: ["telecom"],
    projectCategories: ["telecom"],
    image: { src: "/images/verticals/telecom.jpg", alt: "Lattice telecom tower — illustrative visualisation", position: "72% 35%" },
    publicationStatus: "provisional",
  },
  {
    id: "02",
    slug: "renewable-energy",
    name: "Renewable Energy",
    headline: "Solar infrastructure",
    shortDescription: "Supporting solar infrastructure through site preparation, foundations, mounting structures and installation-related execution.",
    environment: "Solar project sites — from prepared ground and foundations to mounting structures and module installation.",
    requirements: [
      "Site clearing, preparation, levelling, and grading",
      "Piling, foundations, RCC, and allied civil works",
      "Module Mounting Structure (MMS) installation",
      "Solar PV module installation",
    ],
    brandAccent: "solar",
    relatedVerticals: ["solar"],
    projectCategories: ["solar"],
    image: { src: "/images/verticals/solar.jpg", alt: "Rows of ground-mounted solar arrays — illustrative visualisation", position: "50% 60%" },
    publicationStatus: "provisional",
  },
  {
    id: "03",
    slug: "industrial-manufacturing",
    name: "Industrial & Manufacturing",
    headline: "Industrial facilities",
    shortDescription: "Supporting industrial facilities through building construction, structural works, sheds and facility improvements.",
    environment: "Industrial facilities and manufacturing buildings, including sheds, structural works and improvements to operating facilities.",
    requirements: [
      "RCC foundations, pedestals, columns, beams, and slabs",
      "Commercial and industrial buildings",
      "Industrial sheds and warehouse construction",
      "Waterproofing and industrial / commercial facility improvements",
    ],
    brandAccent: "civil",
    relatedVerticals: ["civil"],
    projectCategories: ["industrial", "renovation"],
    image: { src: "/images/posters/stage-3.jpg", alt: "Structural frame under construction with tower crane — illustrative visualisation", position: "42% 55%" },
    publicationStatus: "provisional",
  },
  {
    id: "04",
    slug: "commercial-retail",
    name: "Commercial & Retail",
    headline: "Customer-facing environments",
    shortDescription: "Supporting commercial environments including offices, showrooms, retail spaces and customer-facing interiors.",
    environment: "Offices, showrooms, retail spaces and other customer-facing interiors.",
    requirements: [
      "Space planning and design coordination",
      "False ceiling, partitions, painting, and wall finishes",
      "Electrical, lighting, HVAC, plumbing, and MEP coordination",
      "Furniture, fixtures, cabinetry, and office / retail / showroom fit-outs",
    ],
    brandAccent: "interiors",
    relatedVerticals: ["interiors", "civil"],
    projectCategories: ["interiors"],
    image: { src: "/images/verticals/interiors.jpg", alt: "Open commercial floor with glazed meeting room — illustrative visualisation", position: "55% 50%" },
    publicationStatus: "provisional",
  },
  {
    id: "05",
    slug: "warehousing-logistics",
    name: "Warehousing & Logistics",
    headline: "Warehouse & logistics facilities",
    shortDescription: "Supporting warehouse and logistics facilities through industrial sheds, paving, drainage and associated civil works.",
    environment: "Warehouse and logistics facilities — industrial sheds and paved areas with their associated drainage and civil works.",
    requirements: [
      "Industrial sheds and warehouse construction",
      "PEB-related civil works and structural steel / fabrication support",
      "Roads, paving, drainage, and external development",
      "Excavation, earthwork, levelling, grading, and backfilling",
    ],
    brandAccent: "civil",
    relatedVerticals: ["civil"],
    projectCategories: ["industrial"],
    image: { src: "/images/verticals/civil.jpg", alt: "Steel-framed industrial shed on RCC pedestals — illustrative visualisation", position: "58% 78%" },
    publicationStatus: "provisional",
  },
  {
    id: "06",
    slug: "infrastructure-real-estate",
    name: "Infrastructure & Real Estate",
    headline: "Civil & site development",
    shortDescription: "Supporting civil, structural and site development packages according to project requirements.",
    environment: "Civil, structural and site development packages, scoped to each project's requirements.",
    requirements: [
      "Site development and preparation",
      "Excavation, earthwork, levelling, grading, and backfilling",
      "RCC foundations, pedestals, columns, beams, and slabs",
      "Boundary works, renovation, repair, and maintenance",
    ],
    brandAccent: "telecom",
    relatedVerticals: ["civil"],
    projectCategories: ["civil"],
    image: { src: "/images/posters/stage-1.jpg", alt: "Building massing set out on a site plan — illustrative visualisation", position: "50% 45%" },
    publicationStatus: "provisional",
  },
];

export const industryBySlug = (slug: string) => industries.find((i) => i.slug === slug);
export const industryHref = (i: Pick<Industry, "slug">) => `/industries/${i.slug}`;
