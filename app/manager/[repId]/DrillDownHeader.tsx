"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function DrillDownHeader({ repName }: { repName: string }) {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-10 flex items-center gap-4 px-6 py-4 border-b"
      style={{
        background: "var(--color-surface-page)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <button
        onClick={() => router.back()}
        aria-label="Back to leaderboard"
        className="flex items-center justify-center shrink-0 rounded-md transition-colors"
        style={{
          width: "var(--touch-target-min)",
          height: "var(--touch-target-min)",
          color: "var(--color-text-secondary)",
          transitionDuration: "var(--duration-fast)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "var(--color-surface-subtle)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
        }}
      >
        <ArrowLeft size={20} aria-hidden />
      </button>

      <span
        className="font-heading text-2xl font-bold uppercase tracking-tight"
        style={{ color: "var(--color-text-primary)" }}
      >
        {repName}
      </span>
    </div>
  );
}
