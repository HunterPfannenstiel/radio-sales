"use client";

import { RosterBody } from "./RosterBody";
import { RosterHeader } from "./RosterHeader";
import { useRepRoster } from "./hooks/useRepRoster";

export function RepRoster() {
  const { reps, months, month, setMonth } = useRepRoster();

  return (
    <div className="flex flex-col gap-6 p-4 md:p-6">
      <RosterHeader months={months} month={month} onMonthChange={setMonth} />
      <RosterBody reps={reps} />
    </div>
  );
}
