import type { Status } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Development-only marker for unverified content. Pending content never
 * reaches production (see lib/content.ts), so this badge never does either.
 */
export function PendingBadge({ status, className }: { status: Status; className?: string }) {
  if (status !== "pending") return null;
  return (
    <span
      title="Pending management verification — hidden in production"
      className={cn(
        "inline-flex items-center border border-dashed border-amber-500/70 bg-amber-50 px-1.5 py-0.5 font-sans text-[0.625rem] font-bold uppercase tracking-[0.12em] text-amber-800",
        className,
      )}
    >
      Pending
    </span>
  );
}
