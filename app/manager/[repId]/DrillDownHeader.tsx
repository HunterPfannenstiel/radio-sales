"use client";

import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";

export function DrillDownHeader({ repName }: { repName: string }) {
  const router = useRouter();

  return (
    <div
      className="sticky top-0 z-10 px-6 py-4 border-b"
      style={{
        background: "var(--color-surface-page)",
        borderColor: "var(--color-border-default)",
      }}
    >
      <PageHeader title={repName} onBack={() => router.back()} />
    </div>
  );
}
