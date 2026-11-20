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
