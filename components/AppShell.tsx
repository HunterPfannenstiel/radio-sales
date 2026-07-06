"use client"

import React from "react"
import { usePathname } from "next/navigation"
import { QuickLogProvider } from "@/components/QuickLogContext"
import { DesktopSidebar } from "@/components/DesktopSidebar"
import { MobileTabBar } from "@/components/MobileTabBar"
import { MobileTopBar } from "@/components/MobileTopBar"
import { ManagerSidebar } from "@/components/ManagerSidebar"
import { ManagerTabBar } from "@/components/ManagerTabBar"
import { QuickLogContainer } from "@/components/QuickLogContainer"

function ShellContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === "/login"
  const isManager = pathname.startsWith("/manager")

  if (isLogin) {
    return <>{children}</>
  }

  return (
    <>
      <MobileTopBar />
      <div className="flex h-dvh md:h-svh">
        {isManager ? <ManagerSidebar /> : <DesktopSidebar />}
        <main className="flex-1 overflow-y-auto pb-16 pt-[52px] md:pb-0 md:pt-0">
          {children}
        </main>
      </div>
      {isManager ? <ManagerTabBar /> : <MobileTabBar />}
      {!isManager && <QuickLogContainer />}
    </>
  )
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <QuickLogProvider>
      <ShellContent>{children}</ShellContent>
    </QuickLogProvider>
  )
}
