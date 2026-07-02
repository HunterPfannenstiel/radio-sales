"use client";

export function GoalsHeader() {
  return (
    <div className="flex flex-col gap-1">
      <h1 className="text-2xl font-semibold">Goals</h1>
      <p className="text-sm text-muted-foreground">
        Edits apply the moment you save — there&apos;s no draft or history, only current values.
      </p>
    </div>
  );
}
