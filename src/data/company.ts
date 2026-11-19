import type { Fact, Status } from "@/lib/content";

export const company = {
  name: "ADIDEV",
  legalName: { value: "[Legal company name]", status: "pending" } as Fact<string>,
  positioning: "Integrated Engineering & Infrastructure Solutions",
  tagline: ["Building Infrastructure.", "Empowering Progress."] as const,
  heroIntro:
    "Delivering integrated engineering, infrastructure and project execution solutions across telecommunications, renewable energy, civil construction and commercial environments.",
  overview:
    "Adidev supports the development, execution and maintenance of projects across telecom, renewable energy, civil construction and commercial fit-outs.",
  howWeWork:
    "We understand requirements, coordinate technical resources, manage execution and deliver against approved drawings, specifications and agreed timelines.",
  vision:
    "To become a trusted engineering and infrastructure partner recognised for dependable project delivery and long-term value.",
  mission:
    "To provide integrated, quality-focused project solutions through responsible execution, technical coordination and client collaboration.",
  values: ["Quality", "Safety", "Integrity", "Innovation", "Commitment", "Collaboration"],
  website: "www.adidev.co.in",
  siteUrl: "https://www.adidev.co.in",

  /**
   * IMPORTANT: the draft content says 2014; the current public About page says 2017.
   * Management must confirm before anything date-related is published.
   */
  established: {
    value: "[Year pending approval]",
    status: "pending",
    note: "Draft content says 2014, existing public About page says 2017. Do not publish until confirmed.",
  } as Fact<string>,
};

export type Metric = {
  id: string;
  value: string;
  label: string;
  detail: string;
  status: Status;
  note?: string;
};

/** Company scale metrics. All pending until management verifies the figures. */
export const metrics: Metric[] = [
  {
    id: "experience",
    value: "[00]",
    label: "Years of operation",
    detail: "Calculated from the confirmed establishment year.",
    status: "pending",
    note: "Depends on the 2014 vs 2017 establishment date conflict.",
  },
  {
    id: "states",
    value: "[00]",
    label: "States with project presence",
    detail: "Operational footprint across Indian states.",
    status: "pending",
    note: "Figma draft shows 18 States — unverified.",
  },
  {
    id: "sites",
    value: "[0,000+]",
    label: "Telecom sites supported",
    detail: "Site development, installation and allied works.",
    status: "pending",
    note: "Figma draft shows 1,000+ LTE — unverified.",
  },
  {
    id: "team",
    value: "[000+]",
    label: "Engineers & site professionals",
    detail: "Project management, engineering and site supervision.",
    status: "pending",
  },
];

export type ContactFact = { label: string; value: string; href?: string; status: Status };

export const contact: {
  office: ContactFact;
  phone: ContactFact;
  email: ContactFact;
  website: ContactFact;
  regional: ContactFact;
  social: { label: string; href: string; status: Status }[];
} = {
  office: { label: "Corporate office", value: "[Verified address]", status: "pending" },
  phone: { label: "Official phone", value: "[Number]", status: "pending" },
  email: { label: "Business email", value: "[Email]", status: "pending" },
  website: { label: "Website", value: "www.adidev.co.in", href: "https://www.adidev.co.in", status: "verified" },
  regional: { label: "Regional offices", value: "[Verified office addresses]", status: "pending" },
  social: [
    { label: "LinkedIn", href: "#", status: "pending" },
    { label: "Instagram", href: "#", status: "pending" },
    { label: "Facebook", href: "#", status: "pending" },
    { label: "YouTube", href: "#", status: "pending" },
  ],
};
