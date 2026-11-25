import type { Heading } from "../types";

/** /clients-partners — body comes from the homepage clients section (home.ts → clients). */
export const clientsPage = {
  meta: { title: "Clients & Partners", description: "Approved client and partner relationships, genuine testimonials and project references." },
  hero: {
    eyebrow: "Clients & partners",
    title: "Relationships built",
    accent: "on delivery.",
    intro: "Client names, logos and testimonials are shown only with permission.",
  } satisfies Heading,
};
