"use client";

import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { VuMeter } from "./VuMeter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Period = "week" | "month" | "quarter" | "ytd";
type Level = "market" | "station" | "rep";
type SortField = "name" | "soldPct" | "projected";
type SortDir = "asc" | "desc";

interface ExecItem {
  id: string;
  name: string;
  soldPct: number;
  soldAmount: number;
  goalAmount: number;
  projectedAmount: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

interface RepData extends ExecItem {}
interface StationData extends ExecItem { reps: RepData[] }
interface MarketData extends ExecItem { stations: StationData[] }

const MARKETS: MarketData[] = [
  {
    id: "phoenix",
    name: "Phoenix",
    soldPct: 0.31,
    soldAmount: 186_000,
    goalAmount: 600_000,
    projectedAmount: 265_000,
    stations: [
      {
        id: "ktar",
        name: "KTAR",
        soldPct: 0.28,
        soldAmount: 98_000,
        goalAmount: 350_000,
        projectedAmount: 140_000,
        reps: [
          { id: "r1", name: "Brian Nguyen", soldPct: 0.22, soldAmount: 33_000, goalAmount: 150_000, projectedAmount: 47_000 },
          { id: "r2", name: "Carla Vega", soldPct: 0.34, soldAmount: 54_400, goalAmount: 160_000, projectedAmount: 78_000 },
          { id: "r3", name: "Dan Osei", soldPct: 0.26, soldAmount: 10_400, goalAmount: 40_000, projectedAmount: 15_000 },
        ],
      },
      {
        id: "kfyi",
        name: "KFYI",
        soldPct: 0.35,
        soldAmount: 87_500,
        goalAmount: 250_000,
        projectedAmount: 125_000,
        reps: [
          { id: "r4", name: "Elise Kim", soldPct: 0.41, soldAmount: 49_200, goalAmount: 120_000, projectedAmount: 70_000 },
          { id: "r5", name: "Frank Torres", soldPct: 0.29, soldAmount: 38_300, goalAmount: 130_000, projectedAmount: 55_000 },
        ],
      },
    ],
  },
  {
    id: "dallas",
    name: "Dallas",
    soldPct: 0.43,
    soldAmount: 473_000,
    goalAmount: 1_100_000,
    projectedAmount: 800_000,
    stations: [
      {
        id: "krld",
        name: "KRLD",
        soldPct: 0.51,
        soldAmount: 255_000,
        goalAmount: 500_000,
        projectedAmount: 420_000,
        reps: [
          { id: "r6", name: "Gina Park", soldPct: 0.66, soldAmount: 132_000, goalAmount: 200_000, projectedAmount: 188_000 },
          { id: "r7", name: "Hank Miller", soldPct: 0.41, soldAmount: 123_000, goalAmount: 300_000, projectedAmount: 175_000 },
        ],
      },
      {
        id: "kdfw",
        name: "KDFW",
        soldPct: 0.36,
        soldAmount: 216_000,
        goalAmount: 600_000,
        projectedAmount: 365_000,
        reps: [
          { id: "r8", name: "Iris Lowe", soldPct: 0.44, soldAmount: 132_000, goalAmount: 300_000, projectedAmount: 200_000 },
          { id: "r9", name: "Jake Rivera", soldPct: 0.28, soldAmount: 84_000, goalAmount: 300_000, projectedAmount: 120_000 },
        ],
      },
    ],
  },
  {
    id: "los-angeles",
    name: "Los Angeles",
    soldPct: 0.52,
    soldAmount: 1_092_000,
    goalAmount: 2_100_000,
    projectedAmount: 1_500_000,
    stations: [
      {
        id: "kabc",
        name: "KABC",
        soldPct: 0.60,
        soldAmount: 660_000,
        goalAmount: 1_100_000,
        projectedAmount: 880_000,
        reps: [
          { id: "r10", name: "Lena Scott", soldPct: 0.71, soldAmount: 284_000, goalAmount: 400_000, projectedAmount: 360_000 },
          { id: "r11", name: "Marco Bell", soldPct: 0.54, soldAmount: 216_000, goalAmount: 400_000, projectedAmount: 290_000 },
          { id: "r12", name: "Nina Patel", soldPct: 0.53, soldAmount: 159_000, goalAmount: 300_000, projectedAmount: 218_000 },
        ],
      },
      {
        id: "klac",
        name: "KLAC",
        soldPct: 0.43,
        soldAmount: 430_000,
        goalAmount: 1_000_000,
        projectedAmount: 615_000,
        reps: [
          { id: "r13", name: "Oscar Webb", soldPct: 0.38, soldAmount: 190_000, goalAmount: 500_000, projectedAmount: 270_000 },
          { id: "r14", name: "Priya Jones", soldPct: 0.48, soldAmount: 240_000, goalAmount: 500_000, projectedAmount: 345_000 },
        ],
      },
    ],
  },
  {
    id: "chicago",
    name: "Chicago",
    soldPct: 0.67,
    soldAmount: 938_000,
    goalAmount: 1_400_000,
    projectedAmount: 1_200_000,
    stations: [
      {
        id: "wbbm",
        name: "WBBM",
        soldPct: 0.75,
        soldAmount: 562_500,
        goalAmount: 750_000,
        projectedAmount: 690_000,
        reps: [
          { id: "r15", name: "Sarah Chen", soldPct: 0.88, soldAmount: 246_400, goalAmount: 280_000, projectedAmount: 294_000 },
          { id: "r16", name: "Marcus Webb", soldPct: 0.43, soldAmount: 129_000, goalAmount: 300_000, projectedAmount: 155_000 },
          { id: "r17", name: "Jordan Park", soldPct: 0.87, soldAmount: 147_900, goalAmount: 170_000, projectedAmount: 178_000 },
        ],
      },
      {
        id: "wgn",
        name: "WGN",
        soldPct: 0.58,
        soldAmount: 377_500,
        goalAmount: 650_000,
        projectedAmount: 510_000,
        reps: [
          { id: "r18", name: "Tanya Brooks", soldPct: 0.72, soldAmount: 198_000, goalAmount: 275_000, projectedAmount: 238_000 },
          { id: "r19", name: "Derek Osei", soldPct: 0.48, soldAmount: 144_000, goalAmount: 300_000, projectedAmount: 172_000 },
          { id: "r20", name: "Lisa Monroe", soldPct: 0.29, soldAmount: 21_750, goalAmount: 75_000, projectedAmount: 30_000 },
        ],
      },
    ],
  },
  {
    id: "houston",
    name: "Houston",
    soldPct: 0.78,
    soldAmount: 585_000,
    goalAmount: 750_000,
    projectedAmount: 730_000,
    stations: [
      {
        id: "khou",
        name: "KHOU",
        soldPct: 0.82,
        soldAmount: 328_000,
        goalAmount: 400_000,
        projectedAmount: 392_000,
        reps: [
          { id: "r21", name: "Quinn Adams", soldPct: 0.91, soldAmount: 182_000, goalAmount: 200_000, projectedAmount: 207_000 },
          { id: "r22", name: "Rachel Cruz", soldPct: 0.73, soldAmount: 146_000, goalAmount: 200_000, projectedAmount: 175_000 },
        ],
      },
      {
        id: "krbe",
        name: "KRBE",
        soldPct: 0.73,
        soldAmount: 255_500,
        goalAmount: 350_000,
        projectedAmount: 330_000,
        reps: [
          { id: "r23", name: "Sam Ford", soldPct: 0.79, soldAmount: 118_500, goalAmount: 150_000, projectedAmount: 143_000 },
          { id: "r24", name: "Tia Stone", soldPct: 0.68, soldAmount: 136_000, goalAmount: 200_000, projectedAmount: 178_000 },
        ],
      },
    ],
  },
  {
    id: "new-york",
    name: "New York",
    soldPct: 0.89,
    soldAmount: 2_314_000,
    goalAmount: 2_600_000,
    projectedAmount: 2_610_000,
    stations: [
      {
        id: "wabc",
        name: "WABC",
        soldPct: 0.94,
        soldAmount: 1_410_000,
        goalAmount: 1_500_000,
        projectedAmount: 1_545_000,
        reps: [
          { id: "r25", name: "Uma Rios", soldPct: 1.02, soldAmount: 510_000, goalAmount: 500_000, projectedAmount: 545_000 },
          { id: "r26", name: "Victor Ng", soldPct: 0.91, soldAmount: 455_000, goalAmount: 500_000, projectedAmount: 502_000 },
          { id: "r27", name: "Wendy Hall", soldPct: 0.90, soldAmount: 450_000, goalAmount: 500_000, projectedAmount: 498_000 },
        ],
      },
      {
        id: "wcbs",
        name: "WCBS",
        soldPct: 0.82,
        soldAmount: 902_000,
        goalAmount: 1_100_000,
        projectedAmount: 1_055_000,
        reps: [
          { id: "r28", name: "Xavier Lee", soldPct: 0.88, soldAmount: 440_000, goalAmount: 500_000, projectedAmount: 498_000 },
          { id: "r29", name: "Yara Marsh", soldPct: 0.77, soldAmount: 462_000, goalAmount: 600_000, projectedAmount: 537_000 },
        ],
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// Formatting helpers
// ---------------------------------------------------------------------------

function fmtMoney(n: number): string {
  if (Math.abs(n) >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

function fmtPct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function VarianceTag({ projected, goal }: { projected: number; goal: number }) {
  const delta = projected - goal;
  const isPositive = delta >= 0;
  const isBad = delta < -goal * 0.1;
  const color = isPositive
    ? "var(--color-status-achieved)"
    : isBad
    ? "var(--color-accent-primary)"
    : "var(--color-text-secondary)";

  return (
    <span
      style={{
        fontFamily: "var(--font-family-base)",
        fontSize: "var(--font-size-micro)",
        fontWeight: "var(--font-weight-medium)",
        color,
        letterSpacing: "0.02em",
      }}
    >
      {isPositive ? "+" : ""}
      {fmtMoney(delta)}
    </span>
  );
}

function ExecRow({
  item,
  onClick,
}: {
  item: ExecItem;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left group"
      style={{
        borderBottom: "1px solid var(--color-border-default)",
        background: "transparent",
        cursor: "pointer",
      }}
    >
      <div
        className="grid items-center px-6 py-4 gap-6 group-hover:bg-[var(--color-surface-subtle)] transition-colors"
        style={{ gridTemplateColumns: "1fr 200px 220px 24px" }}
      >
        {/* Name */}
        <span
          style={{
            fontFamily: "var(--font-family-heading)",
            fontSize: "18px",
            fontWeight: "var(--font-weight-medium)",
            color: "var(--color-text-primary)",
            letterSpacing: "0.01em",
          }}
        >
          {item.name}
        </span>

        {/* Sold % to goal */}
        <div className="flex flex-col gap-1.5 min-w-0">
          <span
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "30px",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text-primary)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            {fmtPct(item.soldPct)}
          </span>
          <VuMeter ratio={item.soldPct} />
        </div>

        {/* Projected vs Goal */}
        <div className="flex flex-col gap-1">
          <span
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "18px",
              fontWeight: "var(--font-weight-medium)",
              color: "var(--color-text-primary)",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            {fmtMoney(item.projectedAmount)}{" "}
            <span style={{ color: "var(--color-text-secondary)", fontWeight: "var(--font-weight-regular)" }}>
              / {fmtMoney(item.goalAmount)}
            </span>
          </span>
          <VarianceTag projected={item.projectedAmount} goal={item.goalAmount} />
        </div>

        {/* Chevron */}
        <ChevronRight
          style={{
            width: "16px",
            height: "16px",
            color: "var(--color-text-disabled)",
          }}
        />
      </div>
    </button>
  );
}

function ColumnHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
  align = "left",
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
  align?: "left" | "right";
}) {
  const active = sortField === field;
  return (
    <button
      onClick={() => onSort(field)}
      className="flex items-center gap-1"
      style={{
        fontFamily: "var(--font-family-base)",
        fontSize: "var(--font-size-micro)",
        fontWeight: "var(--font-weight-medium)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        color: active ? "var(--color-text-primary)" : "var(--color-text-secondary)",
        cursor: "pointer",
        background: "none",
        border: "none",
        padding: 0,
        justifyContent: align === "right" ? "flex-end" : "flex-start",
      }}
    >
      {label}
      <span style={{ opacity: active ? 1 : 0.3, fontSize: "10px" }}>
        {active && sortDir === "asc" ? " ↑" : " ↓"}
      </span>
    </button>
  );
}

// ---------------------------------------------------------------------------
// Period selector
// ---------------------------------------------------------------------------

const PERIODS: { value: Period; label: string }[] = [
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
  { value: "quarter", label: "This Quarter" },
  { value: "ytd", label: "YTD" },
];

function PeriodSelector({
  value,
  onChange,
}: {
  value: Period;
  onChange: (p: Period) => void;
}) {
  return (
    <div
      className="flex items-center gap-1 rounded-full p-1"
      style={{ background: "var(--color-surface-subtle)" }}
    >
      {PERIODS.map(({ value: v, label }) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          style={{
            fontFamily: "var(--font-family-base)",
            fontSize: "var(--font-size-small)",
            fontWeight: "var(--font-weight-medium)",
            padding: "4px 14px",
            borderRadius: "9999px",
            border: "none",
            cursor: "pointer",
            transition: "background 150ms, color 150ms",
            background: value === v ? "var(--color-surface-card)" : "transparent",
            color: value === v ? "var(--color-text-primary)" : "var(--color-text-secondary)",
            boxShadow: value === v ? "0 1px 2px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main assembled component
// ---------------------------------------------------------------------------

export function ExecDashboard() {
  const [period, setPeriod] = useState<Period>("quarter");
  const [selectedMarketId, setSelectedMarketId] = useState<string | null>(null);
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("soldPct");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const level: Level =
    selectedStationId ? "rep" : selectedMarketId ? "station" : "market";

  const selectedMarket = MARKETS.find((m) => m.id === selectedMarketId) ?? null;
  const selectedStation =
    selectedMarket?.stations.find((s) => s.id === selectedStationId) ?? null;

  const items: ExecItem[] = useMemo(() => {
    let raw: ExecItem[];
    if (level === "market") raw = MARKETS;
    else if (level === "station") raw = selectedMarket?.stations ?? [];
    else raw = selectedStation?.reps ?? [];

    return [...raw].sort((a, b) => {
      let av: string | number, bv: string | number;
      if (sortField === "name") { av = a.name; bv = b.name; }
      else if (sortField === "soldPct") { av = a.soldPct; bv = b.soldPct; }
      else { av = a.projectedAmount; bv = b.projectedAmount; }
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [level, selectedMarket, selectedStation, sortField, sortDir]);

  function handleSort(field: SortField) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  function handleRowClick(item: ExecItem) {
    if (level === "market") {
      setSortField("soldPct");
      setSortDir("asc");
      setSelectedMarketId(item.id);
    } else if (level === "station") {
      setSortField("soldPct");
      setSortDir("asc");
      setSelectedStationId(item.id);
    }
  }

  const periodLabel =
    period === "week" ? "This Week"
    : period === "month" ? "This Month"
    : period === "quarter" ? "Q2 2026"
    : "Year to Date 2026";

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ background: "var(--color-surface-page)" }}
    >
      {/* Page header */}
      <div
        className="flex items-start justify-between gap-4 px-8 pt-8 pb-5 shrink-0"
        style={{ borderBottom: "1px solid var(--color-border-default)" }}
      >
        <div className="flex flex-col gap-0.5">
          <h1
            style={{
              fontFamily: "var(--font-family-heading)",
              fontSize: "var(--font-size-h1)",
              fontWeight: "var(--font-weight-bold)",
              color: "var(--color-text-primary)",
              lineHeight: 1,
              letterSpacing: "-0.01em",
            }}
          >
            Executive Dashboard
          </h1>
          <span
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-text-secondary)",
              fontWeight: "var(--font-weight-regular)",
            }}
          >
            {periodLabel}
          </span>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      {/* Breadcrumb */}
      {level !== "market" && (
        <div
          className="flex items-center gap-1.5 px-8 py-3 shrink-0"
          style={{
            borderBottom: "1px solid var(--color-border-subtle)",
            background: "var(--color-surface-subtle)",
          }}
        >
          <button
            onClick={() => { setSelectedMarketId(null); setSelectedStationId(null); setSortField("soldPct"); setSortDir("asc"); }}
            style={{
              fontFamily: "var(--font-family-base)",
              fontSize: "var(--font-size-small)",
              color: "var(--color-accent-primary)",
              fontWeight: "var(--font-weight-medium)",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
          >
            ← Markets
          </button>
          {selectedMarket && (
            <>
              <span style={{ color: "var(--color-text-disabled)", fontSize: "var(--font-size-small)" }}>/</span>
              {level === "station" ? (
                <span style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}>
                  {selectedMarket.name}
                </span>
              ) : (
                <button
                  onClick={() => { setSelectedStationId(null); setSortField("soldPct"); setSortDir("asc"); }}
                  style={{
                    fontFamily: "var(--font-family-base)",
                    fontSize: "var(--font-size-small)",
                    color: "var(--color-accent-primary)",
                    fontWeight: "var(--font-weight-medium)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  {selectedMarket.name}
                </button>
              )}
            </>
          )}
          {selectedStation && (
            <>
              <span style={{ color: "var(--color-text-disabled)", fontSize: "var(--font-size-small)" }}>/</span>
              <span style={{ fontFamily: "var(--font-family-base)", fontSize: "var(--font-size-small)", color: "var(--color-text-secondary)" }}>
                {selectedStation.name}
              </span>
            </>
          )}
        </div>
      )}

      {/* Column headers */}
      <div
        className="grid px-6 py-2 shrink-0"
        style={{
          gridTemplateColumns: "1fr 200px 220px 24px",
          paddingLeft: "1.5rem",
          paddingRight: "1.5rem",
          borderBottom: "1px solid var(--color-border-default)",
          background: "var(--color-surface-subtle)",
        }}
      >
        <ColumnHeader label={level === "market" ? "Market" : level === "station" ? "Station" : "Rep"} field="name" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
        <ColumnHeader label="Sold % to Goal" field="soldPct" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
        <ColumnHeader label="Projected vs Goal" field="projected" sortField={sortField} sortDir={sortDir} onSort={handleSort} />
        <div />
      </div>

      {/* Row list */}
      <div className="flex-1 overflow-y-auto">
        {items.map((item) => (
          <ExecRow
            key={item.id}
            item={item}
            onClick={() => handleRowClick(item)}
          />
        ))}
      </div>
    </div>
  );
}
