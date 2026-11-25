import type { Heading } from "../types";

/** /resources — FAQ questions/answers live in `faqs` in ../capabilities.ts. */
export const resourcesPage = {
  meta: { title: "FAQs & Resources", description: "Frequently asked questions about Adidev services, project process, enquiries and approved downloads." },
  hero: { eyebrow: "FAQs & resources", title: "Answers and", accent: "approved downloads." } satisfies Heading,
  faqHeading: { eyebrow: "Frequently asked questions", title: "Before you enquire." } satisfies Heading,
  downloadsTitle: "Downloads",
  /** Add a file to /public/downloads/ and list it here once it is approved and current. */
  downloads: [] as { title: string; href: string; meta: string }[],
};
