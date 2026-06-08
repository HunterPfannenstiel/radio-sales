"use client"

import React from "react"
import { useQuickLog } from "@/components/QuickLogContext"
import { useMediaQuery } from "@/hooks/useMediaQuery"
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

export function QuickLogContainer() {
  const { isOpen, prefill, close } = useQuickLog()
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={(open) => !open && close()} modal>
        <DialogContent
          className="sm:max-w-md p-0 overflow-hidden flex flex-col max-h-[90vh]"
        >
          <DialogHeader className="px-4 pt-4 pb-2 shrink-0">
            <DialogTitle>Log Call</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            <QuickLogForm prefill={prefill} onClose={close} />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && close()}>
      <DrawerContent className="h-[85vh] flex flex-col">
        <DrawerHeader className="shrink-0 pb-2">
          <DrawerTitle>Log Call</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <QuickLogForm prefill={prefill} onClose={close} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
