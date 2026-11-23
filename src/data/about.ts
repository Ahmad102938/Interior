import type { VerticalKey } from "@/config/theme";
import type { Status } from "@/lib/content";
import { industries } from "./industries";

/**
 * About page content. Sourced from the ADIDEV Editable Website Master
 * Presentation (slides 2, 5, 6, 12, 13, 16, 17) and the existing public site.
 * Anything marked "pending" needs management approval and is never published
 * in production (see lib/content.ts and docs/CONTENT_VERIFICATION.md).
 *
 * Ownership rule: this page owns the company story (overview, vision, mission,
 * values, organisation, heritage). Other pages own service lists, capability
 * detail and quality practice detail — here they are summarised and linked.
 */

export const aboutIntro = {
  eyebrow: "About ADIDEV",
  title: "One partner,",
  accent: "from drawing to handover.",
  lead: "ADIDEV is an integrated engineering and infrastructure solutions company supporting the development, execution and maintenance of projects across telecommunications, renewable energy, civil construction and commercial interior fit-out.",
  /** True, non-numeric facts — safe to publish. */
  facts: [
    { label: "Business verticals", value: "Four" },
    { label: "Delivery model", value: "Design to handover" },
    { label: "Project support", value: "Packages to full scope" },
  ],
};

export const aboutStory = {
  statement: "We bring planning, coordination and site execution under one roof.",
  body: "By bringing together technical coordination, project planning, resource management and on-ground execution, ADIDEV works to deliver practical project solutions aligned with approved drawings, specifications and agreed requirements.",
  howWeWork: "We understand project requirements, coordinate technical resources, manage execution and deliver against approved drawings, specifications and agreed timelines.",
  /** The project lifecycle ADIDEV connects (brief §4). */
  lifecycle: [
    "Technical planning",
    "Engineering coordination",
    "Project management",
    "BOQ & cost management",
    "Procurement & vendors",
    "Resource deployment",
    "Site execution",
    "Quality inspection",
    "Testing & handover",
  ],
};

export const vision = "To become a trusted engineering and infrastructure partner recognised for dependable project delivery and long-term value.";
export const mission = "To provide integrated, quality-focused project solutions through responsible execution, technical coordination and client collaboration.";

export const values: { name: string; detail: string }[] = [
  { name: "Quality", detail: "Attention to approved drawings, specifications, workmanship and stage-wise inspection." },
  { name: "Safety", detail: "A responsible approach to site safety, hazard identification, PPE and safe working practices." },
  { name: "Integrity", detail: "Transparent business conduct, accountability and professional responsibility." },
  { name: "Innovation", detail: "Practical improvements in engineering coordination, execution and problem-solving." },
  { name: "Commitment", detail: "Responsibility towards agreed project requirements and client expectations." },
  { name: "Collaboration", detail: "Coordination between clients, technical teams, vendors, project management and site personnel." },
];

/** ADIDEV's role in each vertical — the About-page view (service lists live on the service pages). */
export const verticalRoles: Record<VerticalKey, string> = {
  telecom:
    "Supporting network deployment on the ground — from site development and tower foundations to fibre routes and the power systems that keep sites running.",
  solar:
    "Connecting renewable-energy infrastructure with the civil, structural and electrical execution it depends on — from site preparation and piling to modules and inverters.",
  civil:
    "Building the physical infrastructure industry runs on — RCC structures, industrial sheds, warehouses, roads, drainage and the facilities around them.",
  interiors:
    "Turning commercial floor plates into working offices, retail spaces and showrooms — planning, technical coordination, finishing and execution as one package.",
};

/** Industries served, and which verticals each draws on (single source: industries.ts; detail lives on /industries). */
export const industryMap: { name: string; verticals: VerticalKey[] }[] = industries.map((i) => ({ name: i.name, verticals: i.relatedVerticals }));

/** The six disciplines that connect every vertical (detail lives on /capabilities). */
export const disciplines = [
  "Engineering & design coordination",
  "BOQ & cost management",
  "Project planning",
  "Procurement & vendors",
  "Site execution",
  "Quality & handover",
];

export type FunctionKey = "pm" | "eng" | "design" | "proc" | "site" | "bd";

/** Organisational functions (slide 16). */
export const functions: Record<FunctionKey, { name: string; role: string }> = {
  pm: { name: "Project management", role: "Planning, scheduling, coordination and reporting." },
  eng: { name: "Engineering & technical", role: "Drawings, technical coordination and documentation." },
  design: { name: "Design & architecture", role: "Space planning, design development and detailing." },
  proc: { name: "Procurement & vendors", role: "Material planning, sourcing and commercial coordination." },
  site: { name: "Site supervision & quality", role: "Site execution, inspections and quality checks." },
  bd: { name: "Business development", role: "Client coordination, proposals and enquiries." },
};

/**
 * Execution method (slide 13) with the functions that lead and support each
 * stage — the About page's own angle on the process: who is involved, when.
 */
export const method: { number: string; title: string; detail: string; teams: FunctionKey[] }[] = [
  { number: "01", title: "Understand", detail: "Client brief, objectives, site conditions, scope and constraints.", teams: ["bd", "pm", "eng"] },
  { number: "02", title: "Plan", detail: "Drawings, BOQ, estimates, resources, schedule and technical coordination.", teams: ["eng", "design", "pm"] },
  { number: "03", title: "Mobilise", detail: "Approvals, procurement, vendors, manpower, equipment and site readiness.", teams: ["proc", "pm", "site"] },
  { number: "04", title: "Execute", detail: "Site coordination, progress monitoring, quality checks and safe work practices.", teams: ["site", "pm", "eng"] },
  { number: "05", title: "Inspect & handover", detail: "Inspections, testing where applicable, snag closure, documents and handover.", teams: ["site", "eng", "pm"] },
];

/** Responsible execution — principles only (practice lists live on /quality-safety-compliance). */
export const responsibility: { title: string; principle: string; accent: "gold" | "emerald" }[] = [
  { title: "Quality assurance", principle: "Work is checked against approved drawings and BOQ — materials verified, workmanship inspected stage by stage, snags closed and testing recorded.", accent: "gold" },
  { title: "Health & safety", principle: "Every site starts with induction and PPE, identifies its risks, and reports incidents so corrective action follows.", accent: "emerald" },
  { title: "Sustainability", principle: "Responsible material use, waste management and resource efficiency — alongside our renewable-energy work.", accent: "emerald" },
];

/** Company facts — all need management approval before publishing. */
export const companyFacts: { label: string; value: string; status: Status; note?: string }[] = [
  {
    label: "Established",
    value: "[Year pending approval]",
    status: "pending",
    note: "Draft content says 2014; the existing public About page says 2017. Confirm, and whether these are operating-commencement vs incorporation dates.",
  },
  { label: "Headquarters", value: "Karnal, Haryana", status: "pending", note: "As stated on the existing public website — confirm before publishing." },
  { label: "Legal name", value: "[Legal company name]", status: "pending" },
  { label: "Team strength", value: "[Verified team size]", status: "pending" },
  { label: "Offices", value: "[Verified office locations]", status: "pending" },
];
