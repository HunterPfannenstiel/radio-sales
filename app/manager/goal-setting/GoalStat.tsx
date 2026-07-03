"use client";

import { cn } from "@/lib/utils";

export function GoalStat({
  label,
  value,
  size = "default",
}: {
  label: string;
  value: string;
  size?: "default" | "lg";
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-semibold leading-none tabular-nums",
          size === "lg" ? "text-2xl" : "text-lg"
        )}
      >
        {value}
      </span>
    </div>
  );
}
