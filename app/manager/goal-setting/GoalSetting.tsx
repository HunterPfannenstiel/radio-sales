"use client";

import { GoalPanel } from "./GoalPanel";
import { PageHeader } from "@/components/PageHeader";

const REP_NAME = "Marcus Webb";

export function GoalSetting() {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <PageHeader title={`Goal Setting — ${REP_NAME}`} />
      <GoalPanel />
    </div>
  );
}
