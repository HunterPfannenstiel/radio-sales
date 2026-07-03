"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { ComparisonTone, GroundingItem } from "./hooks/metricContent";

const BADGE_CLASSES: Record<ComparisonTone | "neutral", string | undefined> = {
  success: "border-transparent bg-[var(--color-status-success)] text-white",
  warning: "border-transparent bg-[var(--color-status-at-risk)] text-white",
  destructive: undefined,
  neutral: undefined,
};

function ItemBadge({ label, tone }: { label: string; tone?: ComparisonTone | "neutral" }) {
  if (tone === "destructive") return <Badge variant="destructive">{label}</Badge>;
  if (tone === "neutral" || !tone) return <Badge variant="outline">{label}</Badge>;
  return <Badge className={cn(BADGE_CLASSES[tone])}>{label}</Badge>;
}

export function MetricGroundingList({
  title,
  items,
}: {
  title: string;
  items: GroundingItem[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-medium text-muted-foreground">{title}</span>
      <ul className="flex flex-col gap-2">
        {items.map((item, i) => (
          <li
            key={`${item.label}-${i}`}
            className="flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm"
          >
            <span className="truncate">{item.label}</span>
            <div className="flex shrink-0 items-center gap-2">
              <span className="font-medium tabular-nums">{item.value}</span>
              {item.badgeLabel && <ItemBadge label={item.badgeLabel} tone={item.badgeTone} />}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
