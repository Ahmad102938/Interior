import type { Metric } from "@/data/company";
import { PendingBadge } from "./PendingBadge";

export function StatCard({ metric }: { metric: Metric }) {
  return (
    <div className="flex min-w-0 flex-col border-r border-b border-line p-5 sm:p-6 lg:p-8">
      <dt className="order-2 mt-3 text-sm font-semibold text-navy">{metric.label}</dt>
      <dd className="order-1 flex flex-wrap items-start gap-2 font-display text-4xl leading-none text-maroon sm:text-5xl lg:text-6xl">
        {metric.value}
        <PendingBadge status={metric.status} className="mt-1" />
      </dd>
      <dd className="order-3 mt-2 text-xs leading-relaxed text-slate">{metric.detail}</dd>
    </div>
  );
}
