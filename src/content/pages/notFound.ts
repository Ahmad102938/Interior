import type { Cta } from "../types";

/** 404 page. */
export const notFoundPage = {
  eyebrow: "404",
  title: "This page isn't available.",
  copy: "It may have moved, or the content is not published yet.",
  primary: { label: "Back to home", href: "/" } satisfies Cta,
  secondary: { label: "Contact us", href: "/contact" } satisfies Cta,
};
