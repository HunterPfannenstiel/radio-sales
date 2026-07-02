export function VuMeter({ ratio }: { ratio: number }) {
  const filled = Math.round(Math.min(Math.max(ratio, 0), 1) * 20);
  return (
    <div className="flex gap-px w-full">
      {Array.from({ length: 20 }, (_, i) => (
        <div
          key={i}
          className="flex-1"
          style={{
            height: "8px",
            background:
              i < filled
                ? "var(--color-accent-primary)"
                : "var(--color-surface-subtle)",
          }}
        />
      ))}
    </div>
  );
}
