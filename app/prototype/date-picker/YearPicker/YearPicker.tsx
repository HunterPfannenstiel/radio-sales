"use client";

// YearPicker: spindle/drum dialog opened when the year segment is clicked in DateNavigator
// Renders years as if printed on the surface of a cylinder — items near the center
// are full-size and fully opaque; items further away appear tilted and faded,
// simulating curvature. Supports any year from earliest past to current year.

// Prototype shows 5 slots; the center slot (index 2) is the selected year
const VISIBLE_COUNT = 5;
const CENTER_IDX = 2;

// Hardcoded years window for prototype — centered on 2026
const VISIBLE_YEARS = [2022, 2023, 2024, 2025, 2026];

export default function YearPicker() {
  const selectedYear = 2026;

  return (
    <div
      style={{
        display: "inline-block",
        border: "1px solid #e5e5e5",
        borderRadius: "14px",
        background: "white",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        overflow: "hidden",
        width: "130px",
        position: "relative",
      }}
    >
      {/* Center-selection band — visually locks the selected year in place */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          right: 0,
          height: "46px",
          transform: "translateY(-50%)",
          background: "#f5f5f5",
          borderTop: "1px solid #e0e0e0",
          borderBottom: "1px solid #e0e0e0",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />

      {/* Spindle container — perspective gives the cylinder illusion */}
      <div
        style={{
          perspective: "220px",
          perspectiveOrigin: "center center",
          padding: "8px 0",
          position: "relative",
          zIndex: 1,
        }}
      >
        {VISIBLE_YEARS.map((year, i) => {
          // Distance from center: 0 = selected, ±1 = adjacent, ±2 = outermost
          const dist = i - CENTER_IDX;

          // rotateX tilts each item as if it sits on the drum's curved surface
          const rotateX = dist * -18;

          // Items further from center appear smaller (foreshortening)
          const scale = 1 - Math.abs(dist) * 0.1;

          // Items further from center fade — reinforces the depth illusion
          const opacity = 1 - Math.abs(dist) * 0.28;

          const isSelected = year === selectedYear;

          return (
            // Tapping any year calls onSelect(year), snapping it to center then selecting it
            <div
              key={year}
              style={{
                transform: `rotateX(${rotateX}deg) scale(${scale})`,
                transformOrigin: "center center",
                opacity,
                padding: "10px 0",
                textAlign: "center",
                cursor: "pointer",
                fontSize: "17px",
                fontWeight: isSelected ? 700 : 400,
                color: isSelected ? "#111" : "#555",
                userSelect: "none",
                lineHeight: 1,
              }}
            >
              {year}
            </div>
          );
        })}
      </div>
    </div>
  );
}
