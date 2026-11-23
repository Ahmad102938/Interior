"use client";

import { useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { LISTING_KEY } from "./query";

const noop = () => () => {};
const read = () => {
  try {
    return sessionStorage.getItem(LISTING_KEY);
  } catch {
    return null;
  }
};

/** Returns to the listing exactly as it was left (filters and page), or to /projects. */
export function BackToProjects({ className }: { className?: string }) {
  const href = useSyncExternalStore(noop, read, () => null) ?? "/projects";
  return (
    <Link href={href} className={cn("group inline-flex min-h-11 items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em]", className)}>
      <ArrowLeft aria-hidden className="size-4 transition-transform group-hover:-translate-x-0.5" />
      Back to projects
    </Link>
  );
}
