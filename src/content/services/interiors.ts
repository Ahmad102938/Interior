import type { ServiceConfig } from "./types";

export const interiors: ServiceConfig = {
  key: "interiors",
  slug: "commercial-interior-fit-out",
  serviceNumber: "04",
  title: "Commercial Interior & Fit-Out",
  headline: ["Creating Spaces", "for Better Business."],
  description:
    "Transforming commercial environments through space planning, design coordination, technical integration, finishing and fit-out execution.",
  metaDescription:
    "Commercial interior and fit-out for offices, retail and showrooms: space planning, working drawings, 3D visualisation where available, BOQ and procurement coordination, MEP coordination, finishes, furniture and final handover.",
  heroImage: { src: "/images/projects/intrer.png", alt: "Open-plan commercial floor with a glazed meeting room — illustrative visualisation", position: "60% 50%", caption: "Illustrative visualisation" },
  overview: {
    title: ["Workplaces, retail", "and showrooms."],
    body: [
      "Our interiors division delivers commercial space — offices, retail and showrooms — not residential decoration. The work starts with how a business uses its space and ends with a finished, coordinated and documented handover.",
      "Design, drawings, costing, procurement, building services coordination and finishing are managed as one sequence, so decisions made on paper carry through to site.",
    ],
    scopeNote:
      "Electrical, lighting, HVAC, plumbing, fire and low-voltage systems are coordinated across the specialist trades. 3D visualisation is offered where available.",
  },
  capabilities: {
    intro: "Nineteen capability areas, from the first brief to final handover. Scope is confirmed per project.",
    groups: [
      {
        title: "Brief & planning",
        intro: "Understanding the space and how it will be used.",
        items: [
          { number: "01", title: "Requirement Study" },
          { number: "02", title: "Site Measurement" },
          { number: "03", title: "Functional Zoning" },
          { number: "04", title: "Space Planning & Design Coordination" },
        ],
      },
      {
        title: "Drawings & visualisation",
        intro: "Turning the plan into buildable information.",
        items: [
          { number: "05", title: "2D Layouts" },
          { number: "06", title: "Working Drawings & Detailing" },
          { number: "07", title: "3D Visualisation, Where Available" },
        ],
      },
      {
        title: "Cost & procurement",
        intro: "Quantities, costs and materials agreed before work starts.",
        items: [
          { number: "08", title: "BOQ & Cost Estimation" },
          { number: "09", title: "Procurement Coordination" },
        ],
      },
      {
        title: "Civil & finishing works",
        intro: "The fabric of the space.",
        items: [
          { number: "10", title: "Masonry & Plastering" },
          { number: "11", title: "Flooring, Tiling & Skirting" },
          { number: "12", title: "False Ceiling & Partitions" },
          { number: "13", title: "Painting & Wall Finishes" },
        ],
      },
      {
        title: "MEP coordination",
        intro: "Building services, coordinated across the trades.",
        items: [
          { number: "14", title: "Electrical & Lighting Coordination" },
          { number: "15", title: "HVAC & Plumbing Coordination" },
          { number: "16", title: "Fire & Low-Voltage Systems Coordination" },
        ],
      },
      {
        title: "Fit-out & handover",
        intro: "Furnishing, completing and closing out.",
        items: [
          { number: "17", title: "Furniture, Fixtures & Cabinetry" },
          { number: "18", title: "Office, Retail & Showroom Fit-Outs" },
          { number: "19", title: "Renovation, Snagging & Final Handover" },
        ],
      },
    ],
  },
  feature: {
    kind: "interior-journey",
    navLabel: "Design to handover",
    eyebrow: "Design to completion",
    title: ["From a brief", "to a working space."],
    intro: "How a commercial interior moves from requirement to handover — and which of our capabilities carries each step.",
    steps: [
      {
        title: "Plan the space",
        copy: "Requirement study, site measurement and functional zoning become a space plan and 2D layouts.",
        covers: ["01", "02", "03", "04", "05"],
        image: { src: "/images/posters/stage-0.jpg", alt: "Drafted floor layout on a technical grid — illustrative visualisation", position: "62% 45%", caption: "Illustrative visualisation" },
      },
      {
        title: "Detail and visualise",
        copy: "Working drawings and detailing, with 3D visualisation where available.",
        covers: ["06", "07"],
        image: { src: "/images/posters/stage-2.jpg", alt: "Layered 3D model of floor plates and building services — illustrative visualisation", position: "50% 50%", caption: "Illustrative visualisation" },
      },
      {
        title: "Cost and procure",
        copy: "BOQ and cost estimation, then procurement coordination for materials and finishes.",
        covers: ["08", "09"],
      },
      {
        title: "Build and coordinate",
        copy: "Masonry, flooring, ceilings, partitions and finishes, with electrical, lighting, HVAC, plumbing, fire and low-voltage systems coordinated.",
        covers: ["10", "11", "12", "13", "14", "15", "16"],
        image: { src: "/images/projects/intrer.png", alt: "Workplace with feature lighting, workstations and planters — illustrative visualisation", position: "50% 55%", caption: "Illustrative visualisation" },
      },
      {
        title: "Fit out and hand over",
        copy: "Furniture, fixtures and cabinetry, then snagging and final handover.",
        covers: ["17", "18", "19"],
      },
    ],
  },
  process: {
    intro: "Six stages, from the client's brief to a snag-free handover.",
    steps: [
      { title: "Client brief", copy: "Requirements, site measurement and how the space will be used." },
      { title: "Space planning", copy: "Functional zoning and space planning." },
      { title: "Design & drawings", copy: "2D layouts, working drawings and detailing." },
      { title: "BOQ & procurement", copy: "Quantities, cost estimation and procurement coordination." },
      { title: "Execution", copy: "Civil, finishing and fit-out works with MEP coordination." },
      { title: "Snagging & handover", copy: "Snag closure and final handover." },
    ],
  },
  projectCategories: ["interiors"],
  referenceSlots: ["Completed commercial interior", "Office / retail", "Site execution"],
  relatedCapabilities: ["01", "02", "04"],
  qualityChecks: ["Approved drawings and BOQ", "Material verification", "Workmanship inspection", "Defect / snag closure"],
  enquiry: {
    title: "Discuss Your Commercial Fit-Out.",
    copy: "Tell us about the space, its area and how it will be used — office, retail or showroom.",
  },
  layout: [
    { section: "overview", surface: "ivory" },
    { section: "feature", surface: "white" },
    { section: "capabilities", surface: "ivory" },
    { section: "process", surface: "brand" },
    { section: "projects", surface: "white" },
    { section: "support", surface: "ivory" },
  ],
  verificationStatus: "provisional",
};
