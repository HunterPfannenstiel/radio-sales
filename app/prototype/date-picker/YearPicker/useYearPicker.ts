// Hook API for YearPicker
// Powers the spindle/drum dialog opened from DateNavigator

export function useYearPicker() {
  // All selectable years from the earliest supported year through the current year
  // Range: past years only — future years are never selectable
  const years: number[] = [];

  // The year currently centered in the spindle (the "selected" year)
  const selectedYear: number = 2026;

  // Index within `years` that is positioned at the center of the visible spindle
  // Scrolling shifts this index up or down
  const centerIndex: number = 0;

  // Scroll the spindle — 'up' moves toward earlier years, 'down' toward later years
  // Clamped so the spindle never scrolls past the first or last year
  const onScroll = (_direction: "up" | "down") => {};

  // Called when the user taps a year in the spindle
  // Snaps that year to the center, then selects it and closes the picker
  const onSelect = (_year: number) => {};

  return { years, selectedYear, centerIndex, onScroll, onSelect };
}
