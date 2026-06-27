"use client";

import { GoalPanel } from "./GoalPanel";

const REP_NAME = "Marcus Webb";

export function GoalSetting() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <h1 className="text-2xl font-semibold">Goal Setting — {REP_NAME}</h1>
      <GoalPanel />
    </div>
  );
}
