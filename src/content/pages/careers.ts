import type { Heading } from "../types";

/** /careers */
export const careersPage = {
  meta: { title: "Careers", description: "Engineering, project, site, design and support roles at Adidev." },
  hero: {
    eyebrow: "Careers",
    title: "Build infrastructure",
    accent: "with us.",
    intro: "We welcome engineers, site professionals and coordinators who take pride in careful, safe execution.",
  } satisfies Heading,
  areas: [
    { title: "Engineering opportunities", copy: "Civil, electrical, telecom, solar, and technical coordination roles." },
    { title: "Project & site roles", copy: "Project management, site execution, supervision, and quality." },
    { title: "Design & support roles", copy: "Design coordination, procurement, business development, and administration." },
  ],
  /** Publish current openings only. Empty until HR supplies live roles. */
  openings: [] as { role: string; location: string; department: string }[],
  /** `{count}` is replaced with the number of openings. */
  openingsText: "{count} current openings.",
  noOpeningsText: "There are no published openings right now. Send your details using the form — “Careers” is already selected, and you can attach your resume in step 2.",
};
