// Hook API for MonthPicker
// Powers the month-selection dialog opened from DateNavigator

export function useMonthPicker() {
  // All 12 abbreviated month names rendered in the 3x4 grid
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // The currently selected month (0-indexed, mirrors DateNavigator.selectedMonth)
  const selectedMonth: number = 5;

  // Called when the user taps a month cell
  // Should update DateNavigator.selectedMonth and close this picker
  const onSelect = (_month: number) => {};

  return { months, selectedMonth, onSelect };
}
