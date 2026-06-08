"use client"

import React from "react"
import { useQuickLog } from "@/components/QuickLogContext"
import { Button } from "@/components/ui/button"
import { PhoneCall } from "lucide-react"

function AccountCard({
  businessName,
  stage,
}: {
  businessName: string
  stage: string
}) {
  const { open } = useQuickLog()

  return (
    <div className="rounded-lg border border-border bg-card p-4 flex items-center justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-foreground">{businessName}</span>
        <span className="text-xs text-muted-foreground">{stage}</span>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => open({ businessName })}
        className="shrink-0 gap-1.5"
      >
        <PhoneCall className="size-3.5" />
        Log Call
      </Button>
    </div>
  )
}

export default function PipelinePage() {
  return (
    <div className="p-6 flex flex-col gap-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Pipeline</h1>
        <p className="text-sm text-muted-foreground">Your deals will appear here.</p>
      </div>

      {/* Example account card — demonstrates pre-filled Log Call */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Active Deals
        </h2>
        <AccountCard businessName="KFOO Radio" stage="Present" />
      </div>
    </div>
  )
}
