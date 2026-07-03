"use client";

import { useState } from "react";
import { MOCK_REPS } from "./mockReps";

const MONTHS = ["July 2026", "June 2026", "May 2026", "April 2026"];

export function useRepRoster() {
  const [month, setMonth] = useState(MONTHS[0]);

  return {
    reps: MOCK_REPS,
    months: MONTHS,
    month,
    setMonth,
  };
}
