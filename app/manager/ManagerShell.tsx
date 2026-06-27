"use client";

import React from "react";
import { ManagerSidebar } from "./ManagerSidebar";
import { ManagerTabBar } from "./ManagerTabBar";

export function ManagerShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex md:h-svh">
        <ManagerSidebar />
        <main className="flex-1 md:overflow-y-auto pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <ManagerTabBar />
    </>
  );
}
