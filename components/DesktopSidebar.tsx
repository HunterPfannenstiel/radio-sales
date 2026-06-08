"use client"

import React from "react"
import { PhoneCall, BarChart2, Building2, TrendingUp, Settings, User, CheckSquare } from "lucide-react"
import { usePathname } from "next/navigation"
import { useQuickLog } from "@/components/QuickLogContext"
import { cn } from "@/lib/utils"

type NavItem =
  | { kind: "action"; label: string; icon: React.ReactNode; onClick: () => void }
  | { kind: "link"; label: string; icon: React.ReactNode; href: string; active?: boolean }

export function DesktopSidebar() {
  const { open } = useQuickLog()
  const pathname = usePathname()

  const primaryNav: NavItem[] = [
    {
      kind: "action",
      label: "Log Call",
      icon: <PhoneCall className="size-4" />,
      onClick: open,
    },
    {
      kind: "link",
      label: "What's Next",
      icon: <CheckSquare className="size-4" />,
      href: "/whats-next",
      active: pathname === "/whats-next",
    },
    {
      kind: "link",
      label: "Pipeline",
      icon: <TrendingUp className="size-4" />,
      href: "#",
    },
    {
      kind: "link",
      label: "Accounts",
      icon: <Building2 className="size-4" />,
      href: "#",
    },
    {
      kind: "link",
      label: "Coaching",
      icon: <BarChart2 className="size-4" />,
      href: "#",
    },
  ]

  const secondaryNav: NavItem[] = [
    {
      kind: "link",
      label: "Settings",
      icon: <Settings className="size-4" />,
      href: "#",
    },
    {
      kind: "link",
      label: "Profile",
      icon: <User className="size-4" />,
      href: "#",
    },
  ]

  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 h-full border-r border-border bg-sidebar">
      {/* Logo / app name */}
      <div className="px-4 py-5 border-b border-border">
        <span className="font-bold text-sm text-sidebar-foreground tracking-tight">
          RadioSales
        </span>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col gap-0.5 p-2 overflow-y-auto">
        {primaryNav.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </nav>

      {/* Secondary nav pinned to bottom */}
      <div className="flex flex-col gap-0.5 p-2 border-t border-border">
        {secondaryNav.map((item) => (
          <SidebarItem key={item.label} item={item} />
        ))}
      </div>
    </aside>
  )
}

function SidebarItem({ item }: { item: NavItem }) {
  const isActive = item.kind === "link" && item.active

  const baseClasses = cn(
    "flex items-center gap-2.5 w-full px-3 py-2 rounded-md text-sm transition-colors text-left",
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
      : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
  )

  if (item.kind === "action") {
    return (
      <button type="button" onClick={item.onClick} className={baseClasses}>
        <span className={cn(isActive ? "text-sidebar-primary" : "text-muted-foreground")}>
          {item.icon}
        </span>
        {item.label}
      </button>
    )
  }

  return (
    <a href={item.href} className={baseClasses}>
      <span className={cn(isActive ? "text-sidebar-primary" : "text-muted-foreground")}>
        {item.icon}
      </span>
      {item.label}
    </a>
  )
}
