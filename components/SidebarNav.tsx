"use client"

import React from "react"
import { LayoutDashboard, CheckSquare, Target } from "lucide-react"
import { IdentityBadge } from "@/components/IdentityBadge"
import { Badge } from "@/components/ui/badge"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type NavItem = {
  label: string
  icon: React.ReactNode
  href: string
  badge?: React.ReactNode
}

// ---------------------------------------------------------------------------
// SidebarLogo
// ---------------------------------------------------------------------------

export function SidebarLogo() {
  return (
    <div style={{ padding: "20px 16px" }} className="shrink-0">
      {/* Wordmark row */}
      <div className="flex items-center gap-2.5">
        {/* Animated signal dot */}
        <span
          className="shrink-0 rounded-full animate-pulse"
          style={{
            width: "8px",
            height: "8px",
            background: "var(--color-accent-primary)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-body)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "0.2em",
            lineHeight: "var(--line-height-heading)",
            color: "var(--sidebar-foreground)",
            textTransform: "uppercase",
          }}
        >
          On Air
        </span>
      </div>

      {/* VU meter bars */}
      <div
        className="flex items-end gap-px mt-3"
        aria-hidden="true"
        style={{ height: "8px" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
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

// ---------------------------------------------------------------------------
// Shared rep nav items — rendered by both DesktopSidebar and the mobile nav
// sheet so the two surfaces never drift out of sync.
// ---------------------------------------------------------------------------

export const primaryNav: NavItem[] = [
  {
    label: "Dashboard",
    icon: (
      <LayoutDashboard
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "/",
  },
  {
    label: "What's Next",
    icon: (
      <CheckSquare
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "/whats-next",
  },
  {
    label: "My Goals",
    icon: (
      <Target
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "/goals",
    badge: (
      <Badge variant="secondary" className="ml-auto">
        Beta Only
      </Badge>
    ),
  },
]

// ---------------------------------------------------------------------------
// SidebarNavGroup
// ---------------------------------------------------------------------------

export function SidebarNavGroup({
  label,
  items,
  pathname,
  onNavigate,
}: {
  label: string
  items: NavItem[]
  pathname: string
  onNavigate?: () => void
}) {
  return (
    <div className="flex flex-col" style={{ gap: "2px" }}>
      {/* Section label */}
      <span
        className="px-3 pb-1"
        style={{
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--font-size-micro)",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "var(--color-text-secondary)",
          lineHeight: 1,
        }}
      >
        {label}
      </span>

      {items.map((item) => {
        const isActive = pathname === item.href
        return (
          <a
            key={item.label}
            href={item.href}
            onClick={onNavigate}
            className="relative flex items-center gap-2.5 w-full transition-colors"
            style={{
              padding: "8px 12px",
              borderRadius: "6px",
              background: isActive ? "var(--sidebar-accent)" : "transparent",
              color: isActive
                ? "var(--sidebar-accent-foreground)"
                : "var(--color-text-secondary)",
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-body)",
              fontWeight: isActive
                ? "var(--font-weight-medium)"
                : "var(--font-weight-regular)",
              textDecoration: "none",
              transitionDuration: "var(--duration-fast)",
            }}
          >
            {/* Left accent bar — only on active */}
            {isActive && (
              <span
                className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
                style={{
                  width: "3px",
                  height: "18px",
                  background: "var(--color-accent-primary)",
                  borderRadius: "0 2px 2px 0",
                }}
              />
            )}

            {/* Icon */}
            <span
              style={{
                display: "flex",
                alignItems: "center",
                color: isActive
                  ? "var(--color-accent-primary)"
                  : "var(--color-text-secondary)",
                flexShrink: 0,
              }}
            >
              {item.icon}
            </span>

            {item.label}
            {item.badge}
          </a>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SidebarFooter
// ---------------------------------------------------------------------------

export function SidebarFooter() {
  return (
    <div
      className="px-3 py-3 shrink-0"
      style={{ borderTop: "1px solid var(--sidebar-border)" }}
    >
      <IdentityBadge className="w-full" />
    </div>
  )
}
