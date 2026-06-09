"use client"

import React from "react"
import {
  LayoutDashboard,
  CheckSquare,
  PhoneCall,
  TrendingUp,
  MoreHorizontal,
} from "lucide-react"
import { usePathname } from "next/navigation"
import { useQuickLog } from "@/components/QuickLogContext"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type RegularTab = {
  kind: "link"
  label: string
  icon: React.ReactNode
  href: string
}

type CenterTab = {
  kind: "center"
  label: string
}

type Tab = RegularTab | CenterTab

// ---------------------------------------------------------------------------
// TabItem — regular tab with signal-dot indicator above icon when active
// ---------------------------------------------------------------------------

function TabItem({
  tab,
  isActive,
}: {
  tab: RegularTab
  isActive: boolean
}) {
  return (
    <a
      href={tab.href}
      className="flex flex-1 flex-col items-center justify-center relative"
      style={{
        paddingTop: "10px",
        paddingBottom: "8px",
        minHeight: "var(--touch-target-min)",
        textDecoration: "none",
      }}
    >
      {/* Signal dot — above icon, only when active */}
      <span
        className="absolute rounded-full"
        style={{
          top: "6px",
          width: "5px",
          height: "5px",
          background: "var(--color-accent-primary)",
          opacity: isActive ? 1 : 0,
          transition: "opacity var(--duration-fast) ease-in-out",
        }}
        aria-hidden="true"
      />

      {/* Icon */}
      <span
        style={{
          display: "flex",
          color: isActive
            ? "var(--color-accent-primary)"
            : "var(--color-text-secondary)",
          transition: "color var(--duration-fast) ease-in-out",
        }}
      >
        {tab.icon}
      </span>

      {/* Label */}
      <span
        style={{
          fontFamily: "var(--font-family-heading)",
          fontSize: "var(--font-size-micro)",
          fontWeight: "var(--font-weight-medium)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginTop: "3px",
          lineHeight: 1,
          color: isActive
            ? "var(--color-accent-primary)"
            : "var(--color-text-secondary)",
          transition: "color var(--duration-fast) ease-in-out",
        }}
      >
        {tab.label}
      </span>
    </a>
  )
}

// ---------------------------------------------------------------------------
// CenterLogTab — raised circle that breaks the tab bar plane upward
// ---------------------------------------------------------------------------

function CenterLogTab({ onOpen }: { onOpen: () => void }) {
  return (
    <div
      className="flex flex-1 flex-col items-center justify-end"
      style={{ paddingBottom: "8px" }}
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex flex-col items-center gap-1.5 relative"
        style={{
          // The button itself is just the layout container
          background: "none",
          border: "none",
          padding: 0,
        }}
        aria-label="Log Call"
      >
        {/* Raised circle */}
        <span
          className="flex items-center justify-center rounded-full shadow-md"
          style={{
            width: "52px",
            height: "52px",
            background: "var(--color-accent-primary)",
            // Floats above tab bar — offset upward
            marginTop: "-26px",
            flexShrink: 0,
            boxShadow: "0 4px 12px oklch(0.545 0.225 25 / 40%)",
          }}
          aria-hidden="true"
        >
          <PhoneCall
            style={{
              width: "var(--icon-size-md)",
              height: "var(--icon-size-md)",
              color: "var(--color-text-inverse)",
            }}
          />
        </span>

        {/* Label */}
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-micro)",
            fontWeight: "var(--font-weight-medium)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            lineHeight: 1,
            color: "var(--color-text-secondary)",
          }}
        >
          Log Call
        </span>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// MobileTabBar (exported)
// ---------------------------------------------------------------------------

export function MobileTabBar() {
  const { open } = useQuickLog()
  const pathname = usePathname()

  const tabs: Tab[] = [
    {
      kind: "link",
      label: "Dashboard",
      icon: (
        <LayoutDashboard
          style={{
            width: "var(--icon-size-md)",
            height: "var(--icon-size-md)",
          }}
        />
      ),
      href: "/",
    },
    {
      kind: "link",
      label: "What's Next",
      icon: (
        <CheckSquare
          style={{
            width: "var(--icon-size-md)",
            height: "var(--icon-size-md)",
          }}
        />
      ),
      href: "/whats-next",
    },
    {
      kind: "center",
      label: "Log Call",
    },
    {
      kind: "link",
      label: "Pipeline",
      icon: (
        <TrendingUp
          style={{
            width: "var(--icon-size-md)",
            height: "var(--icon-size-md)",
          }}
        />
      ),
      href: "#",
    },
    {
      kind: "link",
      label: "More",
      icon: (
        <MoreHorizontal
          style={{
            width: "var(--icon-size-md)",
            height: "var(--icon-size-md)",
          }}
        />
      ),
      href: "#",
    },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch"
      style={{
        background: "var(--color-surface-card)",
        borderTop: "1px solid var(--color-border-default)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {tabs.map((tab) => {
        if (tab.kind === "center") {
          return <CenterLogTab key={tab.label} onOpen={open} />
        }

        const isActive =
          tab.href === "/"
            ? pathname === "/"
            : pathname.startsWith(tab.href) && tab.href !== "#"

        return <TabItem key={tab.label} tab={tab} isActive={isActive} />
      })}
    </nav>
  )
}
