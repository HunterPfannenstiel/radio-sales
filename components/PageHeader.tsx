import React from "react"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  accessory?: React.ReactNode
  onBack?: () => void
}

export function PageHeader({ title, accessory, onBack }: PageHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Go back"
          className="flex items-center justify-center shrink-0 rounded-md transition-colors"
          style={{
            width: "var(--touch-target-min)",
            height: "var(--touch-target-min)",
            color: "var(--color-text-secondary)",
            transitionDuration: "var(--duration-fast)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-surface-subtle)" }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent" }}
        >
          <ArrowLeft size={20} aria-hidden />
        </button>
      )}
      <h1
        className="font-bold tracking-tight uppercase"
        style={{
          fontSize: "var(--font-size-h1)",
          lineHeight: "var(--line-height-heading)",
          color: "var(--color-text-primary)",
        }}
      >
        {title}
      </h1>
      {accessory}
    </div>
  )
}
