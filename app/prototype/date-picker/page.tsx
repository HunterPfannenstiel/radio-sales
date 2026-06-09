// Prototype page — bundles all date-picker concepts for visual review
// This page is display-only; concepts are intentionally shown simultaneously
// rather than triggered by interaction, to allow reviewing all pieces at once.

import DateNavigator from "./DateNavigator/DateNavigator";
import MonthPicker from "./MonthPicker/MonthPicker";
import YearPicker from "./YearPicker/YearPicker";
import WeekCalendar from "./WeekCalendar/WeekCalendar";

export default function DatePickerPrototypePage() {
  return (
    <div
      style={{
        padding: "40px 32px",
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        gap: "48px",
        maxWidth: "600px",
      }}
    >
      {/* ── DateNavigator ─────────────────────────────────────────────── */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Date Navigator — rep dashboard header
        </p>
        <DateNavigator />
      </section>

      {/* ── MonthPicker ───────────────────────────────────────────────── */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Month Picker — opens on month tap
        </p>
        <MonthPicker />
      </section>

      {/* ── YearPicker ────────────────────────────────────────────────── */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Year Picker — opens on year tap (spindle / drum effect)
        </p>
        <YearPicker />
      </section>

      {/* ── WeekCalendar ──────────────────────────────────────────────── */}
      <section>
        <p style={{ fontSize: "11px", fontWeight: 600, color: "#aaa", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "12px" }}>
          Week Calendar — opens on week tap
        </p>
        <WeekCalendar />
      </section>
    </div>
  );
}
