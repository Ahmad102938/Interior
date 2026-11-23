import type { ServiceConfig } from "./types";

export const solar: ServiceConfig = {
  key: "solar",
  slug: "solar-renewable-energy",
  serviceNumber: "02",
  title: "Solar & Renewable Energy",
  headline: ["Powering Progress", "Through Clean Energy."],
  description:
    "Supporting renewable energy infrastructure through site development, civil works, solar mounting structures, module installation and associated electrical execution.",
  metaDescription:
    "Solar project execution support: site clearing and grading, piling and foundations, module mounting structure and PV module installation, DC and AC electrical works, testing, commissioning and O&M support.",
  heroImage: { src: "/images/verticals/solar.jpg", alt: "Rows of ground-mounted solar arrays on a graded site — illustrative visualisation", position: "50% 62%" },
  overview: {
    title: ["From prepared ground", "to installed array."],
    body: [
      "Solar projects are won or lost on the ground: clearing and grading, piles set to line and level, structures erected true, then modules and cabling installed to the design.",
      "We support execution across that sequence — civil works, structures, modules and associated electrical works — as complete scopes or as individual packages within a larger project.",
    ],
    scopeNote:
      "Adidev is an execution partner, not a manufacturer. Modules, inverters and mounting structures are installed and coordinated to the client's design and specification.",
  },
  capabilities: {
    intro: "Thirteen service activities across civil, structural and electrical execution. Scope is confirmed per project.",
    groups: [
      {
        title: "Site & civil works",
        intro: "Preparing the ground and the foundations the array stands on.",
        items: [
          { number: "01", title: "Solar Project Execution Support" },
          { number: "02", title: "Site Clearing & Preparation" },
          { number: "03", title: "Levelling & Grading" },
          { number: "04", title: "Piling & Foundations" },
          { number: "05", title: "RCC & Allied Civil Works" },
        ],
      },
      {
        title: "Structures & modules",
        intro: "Erecting the mounting structures and installing the modules.",
        items: [
          { number: "06", title: "Module Mounting Structure Installation" },
          { number: "07", title: "Solar PV Module Installation" },
        ],
      },
      {
        title: "Electrical works",
        intro: "Connecting the array on both sides of the inverter.",
        items: [
          { number: "08", title: "DC-Side Installation Support" },
          { number: "09", title: "AC-Side Electrical Works" },
          { number: "10", title: "Inverter Installation Coordination" },
        ],
      },
      {
        title: "Commissioning & support",
        intro: "Testing, ongoing support and site rectification.",
        items: [
          { number: "11", title: "Testing & Commissioning" },
          { number: "12", title: "Operations & Maintenance Support" },
          { number: "13", title: "Rectification & Associated Site Works" },
        ],
      },
    ],
  },
  feature: {
    kind: "solar-array",
    navLabel: "Array build-up",
    eyebrow: "Technical scope",
    title: ["How an array", "is built up."],
    intro: "A cross-section of a ground-mounted array, from graded ground to the AC side. Select a layer to see the activities involved.",
    callouts: [
      { label: "Clearing & grading", copy: "Site clearing, preparation, levelling and grading.", covers: ["02", "03"], at: [9, 81] },
      { label: "Piling & foundations", copy: "Piling, foundations, RCC and allied civil works.", covers: ["04", "05"], at: [18, 89] },
      { label: "Mounting structure", copy: "Module Mounting Structure (MMS) installation.", covers: ["06"], at: [38, 56] },
      { label: "PV modules", copy: "Solar PV module installation.", covers: ["07"], at: [24, 40] },
      { label: "DC side", copy: "DC-side installation support.", covers: ["08"], at: [56, 58] },
      { label: "Inverter", copy: "Inverter installation coordination.", covers: ["10"], at: [70, 48] },
      { label: "AC side", copy: "AC-side electrical works.", covers: ["09"], at: [88, 62] },
    ],
  },
  process: {
    intro: "Six stages, in the order the work is built on site.",
    steps: [
      { title: "Site preparation", copy: "Clearing, preparation, levelling and grading." },
      { title: "Foundations", copy: "Piling, foundations and allied civil works." },
      { title: "MMS installation", copy: "Module mounting structures erected to the layout." },
      { title: "Module installation", copy: "PV modules installed on the structures." },
      { title: "Electrical works", copy: "DC-side support, AC-side works and inverter coordination." },
      { title: "Testing & handover", copy: "Testing and commissioning, then handover and O&M support where required." },
    ],
  },
  projectCategories: ["solar"],
  referenceSlots: ["Solar farm / rooftop installation", "MMS / foundations", "PV modules / electrical"],
  relatedCapabilities: ["03", "04", "06"],
  qualityChecks: ["Material verification", "Stage-wise checks", "Testing records"],
  enquiry: {
    title: "Discuss Your Renewable Energy Project.",
    copy: "Share the site location, layout and scope — complete execution or individual civil, structural or electrical packages.",
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
