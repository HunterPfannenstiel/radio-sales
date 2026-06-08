"use client"

import React from "react"

type ThemeVars = {
  pageBg: string
  sidebarBg: string
  cardBg: string
  cardBorder: string
  mutedBg: string
  accent: string
  accentFg: string
  textPrimary: string
  textSecondary: string
  successColor: string
  warningColor: string
  headingFont: string
  bodyFont: string
  bigNumSize: string
  headingWeight: number
  headingTransform: React.CSSProperties["textTransform"]
  headingSpacing: string
}

type Theme = {
  id: string
  name: string
  tagline: string
  vars: ThemeVars
}

const THEMES: Theme[] = [
  {
    id: "on-air",
    name: "On Air",
    tagline: "Broadcast red · Barlow Condensed · Warm off-white",
    vars: {
      pageBg: "oklch(0.985 0.005 80)",
      sidebarBg: "oklch(0.15 0.01 60)",
      cardBg: "oklch(1 0 0)",
      cardBorder: "oklch(0.91 0.006 80)",
      mutedBg: "oklch(0.955 0.006 80)",
      accent: "oklch(0.545 0.225 25)",
      accentFg: "white",
      textPrimary: "oklch(0.14 0 0)",
      textSecondary: "oklch(0.50 0 0)",
      successColor: "oklch(0.627 0.194 142.5)",
      warningColor: "oklch(0.505 0.209 27.3)",
      headingFont: "'Barlow Condensed', sans-serif",
      bodyFont: "'Inter Tight', sans-serif",
      bigNumSize: "2.75rem",
      headingWeight: 700,
      headingTransform: "uppercase",
      headingSpacing: "0.04em",
    },
  },
  {
    id: "deep-signal",
    name: "Deep Signal",
    tagline: "Indigo glow · DM Sans · Full dark",
    vars: {
      pageBg: "oklch(0.115 0.015 275)",
      sidebarBg: "oklch(0.09 0.018 275)",
      cardBg: "oklch(0.17 0.022 275)",
      cardBorder: "oklch(1 0 0 / 10%)",
      mutedBg: "oklch(1 0 0 / 7%)",
      accent: "oklch(0.607 0.246 277.0)",
      accentFg: "white",
      textPrimary: "oklch(0.95 0 0)",
      textSecondary: "oklch(0.60 0.015 275)",
      successColor: "oklch(0.696 0.178 142.5)",
      warningColor: "oklch(0.627 0.209 27.3)",
      headingFont: "'DM Sans', sans-serif",
      bodyFont: "'DM Sans', sans-serif",
      bigNumSize: "2.5rem",
      headingWeight: 700,
      headingTransform: "none",
      headingSpacing: "-0.025em",
    },
  },
  {
    id: "frequency",
    name: "Frequency",
    tagline: "Amber gold · DM Serif Display · Editorial",
    vars: {
      pageBg: "oklch(0.972 0.014 85)",
      sidebarBg: "oklch(0.18 0.025 50)",
      cardBg: "oklch(0.995 0.01 85)",
      cardBorder: "oklch(0.88 0.018 85)",
      mutedBg: "oklch(0.955 0.014 85)",
      accent: "oklch(0.63 0.185 78)",
      accentFg: "oklch(0.12 0.02 55)",
      textPrimary: "oklch(0.165 0.015 55)",
      textSecondary: "oklch(0.48 0.03 55)",
      successColor: "oklch(0.627 0.194 142.5)",
      warningColor: "oklch(0.505 0.209 27.3)",
      headingFont: "'DM Serif Display', serif",
      bodyFont: "'DM Sans', sans-serif",
      bigNumSize: "3rem",
      headingWeight: 400,
      headingTransform: "none",
      headingSpacing: "-0.01em",
    },
  },
]

function NavPip({ active, accent }: { active: boolean; accent: string }) {
  return (
    <div
      style={{
        width: 28,
        height: 6,
        borderRadius: 99,
        background: active ? accent : "rgba(255,255,255,0.12)",
      }}
    />
  )
}

function MiniSidebar({ v }: { v: ThemeVars }) {
  return (
    <div
      style={{
        width: 44,
        background: v.sidebarBg,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "14px 0",
        gap: 8,
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 8,
          background: v.accent,
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "0.5rem",
          fontWeight: 900,
          color: v.accentFg,
          fontFamily: v.headingFont,
          letterSpacing: "0.02em",
          textTransform: "uppercase",
        }}
      >
        RS
      </div>
      <NavPip active accent={v.accent} />
      <NavPip active={false} accent={v.accent} />
      <NavPip active={false} accent={v.accent} />
      <NavPip active={false} accent={v.accent} />
    </div>
  )
}

function ThemePanel({ theme }: { theme: Theme }) {
  const v = theme.vars

  const h = (size = "0.9rem"): React.CSSProperties => ({
    fontFamily: v.headingFont,
    fontWeight: v.headingWeight,
    fontSize: size,
    color: v.textPrimary,
    letterSpacing: v.headingSpacing,
    textTransform: v.headingTransform,
    margin: 0,
  })

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, fontFamily: v.bodyFont }}>
      <div>
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: "1rem",
            fontWeight: 700,
            fontFamily: "system-ui",
            marginBottom: 2,
          }}
        >
          {theme.name}
        </div>
        <div style={{ color: "rgba(255,255,255,0.38)", fontSize: "0.62rem", fontFamily: "system-ui" }}>
          {theme.tagline}
        </div>
      </div>

      <div
        style={{
          width: 340,
          height: 490,
          borderRadius: 14,
          overflow: "hidden",
          boxShadow: "0 28px 72px rgba(0,0,0,0.55), 0 0 0 1px rgba(255,255,255,0.07)",
          display: "flex",
        }}
      >
        <MiniSidebar v={v} />

        <div
          style={{
            flex: 1,
            background: v.pageBg,
            display: "flex",
            flexDirection: "column",
            gap: 11,
            padding: "16px 14px",
            overflow: "hidden",
          }}
        >
          {/* Page heading */}
          <h2 style={h("1.1rem")}>My Dashboard</h2>

          {/* Money Pace card */}
          <div
            style={{
              background: v.cardBg,
              border: `1px solid ${v.cardBorder}`,
              borderRadius: 10,
              padding: "12px 13px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <span style={h("0.68rem")}>Money Pace · June 2026</span>
              <span
                style={{
                  background: v.successColor,
                  color: "white",
                  fontSize: "0.52rem",
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 99,
                  letterSpacing: "0.07em",
                }}
              >
                AHEAD
              </span>
            </div>

            <div
              style={{
                fontFamily: v.headingFont,
                fontWeight: v.headingWeight,
                fontSize: v.bigNumSize,
                color: v.successColor,
                lineHeight: 1,
                letterSpacing: v.headingSpacing,
              }}
            >
              74%
            </div>
            <div style={{ fontSize: "0.6rem", color: v.textSecondary, marginBottom: 9, marginTop: 3 }}>
              Sold to Goal
            </div>

            <div
              style={{
                height: 5,
                borderRadius: 99,
                background: v.mutedBg,
                overflow: "hidden",
                marginBottom: 9,
              }}
            >
              <div
                style={{ height: "100%", width: "74%", background: v.successColor, borderRadius: 99 }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.6rem", color: v.textSecondary }}>$18,500 sold</span>
              <span style={{ fontSize: "0.6rem", color: v.textSecondary }}>Goal $25,000</span>
            </div>
          </div>

          {/* Activity cards */}
          <div style={{ display: "flex", gap: 9 }}>
            {[
              { label: "Calls", count: 12, target: 20, behind: true },
              { label: "Asks", count: 8, target: 10, behind: false },
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  flex: 1,
                  background: v.cardBg,
                  border: `1px solid ${v.cardBorder}`,
                  borderRadius: 10,
                  padding: "10px 11px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 6,
                  }}
                >
                  <span style={h("0.62rem")}>{card.label}</span>
                  <span
                    style={{
                      background: card.behind ? v.warningColor : v.successColor,
                      color: "white",
                      fontSize: "0.48rem",
                      fontWeight: 700,
                      padding: "1px 5px",
                      borderRadius: 99,
                      letterSpacing: "0.05em",
                    }}
                  >
                    {card.behind ? "BEHIND" : "ON PACE"}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: v.headingFont,
                    fontWeight: v.headingWeight,
                    fontSize: "1.45rem",
                    lineHeight: 1,
                    color: v.textPrimary,
                    letterSpacing: v.headingSpacing,
                  }}
                >
                  {card.count}
                  <span style={{ fontSize: "0.95rem", color: v.textSecondary }}>/{card.target}</span>
                </div>
                <div
                  style={{
                    height: 4,
                    borderRadius: 99,
                    background: v.mutedBg,
                    overflow: "hidden",
                    marginTop: 8,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${(card.count / card.target) * 100}%`,
                      background: card.behind ? v.warningColor : v.successColor,
                      borderRadius: 99,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            style={{
              background: v.accent,
              color: v.accentFg,
              border: "none",
              borderRadius: 8,
              padding: "7px 13px",
              fontFamily: v.bodyFont,
              fontWeight: 600,
              fontSize: "0.7rem",
              cursor: "pointer",
              alignSelf: "flex-start",
              letterSpacing: v.headingTransform === "uppercase" ? "0.06em" : "0.01em",
            }}
          >
            + Log Call
          </button>

          {/* What's Next card teaser */}
          <div
            style={{
              background: v.cardBg,
              border: `1px solid ${v.cardBorder}`,
              borderRadius: 10,
              padding: "10px 13px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div style={{ minWidth: 0 }}>
              <div style={h("0.7rem")}>KBIG Radio</div>
              <div
                style={{
                  fontSize: "0.58rem",
                  color: v.textSecondary,
                  marginTop: 3,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Follow up on Q3 sponsorship package
              </div>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 4,
                fontSize: "0.52rem",
                fontWeight: 600,
                background: v.mutedBg,
                border: `1px solid ${v.cardBorder}`,
                color: v.textSecondary,
                padding: "2px 7px",
                borderRadius: 99,
                whiteSpace: "nowrap",
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: v.accent,
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              Present
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DesignPreviewPage() {
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `@import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700&family=Inter+Tight:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap');`,
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: "oklch(0.08 0 0)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "2.5rem 1.5rem 3.5rem",
          gap: "2rem",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <p
            style={{
              color: "rgba(255,255,255,0.28)",
              fontSize: "0.62rem",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontFamily: "system-ui",
              marginBottom: 4,
            }}
          >
            RadioSales · Design Preview
          </p>
          <p style={{ color: "rgba(255,255,255,0.18)", fontSize: "0.58rem", fontFamily: "system-ui" }}>
            Same components · only tokens change
          </p>
        </div>

        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          {THEMES.map((theme) => (
            <ThemePanel key={theme.id} theme={theme} />
          ))}
        </div>
      </div>
    </>
  )
}
