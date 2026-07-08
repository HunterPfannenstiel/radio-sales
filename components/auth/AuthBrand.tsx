import React from "react"

export function AuthBrand() {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2.5">
        <span
          className="shrink-0 rounded-full animate-pulse"
          style={{
            width: "8px",
            height: "8px",
            background: "var(--color-accent-primary)",
          }}
          aria-hidden="true"
        />
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-h3)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "0.2em",
            lineHeight: "var(--line-height-heading)",
            color: "var(--color-text-primary)",
            textTransform: "uppercase",
          }}
        >
          On Air
        </span>
      </div>

      <div
        className="flex items-end gap-px mt-3"
        aria-hidden="true"
        style={{ height: "8px" }}
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: "3px",
              height: "8px",
              flexShrink: 0,
              background: "var(--color-accent-primary)",
              opacity: 0.15,
              borderRadius: "1px",
            }}
          />
        ))}
      </div>
    </div>
  )
}
