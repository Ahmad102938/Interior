import type { MetadataRoute } from "next";
import { company } from "@/content/company";
import { verticals } from "@/content/verticals";
import { industries } from "@/content/industries";
import { projects, isPublic } from "@/content/projects";

const routes = ["", "/about", "/industries", "/services", "/projects", "/capabilities", "/quality-safety-compliance", "/clients-partners", "/resources", "/careers", "/contact", "/request-a-quote", "/privacy-policy", "/terms"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...routes.map((r) => ({ url: `${company.siteUrl}${r}` })),
    ...industries.map((i) => ({ url: `${company.siteUrl}/industries/${i.slug}` })),
    ...verticals.map((v) => ({ url: `${company.siteUrl}/services/${v.slug}` })),
    ...projects.filter(isPublic).map((p) => ({ url: `${company.siteUrl}/projects/${p.slug}` })),
  ];
}
