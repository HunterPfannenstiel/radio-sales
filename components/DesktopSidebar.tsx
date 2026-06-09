"use client"

import React from "react"
import {
  PhoneCall,
  LayoutDashboard,
  CheckSquare,
  TrendingUp,
  Building2,
  BarChart2,
  Settings,
  User,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useQuickLog } from "@/components/QuickLogContext"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type NavItem = {
  label: string
  icon: React.ReactNode
  href: string
}

// ---------------------------------------------------------------------------
// SidebarLogo
// ---------------------------------------------------------------------------

function SidebarLogo() {
  return (
    <div
      style={{ padding: "20px 16px" }}
      className="shrink-0"
    >
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
// SidebarQuickLog
// ---------------------------------------------------------------------------

function SidebarQuickLog({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="px-3 pb-3 shrink-0">
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-2 w-full px-4 transition-opacity hover:opacity-90 active:opacity-80"
        style={{
          height: "40px",
          borderRadius: "9999px",
          background: "var(--color-accent-primary)",
          color: "var(--color-text-inverse)",
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--font-size-body)",
          fontWeight: "var(--font-weight-medium)",
          transitionDuration: "var(--duration-fast)",
        }}
      >
        <PhoneCall
          style={{
            width: "var(--icon-size-sm)",
            height: "var(--icon-size-sm)",
            flexShrink: 0,
          }}
        />
        Log Call
      </button>
      {/* Hairline separator */}
      <div
        className="mt-3"
        style={{
          height: "1px",
          background: "var(--color-border-subtle)",
          opacity: 0.5,
        }}
      />
    </div>
  )
}

// ---------------------------------------------------------------------------
// SidebarNavGroup
// ---------------------------------------------------------------------------

function SidebarNavGroup({
  label,
  items,
  pathname,
}: {
  label: string
  items: NavItem[]
  pathname: string
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
          </a>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// SidebarPaceBadge
// ---------------------------------------------------------------------------

function SidebarPaceBadge() {
  // Mocked static data — wired to live data later
  const month = "June"
  const pct = 68
  const progressColor = "var(--color-status-warning)" // 68% is behind pace

  return (
    <div
      className="mx-3 my-1"
      style={{
        borderRadius: "var(--radius-card)",
        background: "var(--sidebar-accent)",
        padding: "10px 12px",
      }}
    >
      {/* Header row: dot + label */}
      <div className="flex items-center gap-1.5 mb-2">
        <span
          className="shrink-0 rounded-full"
          style={{
            width: "6px",
            height: "6px",
            background: progressColor,
            flexShrink: 0,
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--sidebar-accent-foreground)",
            letterSpacing: "0.02em",
          }}
        >
          {month} · {pct}%
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: "4px",
          borderRadius: "9999px",
          background: "var(--sidebar-border)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            background: progressColor,
            borderRadius: "9999px",
            transition: "width var(--duration-base) ease-out",
          }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// DesktopSidebar (exported)
// ---------------------------------------------------------------------------

const primaryNav: NavItem[] = [
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
    label: "Pipeline",
    icon: (
      <TrendingUp
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "#",
  },
  {
    label: "Accounts",
    icon: (
      <Building2
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "#",
  },
  {
    label: "Coaching",
    icon: (
      <BarChart2
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "#",
  },
]

const secondaryNav: NavItem[] = [
  {
    label: "Settings",
    icon: (
      <Settings
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "#",
  },
  {
    label: "Profile",
    icon: (
      <User
        style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }}
      />
    ),
    href: "#",
  },
]

export function DesktopSidebar() {
  const { open } = useQuickLog()
  const pathname = usePathname()

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-full"
      style={{
        width: "224px",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      {/* 1. Logo zone */}
      <SidebarLogo />

      {/* 2. Quick Log button + hairline */}
      <SidebarQuickLog onOpen={open} />

      {/* 3. Primary nav — scrollable middle section */}
      <div className="flex-1 overflow-y-auto flex flex-col px-3 py-2" style={{ gap: "var(--spacing-lg)" }}>
        <SidebarNavGroup
          label="Navigate"
          items={primaryNav}
          pathname={pathname}
        />

        {/* 4. Pace badge */}
        <div className="-mx-3">
          <SidebarPaceBadge />
        </div>
      </div>

      {/* 5. Secondary nav — pinned bottom */}
      <div
        className="px-3 py-3 shrink-0"
        style={{ borderTop: "1px solid var(--sidebar-border)" }}
      >
        <SidebarNavGroup
          label="Account"
          items={secondaryNav}
          pathname={pathname}
        />
      </div>
    </aside>
  )
}
