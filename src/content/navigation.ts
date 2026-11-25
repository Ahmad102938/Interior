import type { VerticalKey } from "@/config/theme";
import { verticals, serviceHref } from "./verticals";

export type NavItem = {
  label: string;
  href: string;
  /** Shown in the condensed desktop bar (1024–1279px). Others move into the menu. */
  primary?: boolean;
  children?: { label: string; href: string; vertical: VerticalKey }[];
};

export const mainNav: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about", primary: true },
  { label: "Industries", href: "/industries" },
  {
    label: "Services",
    href: "/services",
    primary: true,
    children: verticals.map((v) => ({ label: v.title, href: serviceHref(v), vertical: v.key })),
  },
  { label: "Projects", href: "/projects", primary: true },
  { label: "Capabilities", href: "/capabilities", primary: true },
  { label: "Quality & Safety", href: "/quality-safety-compliance" },
  { label: "Careers", href: "/careers" },
  { label: "Contact", href: "/contact", primary: true },
];

export const isActivePath = (pathname: string, href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

export const footerQuickLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Capabilities", href: "/capabilities" },
  { label: "Clients & Partners", href: "/clients-partners" },
  { label: "Resources", href: "/resources" },
  { label: "Contact Us", href: "/contact" },
];

/** Labels in the header and mobile menu. */
export const headerContent = {
  skipLink: "Skip to content",
  quoteCta: { label: "Request a Quote", href: "/request-a-quote" },
  menuLabel: "Menu",
  closeLabel: "Close",
  verticalsLabel: "Business verticals",
};

/** Footer headings and the bottom bar. Contact rows come from company.ts. */
export const footerContent = {
  servicesTitle: "Services",
  companyTitle: "Company",
  contactTitle: "Contact",
  /** Shown after "© <year>". */
  copyright: "Adidev. All Rights Reserved.",
  legalLinks: [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
  ],
};

/** Breadcrumb names ("Home / Services / …") used at the top of inner pages. */
export const breadcrumbLabels = {
  home: "Home",
  about: "About",
  services: "Services",
  projects: "Projects",
  industries: "Industries",
  capabilities: "Capabilities",
  quality: "Quality & Safety",
  careers: "Careers",
  clients: "Clients & Partners",
  resources: "Resources",
  privacy: "Privacy Policy",
  terms: "Terms & Conditions",
};

/** Home › <page> */
export const crumbsFor = (page: keyof typeof breadcrumbLabels) => [{ label: breadcrumbLabels.home, href: "/" }, { label: breadcrumbLabels[page] }];
