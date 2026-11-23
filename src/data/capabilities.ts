import type { Status } from "@/lib/content";
import type { CapabilityGroupKey } from "./capabilityGroups";

export type Capability = {
  number: string;
  title: string;
  /** Presentation grouping only — the six names follow slide 12 exactly. */
  group: CapabilityGroupKey;
  /** Short editorial statement. */
  summary: string;
  description: string;
  /** Supporting activities, as listed on slide 12. */
  items: string[];
};

/** The six engineering & project capabilities (client presentation, slide 12). */
export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Engineering & Design Coordination",
    group: "pre-construction",
    summary: "Translating requirements into coordinated technical direction.",
    description: "ADIDEV supports the technical definition of projects through requirement study, drawing coordination, consultant interaction and technical documentation.",
    items: ["Requirement study", "Architectural / technical drawing coordination", "Consultant coordination", "Technical documentation"],
  },
  {
    number: "02",
    title: "BOQ & Cost Management",
    group: "pre-construction",
    summary: "Bringing clarity to scope, quantities and cost.",
    description: "Supporting project definition and commercial understanding through quantity assessment, BOQ preparation, estimation and quotation comparison.",
    items: ["Quantity take-off", "BOQ preparation", "Cost estimation", "Quotation comparison", "Scope clarification"],
  },
  {
    number: "03",
    title: "Project Planning",
    group: "pre-construction",
    summary: "Structuring project requirements into a workable plan.",
    description: "Coordinating schedules, resources, site readiness and progress information to support organised project delivery.",
    items: ["Project scheduling", "Resource planning", "Site readiness", "Progress tracking", "Reporting"],
  },
  {
    number: "04",
    title: "Procurement & Vendors",
    group: "field-execution",
    summary: "Coordinating resources for effective project execution.",
    description: "Supporting project readiness through material planning, vendor identification, commercial comparisons, procurement coordination and delivery monitoring.",
    items: ["Material planning", "Vendor identification", "Commercial comparison", "Procurement coordination", "Delivery monitoring"],
  },
  {
    number: "05",
    title: "Site Execution",
    group: "field-execution",
    summary: "Turning project plans into on-ground progress.",
    description: "Supporting the execution phase through mobilisation, manpower coordination, civil and structural work, installation, finishing and site supervision.",
    items: ["Mobilisation", "Manpower coordination", "Civil / structural work", "Installation", "Finishing", "Site supervision"],
  },
  {
    number: "06",
    title: "Quality & Handover",
    group: "quality-completion",
    summary: "Bringing execution together through inspection and handover.",
    description: "Supporting project completion through material verification, workmanship inspection, stage-wise checks, snag closure, testing coordination and handover documentation.",
    items: ["Material checks", "Workmanship inspection", "Stage-wise checks", "Snag closure", "Testing coordination", "Handover documents"],
  },
];

/**
 * How the six capabilities connect, from requirement to handover (Integrated
 * delivery diagram). `output` restates each capability's activities — it is
 * a relationship between functions, not the five-stage methodology below.
 */
export const deliveryFlow: { number?: string; label: string; output: string }[] = [
  { label: "Requirements", output: "Client brief, site conditions and scope" },
  { number: "01", label: "Engineering & Design", output: "Coordinated drawings and documentation" },
  { number: "02", label: "BOQ & Cost", output: "Quantities, estimates and comparisons" },
  { number: "03", label: "Project Planning", output: "Schedule, resources and site readiness" },
  { number: "04", label: "Procurement & Mobilisation", output: "Materials, vendors and deliveries" },
  { number: "05", label: "Site Execution", output: "Supervised work on site" },
  { number: "06", label: "Quality & Handover", output: "Inspected, documented handover" },
];

/** Five-stage execution methodology, worded as on slide 13. */
export const executionStages = [
  { number: "01", title: "Understand", copy: "Client brief, objectives, site conditions, scope and constraints." },
  { number: "02", title: "Plan", copy: "Drawings, BOQ, estimates, resources, schedule and technical coordination." },
  { number: "03", title: "Mobilise", copy: "Approvals, procurement, vendors, manpower, equipment and site readiness." },
  { number: "04", title: "Execute", copy: "Site coordination, progress monitoring, quality checks and safe work practices." },
  { number: "05", title: "Inspect & Handover", copy: "Inspections, testing where applicable, snag closure, documents and handover." },
];

export const whyAdidev = [
  { title: "Integrated capabilities", copy: "Multiple engineering and execution capabilities under one organisation." },
  { title: "Coordinated delivery", copy: "Planning, technical coordination, procurement, and site execution support." },
  { title: "Practical site approach", copy: "Solutions aligned with actual site conditions and project requirements." },
  { title: "Flexible project support", copy: "Support for individual work packages and broader project requirements." },
  { title: "Resource coordination", copy: "Coordination of materials, vendors, manpower, and execution resources." },
  { title: "Quality-focused working", copy: "Attention to specifications, workmanship, safety, and handover." },
];

export const quality = {
  qa: {
    title: "Quality assurance",
    items: ["Approved drawings and BOQ", "Material verification", "Workmanship inspection", "Stage-wise checks", "Defect / snag closure", "Testing records"],
  },
  hse: {
    title: "Health & safety",
    items: ["Site induction & toolbox talks", "PPE", "Risk identification", "Safe handling", "Housekeeping", "Incident reporting and corrective actions"],
  },
  sustainability: {
    title: "Environmental responsibility",
    items: ["Responsible material use", "Waste management", "Resource efficiency", "Renewable energy support", "Responsible site practices"],
  },
  governance: {
    title: "Governance & compliance",
    items: ["Documented approvals", "Compliance documentation", "Transparent reporting", "Handover records"],
  },
};

export type Certification = { name: string; issuer: string; scope: string; validity: string; status: Status };

/** Only add certifications whose validity and scope have been verified. */
export const certifications: Certification[] = [
  { name: "[Certification / registration]", issuer: "[Issuer]", scope: "[Scope]", validity: "[Valid until]", status: "pending" },
  { name: "[Licence]", issuer: "[Issuer]", scope: "[Scope]", validity: "[Valid until]", status: "pending" },
];

export const teamFunctions = [
  { title: "Project management", copy: "Planning, scheduling, coordination, and reporting." },
  { title: "Engineering & technical", copy: "Drawings, technical coordination, and documentation." },
  { title: "Design & architecture", copy: "Space planning, design development, and detailing." },
  { title: "Procurement & vendors", copy: "Material planning, sourcing, and commercial coordination." },
  { title: "Site supervision & quality", copy: "Site execution, inspections, and quality checks." },
  { title: "Business development", copy: "Client coordination, proposals, and enquiries." },
];

export const leadership: { name: string; designation: string; bio: string; status: Status }[] = [
  { name: "[Approved Name]", designation: "[Designation]", bio: "[Approved biography]", status: "pending" },
];

export type ResourceModel = "Owned" | "Leased" | "Hired" | "Partner-provided" | "[To confirm]";

export const equipment: { title: string; copy: string; model: ResourceModel; status: Status }[] = [
  { title: "Construction equipment", copy: "Excavators, lifting equipment, access systems and other machinery, where available.", model: "[To confirm]", status: "pending" },
  { title: "Installation tools", copy: "Trade-specific tools and equipment for site installation and fit-out works.", model: "[To confirm]", status: "pending" },
  { title: "Testing instruments", copy: "Electrical and other testing instruments relevant to the approved work scope.", model: "[To confirm]", status: "pending" },
  { title: "Survey resources", copy: "Survey and measurement equipment for site assessment and setting out.", model: "[To confirm]", status: "pending" },
];

export const clientLogos: { name: string; logo?: string; status: Status }[] = Array.from({ length: 8 }, (_, i) => ({
  name: `[Approved client ${i + 1}]`,
  status: "pending" as Status,
}));

export const testimonials: { quote: string; author: string; role: string; status: Status }[] = [];

export const faqs = [
  { q: "Which services does Adidev cover?", a: "Telecom infrastructure, solar & renewable energy, civil construction & infrastructure, and commercial interior & fit-out — from individual work packages to broader project requirements." },
  { q: "How does a project move from enquiry to handover?", a: "Through five stages: understand, plan, mobilise, execute, and inspect & handover. Each stage is documented and coordinated with the client." },
  { q: "Which locations do you work in?", a: "Service coverage is confirmed per project. Share the project location in your enquiry and our team will respond." },
  { q: "What documents should I include with an enquiry?", a: "Drawings, BOQ, specifications or a brief scope description help us respond accurately. PDF, DOC/DOCX, XLS/XLSX, DWG, JPG and PNG files up to 10 MB are accepted." },
  { q: "What happens after I submit an enquiry?", a: "Our team will review your enquiry and contact you regarding the project requirements." },
];
