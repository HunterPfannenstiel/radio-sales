// Hook API for DateNavigator
// Owns the active week context and controls which picker dialog is open

export function useDateNavigator() {
  // The currently selected month (0-indexed, 0 = January)
  const selectedMonth: number = 5;

  // The currently selected year (full 4-digit year)
  const selectedYear: number = 2026;

  // ISO week number within the year for the currently selected week
  const selectedWeek: number = 23;

  // Which picker dialog is currently open — null means all closed
  const activePicker: "month" | "year" | "week" | null = null;

  // Opens the MonthPicker dialog anchored near the month label
  const openMonthPicker = () => {};

  // Opens the YearPicker spindle dialog anchored near the year label
  const openYearPicker = () => {};

  // Opens the WeekCalendar dialog anchored near the week label
  const openWeekPicker = () => {};

  // Closes whichever picker is currently open
  const closePicker = () => {};

  // Called by MonthPicker on selection — updates selectedMonth and closes picker
  const setMonth = (_month: number) => {};

  // Called by YearPicker on selection — updates selectedYear and closes picker
  const setYear = (_year: number) => {};

  // Called by WeekCalendar on row click — updates selectedWeek and closes picker
  const setWeek = (_week: number) => {};

  return {
    selectedMonth,
    selectedYear,
    selectedWeek,
    activePicker,
    openMonthPicker,
    openYearPicker,
    openWeekPicker,
    closePicker,
    setMonth,
    setYear,
    setWeek,
  };
}
