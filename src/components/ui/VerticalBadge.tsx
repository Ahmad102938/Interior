import type { VerticalKey } from "@/config/theme";
import { cn } from "@/lib/utils";

export const verticalClasses: Record<VerticalKey, { bg: string; text: string; accent: string; border: string; dot: string }> = {
  telecom: { bg: "bg-navy", text: "text-navy", accent: "text-gold", border: "border-navy", dot: "bg-gold" },
  solar: { bg: "bg-emerald", text: "text-emerald", accent: "text-gold-pale", border: "border-emerald", dot: "bg-gold-pale" },
  civil: { bg: "bg-charcoal", text: "text-charcoal", accent: "text-gold", border: "border-charcoal", dot: "bg-gold" },
  interiors: { bg: "bg-maroon", text: "text-maroon", accent: "text-gold-pale", border: "border-maroon", dot: "bg-gold-pale" },
};

export function VerticalBadge({ vertical, children, className }: { vertical: VerticalKey; children: React.ReactNode; className?: string }) {
  const c = verticalClasses[vertical];
  return (
    <span className={cn("inline-flex items-center gap-2 px-2.5 py-1 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white", c.bg, className)}>
      <span aria-hidden className={cn("size-1.5 rounded-full", c.dot)} />
      {children}
    </span>
  );
}
