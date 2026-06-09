"use client";

// WeekCalendar: lo-fi week-selection dialog opened when the week segment is clicked
//
// Each row represents one week and is entirely clickable.
// Row anatomy (left → right):
//   [W##]  •  ────────────────────
//   Week#  Monday dot  Week span line
//
// Week number is the ISO week-of-year.
// The dot marks where Monday falls — it is not a day label, just a visual anchor.
// The line stretches from Monday through Sunday to represent the full span.

// Prototype data: weeks in June 2026
const WEEKS = [
  { weekNumber: 22, label: "Jun 1 – Jun 7" },
  { weekNumber: 23, label: "Jun 8 – Jun 14" },
  { weekNumber: 24, label: "Jun 15 – Jun 21" },
  { weekNumber: 25, label: "Jun 22 – Jun 28" },
  { weekNumber: 26, label: "Jun 29 – Jun 30" },
];

export default function WeekCalendar() {
  // Prototype state: week 23 currently selected
  const selectedWeek = 23;

  return (
    <div
      style={{
        display: "inline-block",
        border: "1px solid #e5e5e5",
        borderRadius: "14px",
        padding: "14px 12px",
        background: "white",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        minWidth: "240px",
      }}
    >
      {/* Month context label — orients the user to which month they're looking at */}
      <div
        style={{
          textAlign: "center",
          fontWeight: 600,
          fontSize: "13px",
          color: "#888",
          letterSpacing: "0.04em",
          textTransform: "uppercase",
          marginBottom: "10px",
        }}
      >
        June 2026
      </div>

      {WEEKS.map((week) => {
        const isSelected = week.weekNumber === selectedWeek;

        return (
          // The entire row is the click target — calling onSelectWeek(weekNumber)
          <div
            key={week.weekNumber}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "9px 10px",
              borderRadius: "8px",
              cursor: "pointer",
              background: isSelected ? "#111" : "transparent",
              marginBottom: "2px",
            }}
          >
            {/* ISO week-of-year number, left-aligned */}
            <span
              style={{
                fontSize: "11px",
                fontWeight: 700,
                color: isSelected ? "rgba(255,255,255,0.7)" : "#aaa",
                minWidth: "30px",
                fontFamily: "monospace",
                letterSpacing: "0.02em",
              }}
            >
              W{week.weekNumber}
            </span>

            {/* Dot anchored at Monday — visual start-of-week marker */}
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                background: isSelected ? "white" : "#111",
                flexShrink: 0,
              }}
            />

            {/* Horizontal line spanning the rest of the week (Mon–Sun) */}
            <div
              style={{
                flex: 1,
                height: "2px",
                background: isSelected ? "rgba(255,255,255,0.35)" : "#e0e0e0",
                borderRadius: "1px",
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
