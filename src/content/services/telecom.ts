import type { ServiceConfig } from "./types";

export const telecom: ServiceConfig = {
  key: "telecom",
  slug: "telecom-infrastructure",
  serviceNumber: "01",
  title: "Telecom Infrastructure",
  headline: ["Connecting Infrastructure.", "Enabling Communication."],
  description:
    "Delivering telecom site development, tower-related civil and structural works, fibre infrastructure, equipment coordination and associated power systems.",
  metaDescription:
    "Telecom site development, tower foundation and erection support, fibre optic trenching and duct works, equipment installation coordination, telecom power systems, testing and maintenance.",
  heroImage: { src: "/images/verticals/telecom.jpg", alt: "Lattice telecom tower with antenna platforms — illustrative visualisation", position: "61% 30%", caption: "Illustrative visualisation" },
  overview: {
    title: ["The physical layer", "of the network."],
    body: [
      "Our telecom work covers what has to exist on the ground before a network can carry traffic: a prepared site, a founded and erected tower, a fibre route, and the power systems that keep equipment running.",
      "Work can be taken up as an individual package — a foundation, a fibre route, a power installation — or coordinated across a site from civil readiness to handover.",
    ],
    scopeNote:
      "Telecom equipment, in-building systems and power equipment are installed and integrated in coordination with the client and its suppliers. Adidev does not manufacture or supply network equipment.",
  },
  capabilities: {
    intro: "Nine capability areas, from site readiness to maintenance. Scope is confirmed per project.",
    groups: [
      {
        title: "Site & structure",
        intro: "Getting the site ready and the tower standing.",
        items: [
          { number: "01", title: "Telecom Site Development & Preparation", copy: "Site development and readiness for telecommunications infrastructure." },
          { number: "02", title: "Tower Foundation & Erection Support", copy: "Civil foundations and associated structural preparation for tower installations." },
          { number: "03", title: "Tower Installation & Upgradation", copy: "Tower erection, installation, upgrades and allied infrastructure works." },
        ],
      },
      {
        title: "Network & equipment",
        intro: "The fibre route and the equipment it serves.",
        items: [
          { number: "04", title: "Fibre Optic Infrastructure", copy: "Fibre optic cable laying, trenching and duct works." },
          { number: "05", title: "Telecom Equipment Installation", copy: "Telecom equipment installation and integration coordination." },
          { number: "06", title: "IBS / In-Building Telecom Support", copy: "In-building telecom solutions where applicable." },
        ],
      },
      {
        title: "Power & upkeep",
        intro: "Keeping sites powered, tested and maintained.",
        items: [
          { number: "07", title: "Telecom Power Infrastructure", copy: "DG, AC, battery bank, inverter and SMPS installation support." },
          { number: "08", title: "Electrical Infrastructure", copy: "Associated electrical and power infrastructure." },
          { number: "09", title: "Testing, Commissioning & Maintenance", copy: "Testing, commissioning, preventive and corrective maintenance." },
        ],
      },
    ],
  },
  feature: {
    kind: "telecom-site",
    navLabel: "Site scope",
    eyebrow: "Technical scope",
    title: ["One site,", "every layer."],
    intro: "Where each part of our scope sits on a typical tower site. Select a point to see the capability it relates to.",
    callouts: [
      { label: "Site preparation", copy: "Site development and readiness for the tower, shelter and access.", covers: ["01"], at: [21, 78] },
      { label: "Tower foundation", copy: "Civil foundations and structural preparation below the tower legs.", covers: ["02"], at: [38, 90] },
      { label: "Tower erection & upgrades", copy: "Erection, installation, upgrades and allied works on the structure.", covers: ["03"], at: [44, 44] },
      { label: "Antenna & equipment", copy: "Equipment installation and integration coordination.", covers: ["05"], at: [44, 14] },
      { label: "In-building support", copy: "In-building telecom support, where applicable.", covers: ["06"], at: [10, 44] },
      { label: "Power systems", copy: "DG, AC, battery bank, inverter and SMPS installation support.", covers: ["07"], at: [64, 62] },
      { label: "Electrical infrastructure", copy: "The electrical and power infrastructure connecting the site.", covers: ["08"], at: [80, 56] },
      { label: "Fibre & duct route", copy: "Fibre optic cable laying, trenching and duct works.", covers: ["04"], at: [86, 90] },
    ],
  },
  process: {
    intro: "Each site moves through six stages, from assessment to a documented handover.",
    steps: [
      { title: "Site assessment", copy: "Site conditions, access and the scope to be delivered." },
      { title: "Civil readiness", copy: "Site development, foundations and civil works ready for installation." },
      { title: "Installation", copy: "Tower, fibre, equipment and power systems installed as scoped." },
      { title: "Integration", copy: "Equipment integration coordinated with the client and its suppliers." },
      { title: "Testing", copy: "Testing and commissioning of the installed systems." },
      { title: "Handover", copy: "Documented handover, with preventive and corrective maintenance where required." },
    ],
  },
  projectCategories: ["telecom"],
  referenceSlots: ["Telecom tower / site execution", "Fibre / trenching", "Power / equipment"],
  relatedCapabilities: ["03", "05", "06"],
  qualityChecks: ["Stage-wise checks", "Workmanship inspection", "Testing records"],
  enquiry: {
    title: "Discuss Your Telecom Infrastructure Project.",
    copy: "Share the site locations, scope and any drawings — from a single foundation to a full site rollout.",
  },
  layout: [
    { section: "overview", surface: "white" },
    { section: "capabilities", surface: "ivory" },
    { section: "feature", surface: "white" },
    { section: "process", surface: "brand" },
    { section: "projects", surface: "white" },
    { section: "support", surface: "ivory" },
  ],
  verificationStatus: "provisional",
};
