"use client"

import React from "react"
import { PhoneCall } from "lucide-react"
import { usePathname } from "next/navigation"
import { useQuickLog } from "@/components/QuickLogContext"
import { primaryNav, SidebarLogo, SidebarNavGroup, SidebarFooter } from "@/components/SidebarNav"

// ---------------------------------------------------------------------------
// SidebarQuickLog
// ---------------------------------------------------------------------------

function SidebarQuickLog({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="px-3 pb-3 shrink-0">
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-2 w-full px-4 transition-opacity hover:opacity-80 active:opacity-60"
        style={{
          height: "40px",
          borderRadius: "9999px",
          background: "color-mix(in oklch, var(--color-accent-primary) 15%, transparent)",
          color: "var(--color-accent-primary)",
          fontFamily: "var(--font-family-base)",
          fontSize: "var(--font-size-body)",
          fontWeight: "var(--font-weight-medium)",
          transitionDuration: "var(--duration-fast)",
        }}
      >
        <PhoneCall
          style={{
            width: "var(--icon-size-md)",
            height: "var(--icon-size-md)",
            flexShrink: 0,
          }}
        />
        Log call
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
// DesktopSidebar (exported)
// ---------------------------------------------------------------------------

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
      </div>

      {/* 4. Identity footer — pinned to bottom */}
      <SidebarFooter />
    </aside>
  )
}
