import type { VerticalKey } from "@/config/theme";
import type { Status } from "@/lib/content";

export type ProjectCategory = VerticalKey | "industrial" | "renovation";

export const projectCategories: { key: ProjectCategory; label: string; vertical: VerticalKey }[] = [
  { key: "telecom", label: "Telecom infrastructure", vertical: "telecom" },
  { key: "solar", label: "Solar & renewable energy", vertical: "solar" },
  { key: "civil", label: "Civil construction", vertical: "civil" },
  { key: "industrial", label: "Industrial sheds & warehouses", vertical: "civil" },
  { key: "interiors", label: "Commercial interior & fit-out", vertical: "interiors" },
  { key: "renovation", label: "Renovation & maintenance", vertical: "civil" },
];

export type Project = {
  slug: string;
  name: string;
  category: ProjectCategory;
  vertical: VerticalKey;
  projectStatus: "Completed" | "Ongoing" | "[Status]";
  client?: string;
  location: string;
  scope: string;
  capacity?: string;
  duration?: string;
  highlights: string[];
  imageSlot: string;
  featured?: boolean;
  status: Status;
};

/**
 * NO REAL PROJECT DATA HAS BEEN SUPPLIED YET.
 * These entries are layout placeholders describing the *kind* of case study
 * expected per category. They are "pending" and therefore never published in
 * production. Replace each with an approved case study and set status: "verified".
 */
export const projects: Project[] = [
  {
    slug: "utility-scale-solar-installation",
    name: "[Utility-scale solar installation]",
    category: "solar",
    vertical: "solar",
    projectStatus: "[Status]",
    client: "[If authorised]",
    location: "[City, State]",
    scope: "Site preparation, piling, MMS installation, PV module installation and DC-side works.",
    capacity: "[Verified MW]",
    duration: "[Start–completion]",
    highlights: ["Site levelling and grading", "Pile foundations", "MMS erection", "Module installation"],
    imageSlot: "Solar farm — aerial view of completed arrays",
    featured: true,
    status: "pending",
  },
  {
    slug: "telecom-tower-site-rollout",
    name: "[Telecom tower site rollout]",
    category: "telecom",
    vertical: "telecom",
    projectStatus: "[Status]",
    location: "[City, State]",
    scope: "Site development, tower foundations, erection support and power systems installation.",
    capacity: "[Verified number of sites]",
    highlights: ["Tower foundations", "Erection support", "DG & SMPS installation"],
    imageSlot: "Telecom tower — site execution",
    status: "pending",
  },
  {
    slug: "industrial-warehouse-peb",
    name: "[Industrial warehouse & PEB works]",
    category: "industrial",
    vertical: "civil",
    projectStatus: "[Status]",
    location: "[City, State]",
    scope: "RCC foundations, PEB-related civil works, flooring and external development.",
    capacity: "[Verified sq ft]",
    highlights: ["RCC pedestals", "Industrial flooring", "Drainage & paving"],
    imageSlot: "Warehouse — structural steel frame",
    status: "pending",
  },
  {
    slug: "corporate-office-fit-out",
    name: "[Corporate office fit-out]",
    category: "interiors",
    vertical: "interiors",
    projectStatus: "[Status]",
    location: "[City, State]",
    scope: "Space planning, partitions, false ceiling, MEP coordination and turnkey fit-out.",
    capacity: "[Verified sq ft]",
    highlights: ["Space planning", "Glass partitions", "HVAC & lighting coordination"],
    imageSlot: "Completed workplace interior",
    status: "pending",
  },
  {
    slug: "fibre-network-trenching",
    name: "[Fibre network & duct works]",
    category: "telecom",
    vertical: "telecom",
    projectStatus: "[Status]",
    location: "[City, State]",
    scope: "Fibre optic cable laying, trenching and duct works.",
    capacity: "[Verified route km]",
    highlights: ["Route survey", "Trenching & ducting", "Cable laying"],
    imageSlot: "Fibre trenching — site execution",
    status: "pending",
  },
  {
    slug: "rooftop-solar-installation",
    name: "[Rooftop solar installation]",
    category: "solar",
    vertical: "solar",
    projectStatus: "[Status]",
    location: "[City, State]",
    scope: "Rooftop MMS, module installation and AC-side electrical works.",
    capacity: "[Verified kWp]",
    highlights: ["Structural assessment", "MMS installation", "Inverter coordination"],
    imageSlot: "Rooftop solar — industrial roof",
    status: "pending",
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
