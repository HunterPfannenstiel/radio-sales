// Hook API for WeekCalendar
// Powers the lo-fi week-selection calendar opened from DateNavigator

export interface Week {
  // ISO week number within the year (e.g., 23 for the 23rd week of the year)
  weekNumber: number;
  // The Monday that starts this week
  startDate: Date;
  // Whether this week row should render in the selected/highlighted state
  isSelected: boolean;
}

export function useWeekCalendar() {
  // All weeks that fall within the currently displayed month
  // Partial weeks (month starts mid-week) are included if they contain ≥1 day in the month
  const weeks: Week[] = [];

  // ISO week number of the currently active week (mirrors DateNavigator.selectedWeek)
  const selectedWeek: number = 23;

  // Called when any part of a week row is clicked
  // Updates DateNavigator.selectedWeek and closes this calendar
  const onSelectWeek = (_weekNumber: number) => {};

  return { weeks, selectedWeek, onSelectWeek };
}
