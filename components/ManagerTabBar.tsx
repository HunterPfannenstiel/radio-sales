"use client"

import React from "react"
import { Users, Target } from "lucide-react"
import { usePathname } from "next/navigation"

type Tab = {
  label: string
  icon: React.ReactNode
  href: string
}

function TabItem({ tab, isActive }: { tab: Tab; isActive: boolean }) {
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

const tabs: Tab[] = [
  {
    label: "My Team",
    icon: (
      <Users style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }} />
    ),
    href: "/manager",
  },
  {
    label: "Goal Setting",
    icon: (
      <Target style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }} />
    ),
    href: "/manager/goal-setting",
  },
]

export function ManagerTabBar() {
  const pathname = usePathname()

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
        const isActive =
          tab.href === "/manager"
            ? pathname === "/manager"
            : pathname.startsWith(tab.href)
        return <TabItem key={tab.label} tab={tab} isActive={isActive} />
      })}
    </nav>
  )
}
