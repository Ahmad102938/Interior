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
        "inline-flex items-center border border-dashed border-amber-500/50 bg-amber-500/10 px-1.5 py-px font-sans text-[0.5625rem] font-semibold uppercase tracking-[0.12em] text-amber-600",
        className,
      )}
    >
      Pending
    </span>
  );
}
