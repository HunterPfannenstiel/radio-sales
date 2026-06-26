export function LeaderboardHeader() {
  return (
    <div
      className="flex items-center sticky top-0 z-10 shrink-0"
      style={{ background: "var(--sidebar)" }}
    >
      {/* Bar placeholder to align with row risk bars */}
      <div className="w-1.5 shrink-0" />

      <div className="flex-1 grid items-center gap-6 px-6 py-3"
        style={{ gridTemplateColumns: "1fr 160px 160px 200px" }}
      >
        {["Rep", "Sold", "Projected", "Pace"].map((label) => (
          <span
            key={label}
            className="font-heading text-xs uppercase tracking-widest font-bold"
            style={{ color: "var(--sidebar-foreground)", opacity: 0.7 }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
