"use client"

import React from "react"
import { QuickLogProvider } from "@/components/QuickLogContext"
import { DesktopSidebar } from "@/components/DesktopSidebar"
import { MobileTabBar } from "@/components/MobileTabBar"
import { QuickLogContainer } from "@/components/QuickLogContainer"

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QuickLogProvider>
      <div className="flex h-full min-h-svh">
        {/* Desktop sidebar — hidden on mobile */}
        <DesktopSidebar />

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>

      {/* Mobile tab bar — hidden on desktop */}
      <MobileTabBar />

      {/* Quick log modal/drawer — rendered once at root */}
      <QuickLogContainer />
    </QuickLogProvider>
  )
}
