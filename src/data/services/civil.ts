import type { ServiceConfig } from "./types";

export const civil: ServiceConfig = {
  key: "civil",
  slug: "civil-construction-infrastructure",
  serviceNumber: "03",
  title: "Civil Construction & Infrastructure",
  headline: ["Building Strong Foundations", "for Every Project."],
  description:
    "Delivering civil and structural solutions for industrial, commercial and infrastructure development, from site preparation and foundations to large-scale structural execution.",
  metaDescription:
    "Civil and structural construction: site development, excavation and earthwork, RCC foundations and frames, industrial sheds and warehouses, PEB-related civil works, roads, drainage, boundary works, renovation and waterproofing.",
  heroImage: { src: "/images/posters/stage-3.jpg", alt: "Multi-storey structure under construction with tower crane and site plant — illustrative visualisation", position: "45% 55%" },
  overview: {
    title: ["Structure first.", "Everything else follows."],
    body: [
      "Every other discipline depends on the civil works beneath it. Our civil division delivers that base for industrial, commercial and infrastructure projects — from the first excavation to the finished structure and the external works around it.",
      "Industrial sheds, warehouses and PEB-related civil works sit at the centre of the scope, alongside RCC frames, commercial buildings, site development and the renovation of operating facilities.",
    ],
    scopeNote:
      "Structural steel and PEB packages are supported through civil works and fabrication support. Structural design is coordinated with the project's consultants.",
  },
  capabilities: {
    intro: "Fourteen capability areas, from groundwork to facility improvements. Scope is confirmed per project.",
    groups: [
      {
        title: "Site & groundwork",
        intro: "Preparing and shaping the site.",
        items: [
          { number: "01", title: "Site Development & Preparation" },
          { number: "02", title: "Excavation & Earthwork" },
          { number: "03", title: "Levelling, Grading & Backfilling" },
        ],
      },
      {
        title: "RCC structure",
        intro: "Foundations and the reinforced concrete frame.",
        items: [
          { number: "04", title: "RCC Foundations" },
          { number: "05", title: "Pedestals, Columns, Beams & Slabs" },
        ],
      },
      {
        title: "Industrial & building works",
        intro: "Sheds, warehouses, steel and buildings.",
        items: [
          { number: "06", title: "Industrial Sheds & Warehouse Construction" },
          { number: "07", title: "PEB-Related Civil Works" },
          { number: "08", title: "Structural Steel & Fabrication Support" },
          { number: "09", title: "Commercial & Industrial Buildings" },
        ],
      },
      {
        title: "External development",
        intro: "Everything around the building.",
        items: [
          { number: "10", title: "Roads & Paving" },
          { number: "11", title: "Drainage & External Development" },
          { number: "12", title: "Boundary Works" },
        ],
      },
      {
        title: "Renovation & improvement",
        intro: "Keeping existing facilities in service.",
        items: [
          { number: "13", title: "Renovation & Repair" },
          { number: "14", title: "Waterproofing & Facility Improvements" },
        ],
      },
    ],
  },
  feature: {
    kind: "civil-anatomy",
    navLabel: "Industrial works",
    eyebrow: "Industrial buildings & warehouses",
    title: ["Anatomy of an", "industrial shed."],
    intro: "The civil and structural scope behind a typical shed or warehouse. Select a point to see the capability it relates to.",
    image: { src: "/images/verticals/civil.jpg", alt: "Steel-framed industrial shed on RCC pedestals with starter bars — illustrative visualisation" },
    callouts: [
      { label: "Site preparation & levelling", copy: "Site development, excavation, earthwork, levelling and grading for the building platform.", covers: ["01", "02", "03"], at: [45, 84] },
      { label: "RCC foundations & pedestals", copy: "RCC foundations and pedestals, with reinforcement set for the columns above.", covers: ["04", "05"], at: [67, 90] },
      { label: "Structural steel", copy: "Structural steel and fabrication support for the frame.", covers: ["08"], at: [73.5, 60] },
      { label: "Shed & PEB works", copy: "Industrial shed and warehouse construction, and PEB-related civil works.", covers: ["06", "07"], at: [52, 40] },
    ],
  },
  process: {
    intro: "A structural sequence with inspection built in before handover.",
    steps: [
      { title: "Requirement study", copy: "Scope, site conditions and the client's requirements." },
      { title: "Drawings & BOQ", copy: "Drawing coordination, quantities and estimates." },
      { title: "Site preparation", copy: "Site development, excavation, levelling and grading." },
      { title: "Execution", copy: "Foundations, structure and building works under supervision." },
      { title: "Quality inspection", copy: "Material checks, workmanship inspection and stage-wise checks." },
      { title: "Handover", copy: "Snag closure and handover documents." },
    ],
  },
  projectCategories: ["civil", "industrial", "renovation"],
  referenceSlots: ["Civil / industrial construction", "RCC / foundations", "Industrial shed / warehouse"],
  relatedCapabilities: ["01", "02", "05"],
  qualityChecks: ["Approved drawings and BOQ", "Material verification", "Workmanship inspection", "Stage-wise checks"],
  enquiry: {
    title: "Plan Your Next Infrastructure Project.",
    copy: "Share your drawings, BOQ or a short brief — an industrial shed, a structure, or the external works around it.",
  },
  layout: [
    { section: "overview", surface: "white" },
    { section: "feature", surface: "brand" },
    { section: "capabilities", surface: "ivory" },
    { section: "process", surface: "white" },
    { section: "projects", surface: "ivory" },
    { section: "support", surface: "white" },
  ],
  verificationStatus: "provisional",
};
