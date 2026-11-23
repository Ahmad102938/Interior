"use client";

import { useEffect, useRef } from "react";

const DESKTOP = "(min-width: 1024px)";

/**
 * A capability group that collapses on phones and tablets and is always open on
 * desktop. Rendered open on the server (so desktop never shifts and content is
 * indexable); on smaller screens every group but the first closes on mount.
 */
export function CapabilityGroup({ first, summary, children, className }: { first: boolean; summary: React.ReactNode; children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    if (!first && ref.current && !matchMedia(DESKTOP).matches) ref.current.open = false;
  }, [first]);

  return (
    <details ref={ref} open className={className}>
      <summary
        onClick={(e) => {
          if (matchMedia(DESKTOP).matches) e.preventDefault();
        }}
        className="list-none [&::-webkit-details-marker]:hidden"
      >
        {summary}
      </summary>
      {children}
    </details>
  );
}
