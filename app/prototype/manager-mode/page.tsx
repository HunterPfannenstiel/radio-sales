"use client";

import { PrototypeLayout, PrototypeSection } from "@/app/prototype/PrototypeLayout";
import { ManagerShell } from "@/app/manager/ManagerShell";
import { ManagerSidebar } from "@/app/manager/ManagerSidebar";
import { ManagerTabBar } from "@/app/manager/ManagerTabBar";
import { ManagerDashboard } from "@/app/manager/ManagerDashboard";

export default function ManagerModePrototypePage() {
  return (
    <PrototypeLayout
      feature="Manager Mode"
      assembled={
        <ManagerShell>
          <ManagerDashboard />
        </ManagerShell>
      }
    >
      <PrototypeSection name="Manager Sidebar">
        <div
          className="h-64 rounded-lg overflow-hidden border"
          style={{ borderColor: "var(--color-border-subtle)" }}
        >
          <ManagerSidebar />
        </div>
      </PrototypeSection>

      <PrototypeSection name="Manager Tab Bar">
        <div className="relative h-20 rounded-lg overflow-hidden border" style={{ borderColor: "var(--color-border-subtle)" }}>
          <div
            className="absolute inset-0"
            style={{ background: "var(--color-surface-page)" }}
          />
          <div className="absolute bottom-0 left-0 right-0">
            <nav
              className="flex items-stretch"
              style={{
                background: "var(--color-surface-card)",
                borderTop: "1px solid var(--color-border-default)",
              }}
            >
              {[
                { label: "Rep List", active: true },
                { label: "Goal Setting", active: false },
              ].map(({ label, active }) => (
                <div
                  key={label}
                  className="flex flex-1 flex-col items-center justify-center relative"
                  style={{ paddingTop: "10px", paddingBottom: "8px" }}
                >
                  <span
                    className="absolute rounded-full"
                    style={{
                      top: "6px",
                      width: "5px",
                      height: "5px",
                      background: "var(--color-accent-primary)",
                      opacity: active ? 1 : 0,
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-family-heading)",
                      fontSize: "var(--font-size-micro)",
                      fontWeight: "var(--font-weight-medium)",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                      marginTop: "12px",
                      lineHeight: 1,
                      color: active
                        ? "var(--color-accent-primary)"
                        : "var(--color-text-secondary)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </nav>
          </div>
        </div>
      </PrototypeSection>
    </PrototypeLayout>
  );
}
