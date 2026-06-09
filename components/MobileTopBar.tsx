import React from "react"

export function MobileTopBar() {
  return (
    <header
      className="md:hidden fixed top-0 inset-x-0 z-40 flex flex-col"
      style={{ background: "var(--sidebar)" }}
    >
      {/* Wordmark row */}
      <div
        className="flex items-center"
        style={{ height: "44px", padding: "0 16px", gap: "10px" }}
      >
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
            fontSize: "var(--font-size-body)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            lineHeight: "var(--line-height-heading)",
            color: "var(--sidebar-foreground)",
          }}
        >
          On Air
        </span>
      </div>

      {/* VU meter strip — acts as the visual separator */}
      <div
        className="flex items-end gap-px px-4"
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
    </header>
  )
}
