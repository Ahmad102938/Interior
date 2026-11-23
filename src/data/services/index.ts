import { telecom } from "./telecom";
import { solar } from "./solar";
import { civil } from "./civil";
import { interiors } from "./interiors";

export type * from "./types";

/** Detailed service-page content. Summaries used elsewhere stay in verticals.ts. */
export const services = [telecom, solar, civil, interiors];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
