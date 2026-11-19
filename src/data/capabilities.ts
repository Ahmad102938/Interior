import type { Status } from "@/lib/content";

export type Capability = { number: string; title: string; summary: string; items: string[] };

export const capabilities: Capability[] = [
  {
    number: "01",
    title: "Engineering Design & Coordination",
    summary: "Translating requirements into coordinated technical direction.",
    items: ["Requirement study", "Architectural / technical drawing coordination", "Consultant coordination", "Technical documentation"],
  },
  {
    number: "02",
    title: "BOQ & Cost Management",
    summary: "Clear quantities and costs before work begins.",
    items: ["Quantity take-off", "BOQ preparation", "Cost estimation", "Quotation comparison", "Scope clarification"],
  },
  {
    number: "03",
    title: "Project Planning",
    summary: "Schedules and resources aligned with site reality.",
    items: ["Project scheduling", "Resource planning", "Site readiness", "Progress tracking", "Reporting"],
  },
  {
    number: "04",
    title: "Procurement & Vendors",
    summary: "Materials and partners secured on time and on specification.",
    items: ["Material planning", "Vendor identification", "Commercial comparison", "Procurement coordination", "Delivery monitoring"],
  },
  {
    number: "05",
    title: "Quality & Site Safety",
    summary: "Supervised execution with stage-wise inspection.",
    items: ["Mobilisation & manpower coordination", "Site supervision", "Material checks", "Workmanship inspection", "Safe work practices"],
  },
  {
    number: "06",
    title: "Commissioning & Handover",
    summary: "Tested, documented and closed out properly.",
    items: ["Stage-wise checks", "Snag closure", "Testing coordination", "Handover documents"],
  },
];

export const executionStages = [
  { number: "01", title: "Understand", copy: "Client specifications, site requirements and scope." },
  { number: "02", title: "Plan", copy: "Drawings, BOQ, estimates, schedules and technical coordination." },
  { number: "03", title: "Mobilise", copy: "Resources, procurement, manpower, equipment and site readiness." },
  { number: "04", title: "Execute", copy: "Supervised construction, installation, progress tracking and quality checks." },
  { number: "05", title: "Handover", copy: "Testing, commissioning where applicable, snag closure and documentation." },
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

export const industries = [
  { title: "Telecom & Telecommunications", copy: "Network infrastructure, tower-related works, fibre, and associated power systems.", vertical: "telecom" },
  { title: "Renewable Energy", copy: "Solar project infrastructure, foundations, mounting structures, and installation support.", vertical: "solar" },
  { title: "Industrial & Manufacturing", copy: "Industrial buildings, sheds, structural works, facility improvements, and maintenance.", vertical: "civil" },
  { title: "Warehousing & Logistics", copy: "Warehouse facilities, industrial sheds, paving, drainage, and associated works.", vertical: "civil" },
  { title: "Commercial & Retail", copy: "Showrooms, retail spaces, offices, and customer-facing environments.", vertical: "interiors" },
  { title: "Infrastructure & Real Estate", copy: "Civil, structural, and site development packages, subject to project scope.", vertical: "civil" },
] as const;

export const faqs = [
  { q: "Which services does Adidev cover?", a: "Telecom infrastructure, solar & renewable energy, civil construction & infrastructure, and commercial interior & fit-out — from individual work packages to broader project requirements." },
  { q: "How does a project move from enquiry to handover?", a: "Through five stages: understand, plan, mobilise, execute, and inspect & handover. Each stage is documented and coordinated with the client." },
  { q: "Which locations do you work in?", a: "Service coverage is confirmed per project. Share the project location in your enquiry and our team will respond." },
  { q: "What documents should I include with an enquiry?", a: "Drawings, BOQ, specifications or a brief scope description help us respond accurately. PDF, DOC/DOCX, XLS/XLSX, DWG, JPG and PNG files up to 10 MB are accepted." },
  { q: "What happens after I submit an enquiry?", a: "Our team will review your enquiry and contact you regarding the project requirements." },
];
