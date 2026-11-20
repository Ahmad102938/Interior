import type { MetadataRoute } from "next";
import { company } from "@/data/company";
import { verticals } from "@/data/verticals";
import { projects } from "@/data/projects";
import { publishable } from "@/lib/content";

const routes = ["", "/about", "/industries", "/services", "/projects", "/capabilities", "/quality-safety-compliance", "/clients-partners", "/resources", "/careers", "/contact", "/request-a-quote", "/privacy-policy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: `${company.siteUrl}${r}` })),
    ...verticals.map((v) => ({ url: `${company.siteUrl}/services/${v.slug}` })),
    ...publishable(projects).map((p) => ({ url: `${company.siteUrl}/projects/${p.slug}` })),
  ];
}
