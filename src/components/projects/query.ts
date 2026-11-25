import { inCategory, locationLabel, projectCategories, type Project, type ProjectCategory } from "@/content/projects";

/** Listing state, mirrored in the URL: /projects?category=solar&status=completed&page=2 */
export type Query = {
  category?: ProjectCategory;
  status?: Project["projectStatus"];
  location?: string;
  q?: string;
  page: number;
};

export const PAGE_SIZE = 9;
/** Where the last listing URL is kept, so case studies can link back to it. */
export const LISTING_KEY = "adidev:projects-listing";

const statuses: Project["projectStatus"][] = ["completed", "ongoing"];

export function parseQuery(sp: URLSearchParams): Query {
  const category = projectCategories.find((c) => c.key === sp.get("category"))?.key;
  const status = statuses.find((s) => s === sp.get("status"));
  const page = Math.max(1, Math.min(50, Number(sp.get("page")) || 1));
  return { category, status, location: sp.get("location") || undefined, q: sp.get("q")?.trim() || undefined, page };
}

export function toSearch(q: Query) {
  const sp = new URLSearchParams();
  if (q.category) sp.set("category", q.category);
  if (q.status) sp.set("status", q.status);
  if (q.location) sp.set("location", q.location);
  if (q.q) sp.set("q", q.q);
  if (q.page > 1) sp.set("page", String(q.page));
  const s = sp.toString();
  return s ? `?${s}` : "";
}

/** Applies every filter except the ones named in `skip` (used for faceted counts). */
export function applyQuery(projects: Project[], q: Query, skip: (keyof Query)[] = []) {
  const needle = q.q?.toLowerCase();
  return projects.filter(
    (p) =>
      (skip.includes("category") || !q.category || inCategory(p, q.category)) &&
      (skip.includes("status") || !q.status || p.projectStatus === q.status) &&
      (skip.includes("location") || !q.location || p.location.state === q.location) &&
      (skip.includes("q") || !needle || `${p.name} ${locationLabel(p)}`.toLowerCase().includes(needle)),
  );
}

export const isFiltered = (q: Query) => !!(q.category || q.status || q.location || q.q);
