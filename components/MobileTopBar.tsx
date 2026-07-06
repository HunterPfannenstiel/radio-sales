"use client"

import React from "react"
import { IdentityBadge } from "@/components/IdentityBadge"
import { MobileNavSheet } from "@/components/MobileNavSheet"

export function MobileTopBar() {
  return (
    <header
      className="md:hidden fixed top-0 inset-x-0 z-40 grid"
      style={{ gridTemplateColumns: "auto 1fr auto", background: "var(--sidebar)" }}
    >
      {/* Row 1 — hamburger | wordmark | identity badge */}
      <div className="flex items-center" style={{ height: "44px", padding: "0 8px" }}>
        <MobileNavSheet />
      </div>

      <div className="flex items-center" style={{ height: "44px", gap: "10px" }}>
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

      <div className="flex items-center justify-end" style={{ height: "44px", padding: "0 8px" }}>
        <IdentityBadge />
      </div>

      {/* Row 2 — VU meter strip, confined to the wordmark's grid column so it never
          drifts under the hamburger or identity badge as their widths change */}
      <div aria-hidden="true" />
      <div className="flex items-end gap-px" aria-hidden="true" style={{ height: "8px" }}>
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
      <div aria-hidden="true" />
    </header>
  )
}
