import { describe, it, expect } from "vitest"
import { formatLastContact } from "./page"

// Fixed "today" so Today/Yesterday are stable — no fake timers needed since
// formatLastContact takes `today` as an explicit argument.
const today = new Date(2026, 6, 8) // Jul 8, 2026

describe("formatLastContact", () => {
  it("never contacted (isoString null) -> \"Never contacted\"", () => {
    expect(formatLastContact(null, today)).toBe("Never contacted")
  })

  it("contacted today, Jul 8 2026 -> \"Today\"", () => {
    expect(formatLastContact("2026-07-08T14:30:00", today)).toBe("Today")
  })

  it("contacted Jul 7 2026, one day before Jul 8 -> \"Yesterday\"", () => {
    expect(formatLastContact("2026-07-07T09:00:00", today)).toBe("Yesterday")
  })

  it("contacted Jun 3 2026, same year as today -> \"Jun 3\" (no year shown)", () => {
    expect(formatLastContact("2026-06-03T09:00:00", today)).toBe("Jun 3")
  })

  it("contacted Jun 3 2024, a prior year -> \"Jun 3, 2024\" (year shown)", () => {
    expect(formatLastContact("2024-06-03T09:00:00", today)).toBe("Jun 3, 2024")
  })
})
