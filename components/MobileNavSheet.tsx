"use client"

import React, { useState } from "react"
import { Menu } from "lucide-react"
import { usePathname } from "next/navigation"
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import { primaryNav, SidebarLogo, SidebarNavGroup, SidebarFooter } from "@/components/SidebarNav"

export function MobileNavSheet() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open navigation menu"
        className="flex items-center justify-center shrink-0 rounded-md transition-opacity hover:opacity-80 active:opacity-60"
        style={{ width: "36px", height: "36px", color: "var(--sidebar-foreground)" }}
      >
        <Menu style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }} />
      </button>
      <SheetContent
        side="left"
        className="w-3/4 max-w-[280px] flex flex-col gap-0 p-0 border-none"
        style={{ background: "var(--sidebar)", color: "var(--sidebar-foreground)" }}
      >
        {/* Accessible title/description only — the logo lockup below is the visible header */}
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <SheetDescription className="sr-only">
          Links to the main sections of the app
        </SheetDescription>

        <SidebarLogo />

        <div className="flex-1 overflow-y-auto flex flex-col px-3 py-2" style={{ gap: "var(--spacing-lg)" }}>
          <SidebarNavGroup
            label="Navigate"
            items={primaryNav}
            pathname={pathname}
            onNavigate={() => setOpen(false)}
          />
        </div>

        <SidebarFooter />
      </SheetContent>
    </Sheet>
  )
}
