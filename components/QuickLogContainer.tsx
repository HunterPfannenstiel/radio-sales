"use client"

import React from "react"
import { useQuickLog } from "@/components/QuickLogContext"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import { useFetch } from "@/hooks/useFetch"
import { QuickLogForm } from "@/components/QuickLogForm"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type ActivityDTO = {
  callsToday: number
}


function ActivityCounter({ data }: { data: ActivityDTO | null }) {
  if (!data) return null
  return (
    <p
      className="text-center px-4 pb-2 shrink-0"
      style={{
        fontSize: "var(--font-size-micro)",
        color: "var(--color-text-secondary)",
      }}
    >
      {data.callsToday} {data.callsToday === 1 ? "call" : "calls"} logged today
    </p>
  )
}

export function QuickLogContainer() {
  const { isOpen, prefill, close } = useQuickLog()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { data: activity } = useFetch<ActivityDTO>("/api/calls/activity")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && close()} modal>
        <DialogContent
          className="sm:max-w-md p-0 overflow-hidden flex flex-col h-[90vh]"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <DialogHeader className="px-4 pt-4 pb-2 shrink-0">
            <DialogTitle>Log Call</DialogTitle>
          </DialogHeader>
          <ActivityCounter data={activity} />
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <QuickLogForm prefill={prefill} onClose={close} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
      <DrawerContent className="flex flex-col">
        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle>Log Call</DrawerTitle>
        </DrawerHeader>
        <ActivityCounter data={activity} />
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <QuickLogForm prefill={prefill} onClose={close} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
