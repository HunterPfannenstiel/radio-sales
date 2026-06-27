"use client";

import React from "react";
import { Users, Target } from "lucide-react";
import { usePathname } from "next/navigation";

type NavItem = {
  label: string;
  icon: React.ReactNode;
  href: string;
};

function SidebarLogo() {
  return (
    <div style={{ padding: "20px 16px" }} className="shrink-0">
      <div className="flex items-center gap-2.5">
        <span
          className="shrink-0 rounded-full animate-pulse"
          style={{
            width: "8px",
            height: "8px",
            background: "var(--color-accent-primary)",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "var(--font-size-body)",
            fontWeight: "var(--font-weight-bold)",
            letterSpacing: "0.2em",
            lineHeight: "var(--line-height-heading)",
            color: "var(--sidebar-foreground)",
            textTransform: "uppercase",
          }}
        >
          On Air
        </span>
      </div>
      <div
        className="flex items-end gap-px mt-3"
        aria-hidden="true"
        style={{ height: "8px" }}
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <span
            key={i}
            style={{
              display: "block",
              width: "3px",
              height: "8px",
              flexShrink: 0,
              background: "var(--color-accent-primary)",
              opacity: 0.15,
              borderRadius: "1px",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}) {
  return (
    <a
      href={item.href}
      className="relative flex items-center gap-2.5 w-full transition-colors"
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        background: isActive ? "var(--sidebar-accent)" : "transparent",
        color: isActive
          ? "var(--sidebar-accent-foreground)"
          : "var(--color-text-secondary)",
        fontFamily: "var(--font-family-base)",
        fontSize: "var(--font-size-body)",
        fontWeight: isActive
          ? "var(--font-weight-medium)"
          : "var(--font-weight-regular)",
        textDecoration: "none",
        transitionDuration: "var(--duration-fast)",
      }}
    >
      {isActive && (
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: "3px",
            height: "18px",
            background: "var(--color-accent-primary)",
            borderRadius: "0 2px 2px 0",
          }}
        />
      )}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          color: isActive
            ? "var(--color-accent-primary)"
            : "var(--color-text-secondary)",
          flexShrink: 0,
        }}
      >
        {item.icon}
      </span>
      {item.label}
    </a>
  );
}

const managerNav: NavItem[] = [
  {
    label: "Rep List",
    icon: (
      <Users style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }} />
    ),
    href: "/manager",
  },
  {
    label: "Goal Setting",
    icon: (
      <Target style={{ width: "var(--icon-size-md)", height: "var(--icon-size-md)" }} />
    ),
    href: "/manager/goal-setting",
  },
];

export function ManagerSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="hidden md:flex flex-col shrink-0 h-full"
      style={{
        width: "224px",
        background: "var(--sidebar)",
        borderRight: "1px solid var(--sidebar-border)",
      }}
    >
      <SidebarLogo />

      <div
        className="flex-1 overflow-y-auto flex flex-col px-3 py-2"
        style={{ gap: "var(--spacing-lg)" }}
      >
        <div className="flex flex-col" style={{ gap: "2px" }}>
          <span
            className="px-3 pb-1"
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-micro)",
              fontWeight: "var(--font-weight-medium)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--color-text-secondary)",
              lineHeight: 1,
            }}
          >
            Navigate
          </span>
          {managerNav.map((item) => {
            const isActive =
              item.href === "/manager"
                ? pathname === "/manager"
                : pathname.startsWith(item.href);
            return (
              <SidebarNavItem key={item.label} item={item} isActive={isActive} />
            );
          })}
        </div>
      </div>
    </aside>
  );
}
