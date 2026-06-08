"use client"

import React from "react"
import { TrendingUp, Building2, PhoneCall, CheckSquare, MoreHorizontal } from "lucide-react"
import { usePathname } from "next/navigation"
import { useQuickLog } from "@/components/QuickLogContext"
import { cn } from "@/lib/utils"

type Tab =
  | { kind: "link"; label: string; icon: React.ReactNode; href: string; active?: boolean }
  | { kind: "action"; label: string; icon: React.ReactNode; onClick: () => void; center?: boolean }

export function MobileTabBar() {
  const { open } = useQuickLog()
  const pathname = usePathname()

  const tabs: Tab[] = [
    {
      kind: "link",
      label: "Pipeline",
      icon: <TrendingUp className="size-5" />,
      href: "#",
    },
    {
      kind: "link",
      label: "What's Next",
      icon: <CheckSquare className="size-5" />,
      href: "/whats-next",
      active: pathname === "/whats-next",
    },
    {
      kind: "action",
      label: "Log Call",
      icon: <PhoneCall className="size-5" />,
      onClick: open,
      center: true,
    },
    {
      kind: "link",
      label: "Accounts",
      icon: <Building2 className="size-5" />,
      href: "#",
    },
    {
      kind: "link",
      label: "More",
      icon: <MoreHorizontal className="size-5" />,
      href: "#",
    },
  ]

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 flex items-stretch border-t border-border bg-background"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {tabs.map((tab) => {
        const isCenter = tab.kind === "action" && tab.center
        const isActive = tab.kind === "link" && tab.active

        const content = (
          <>
            <span
              className={cn(
                "transition-colors",
                isCenter
                  ? "text-primary-foreground"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {tab.icon}
            </span>
            <span
              className={cn(
                "text-[10px] font-medium mt-0.5",
                isCenter
                  ? "text-primary-foreground"
                  : isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {tab.label}
            </span>
          </>
        )

        const sharedClasses = cn(
          "flex flex-1 flex-col items-center justify-center py-2 gap-0.5 transition-colors",
          isCenter && "bg-primary rounded-t-xl mx-1"
        )

        if (tab.kind === "action") {
          return (
            <button
              key={tab.label}
              type="button"
              onClick={tab.onClick}
              className={sharedClasses}
            >
              {content}
            </button>
          )
        }

        return (
          <a key={tab.label} href={tab.href} className={sharedClasses}>
            {content}
          </a>
        )
      })}
    </nav>
  )
}
