"use client";

// MonthPicker: dialog opened when the month segment is clicked in DateNavigator
// Abbreviated month names laid out in a 3-column × 4-row grid
// The currently selected month is highlighted; clicking any other cell selects it

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function MonthPicker() {
  // Prototype state: June selected (index 5)
  const selectedMonth = 5;

  return (
    <div
      style={{
        display: "inline-block",
        border: "1px solid #e5e5e5",
        borderRadius: "14px",
        padding: "14px",
        background: "white",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* 3 columns × 4 rows grid of abbreviated month names */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "6px",
        }}
      >
        {MONTHS.map((month, index) => {
          const isSelected = index === selectedMonth;
          return (
            // Tapping a cell calls onSelect(index) and closes the dialog
            <button
              key={month}
              style={{
                padding: "10px 14px",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: isSelected ? 600 : 400,
                background: isSelected ? "#111" : "#f5f5f5",
                color: isSelected ? "white" : "#111",
                transition: "background 0.15s",
              }}
            >
              {month}
            </button>
          );
        })}
      </div>
    </div>
  );
}
