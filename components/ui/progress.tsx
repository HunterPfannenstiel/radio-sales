"use client"

import * as React from "react"
import { Progress as ProgressPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

function Progress({
  className,
  value,
  color,
  indicatorClassName,
  indicatorStyle,
  style,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string
  indicatorStyle?: React.CSSProperties
  /** Status hue driving both the fill and its track tint (~18% opacity of this color). Falls back to brand primary when omitted. */
  color?: string
}) {
  return (
    <ProgressPrimitive.Root
      data-slot="progress"
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full",
        !color && "bg-primary/20",
        className
      )}
      style={{
        background: color ? `color-mix(in oklch, ${color} 18%, transparent)` : undefined,
        ...style,
      }}
      {...props}
    >
      <ProgressPrimitive.Indicator
        data-slot="progress-indicator"
        className={cn("h-full w-full flex-1 transition-all", !color && "bg-primary", indicatorClassName)}
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          background: color,
          ...indicatorStyle,
        }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
