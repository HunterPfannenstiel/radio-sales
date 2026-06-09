"use client";

// DateNavigator: the week-navigation header on the rep dashboard
// Shows three independently clickable segments: Month · Year · Week
// Each segment opens its own picker dialog (see MonthPicker, YearPicker, WeekCalendar concepts)

export default function DateNavigator() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        padding: "6px 14px",
        border: "1px solid #d4d4d4",
        borderRadius: "10px",
        background: "white",
        fontSize: "15px",
      }}
    >
      {/* Clicking this segment opens MonthPicker — see MonthPicker concept */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "15px",
          padding: "2px 6px",
          borderRadius: "6px",
          color: "#111",
        }}
      >
        Jun
      </button>

      <span style={{ color: "#ccc", fontWeight: 300 }}>·</span>

      {/* Clicking this segment opens YearPicker spindle — see YearPicker concept */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "15px",
          padding: "2px 6px",
          borderRadius: "6px",
          color: "#111",
        }}
      >
        2026
      </button>

      <span style={{ color: "#ccc", fontWeight: 300 }}>·</span>

      {/* Clicking this segment opens WeekCalendar — see WeekCalendar concept */}
      <button
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 600,
          fontSize: "15px",
          padding: "2px 6px",
          borderRadius: "6px",
          color: "#111",
        }}
      >
        W23
      </button>
    </div>
  );
}
