import React from "react"

interface PageHeaderProps {
  title: string
  badge?: React.ReactNode
}

export function PageHeader({ title, badge }: PageHeaderProps) {
  return (
    <div className="flex items-baseline gap-3">
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
      {badge && (
        <>
          <span
            aria-hidden
            style={{
              color: "var(--color-accent-primary)",
              fontSize: "var(--font-size-h3)",
              lineHeight: 1,
            }}
          >
            ●
          </span>
          <span
            style={{
              fontSize: "var(--font-size-body)",
              color: "var(--color-text-secondary)",
              fontWeight: "var(--font-weight-regular)",
            }}
          >
            {badge}
          </span>
        </>
      )}
    </div>
  )
}
