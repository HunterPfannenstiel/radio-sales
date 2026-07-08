import { describe, it, expect } from "vitest"
import { formatEntryDate } from "./InteractionHistory"

// Fixed "now" so Today/Yesterday are stable.
const now = new Date(2026, 6, 8) // Jul 8, 2026

describe("formatEntryDate", () => {
  it("entry dated Jul 8 2026, same day as now -> \"Today\"", () => {
    expect(formatEntryDate(new Date(2026, 6, 8, 14, 30), now)).toBe("Today")
  })

  it("entry dated Jul 7 2026, one day before now -> \"Yesterday\"", () => {
    expect(formatEntryDate(new Date(2026, 6, 7, 9, 0), now)).toBe("Yesterday")
  })

  it("entry dated Jun 3 2026, same year as now -> \"Jun 3\" (no year shown)", () => {
    expect(formatEntryDate(new Date(2026, 5, 3, 9, 0), now)).toBe("Jun 3")
  })

  it("entry dated Jun 3 2024, a prior year -> \"Jun 3, 2024\" (year shown)", () => {
    expect(formatEntryDate(new Date(2024, 5, 3, 9, 0), now)).toBe("Jun 3, 2024")
  })
})
