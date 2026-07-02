import type { Pace } from "../../hooks/mockReps";

export type MetricKey =
  | "activity-pace"
  | "asks"
  | "closing-ratio"
  | "avg-account-value";

export type ComparisonTone = "success" | "warning" | "destructive";

export type ComparisonBadgeSpec =
  | { kind: "pace"; pace: Pace }
  | { kind: "target" | "average"; label: string; tone: ComparisonTone };

export type ChartPoint = {
  period: string;
  value: number;
  reference?: number;
};

export type GroundingItem = {
  label: string;
  value: string;
  badgeLabel?: string;
  badgeTone?: ComparisonTone | "neutral";
};

export type MetricContent = {
  key: MetricKey;
  label: string;
  definition: string;
  cardValue: string;
  cardProgressPct?: number;
  topline: string;
  toplineProgressPct?: number;
  comparison: ComparisonBadgeSpec;
  chart: { data: ChartPoint[]; referenceLabel?: string };
  listTitle: string;
  list: GroundingItem[];
  alert?: string;
};

const MONTHS = ["Apr", "May", "Jun", "Jul"];

function activityPaceContent(seed: number, pace: Pace): MetricContent {
  const logged = 12 + (seed % 10);
  const expected = 20;
  const calls = Math.round(logged * 0.5);
  const emails = Math.round(logged * 0.35);
  const inPerson = Math.max(logged - calls - emails, 0);
  const isStale = seed % 3 === 0;

  const base = 58 + (seed % 20);
  const chart: ChartPoint[] = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((period, i) => ({
    period,
    value: Math.round(base + i * 4 + ((seed + i) % 7)),
    reference: 80,
  }));

  return {
    key: "activity-pace",
    label: "Activity Pace",
    definition: "Prospecting activities logged today versus what's expected by this point in the day.",
    cardValue: `${logged} / day`,
    topline: `${logged} logged / ${expected} expected by today`,
    comparison: { kind: "pace", pace },
    chart: { data: chart, referenceLabel: "Expected pace" },
    listTitle: "Activity breakdown (today)",
    list: [
      { label: "Calls", value: `${calls}` },
      { label: "Emails", value: `${emails}` },
      { label: "In-person", value: `${inPerson}` },
    ],
    alert: isStale ? `Last logged: ${1 + (seed % 4)} days ago` : undefined,
  };
}

function asksContent(seed: number): MetricContent {
  const target = 15;
  const count = 8 + (seed % 6);
  const diff = count - target;
  const comparison: ComparisonBadgeSpec =
    diff >= 0
      ? { kind: "target", label: diff === 0 ? "Goal met" : `+${diff} over goal`, tone: "success" }
      : diff >= -3
        ? { kind: "target", label: `${-diff} behind goal`, tone: "warning" }
        : { kind: "target", label: `${-diff} behind goal`, tone: "destructive" };

  const chart: ChartPoint[] = ["Wk 1", "Wk 2", "Wk 3", "Wk 4"].map((period, i) => ({
    period,
    value: Math.max(target - 6 + ((seed + i * 3) % 9), 1),
    reference: target,
  }));
  chart[chart.length - 1].value = count;

  const outcomes: Array<{ label: string; tone: ComparisonTone | "neutral" }> = [
    { label: "Won", tone: "success" },
    { label: "Pending", tone: "neutral" },
    { label: "Lost", tone: "destructive" },
  ];
  const accounts = ["Meridian Auto", "Cascade Realty", "Harbor Fitness", "Union Diner", "Bright Dental"];
  const list: GroundingItem[] = Array.from({ length: 5 }).map((_, i) => {
    const outcome = outcomes[(seed + i) % outcomes.length];
    const day = 30 - i * 2 - (seed % 3);
    return {
      label: accounts[(seed + i) % accounts.length],
      value: `Jul ${Math.max(day, 1)}`,
      badgeLabel: outcome.label,
      badgeTone: outcome.tone,
    };
  });

  return {
    key: "asks",
    label: "Asks",
    definition: "Sales asks made this week, tracked against the weekly target.",
    cardValue: `${count} of ${target}`,
    cardProgressPct: Math.min((count / target) * 100, 100),
    topline: `${count} / ${target} this week`,
    toplineProgressPct: Math.min((count / target) * 100, 100),
    comparison,
    chart: { data: chart, referenceLabel: "Weekly target" },
    listTitle: "Last 5 asks",
    list,
  };
}

function closingRatioContent(seed: number): MetricContent {
  const ratio = 28 + (seed % 15);
  const teamAvg = 32;
  const diff = ratio - teamAvg;
  const comparison: ComparisonBadgeSpec = {
    kind: "average",
    label: diff >= 0 ? `+${diff}pts vs. team avg` : `${diff}pts vs. team avg`,
    tone: diff >= 0 ? "success" : diff >= -5 ? "warning" : "destructive",
  };

  const chart: ChartPoint[] = MONTHS.map((period, i) => ({
    period,
    value: Math.max(ratio - (MONTHS.length - 1 - i) * 2 + ((seed + i) % 4), 5),
  }));
  chart[chart.length - 1].value = ratio;

  const list: GroundingItem[] = MONTHS.map((month, i) => {
    const lost = 4 + ((seed + i) % 6);
    const won = Math.max(Math.round((lost * chart[i].value) / (100 - chart[i].value || 1)), 1);
    return { label: month, value: `${won} won / ${lost} lost` };
  });

  return {
    key: "closing-ratio",
    label: "Closing Ratio",
    definition: "Share of asks that close, out of every ask made.",
    cardValue: `${ratio}%`,
    topline: `${ratio}%`,
    comparison,
    chart: { data: chart },
    listTitle: "Won / lost by month",
    list,
  };
}

function avgAccountValueContent(seed: number): MetricContent {
  const value = 2.4 + (seed % 5) * 0.6;
  const teamAvg = 3.6;
  const diff = value - teamAvg;
  const comparison: ComparisonBadgeSpec = {
    kind: "average",
    label:
      diff >= 0
        ? `+$${diff.toFixed(1)}K vs. team avg`
        : `-$${Math.abs(diff).toFixed(1)}K vs. team avg`,
    tone: diff >= 0 ? "success" : diff >= -0.8 ? "warning" : "destructive",
  };

  const chart: ChartPoint[] = MONTHS.map((period, i) => ({
    period,
    value: Number((value - (MONTHS.length - 1 - i) * 0.2 + ((seed + i) % 3) * 0.1).toFixed(1)),
  }));
  chart[chart.length - 1].value = Number(value.toFixed(1));

  const accounts = ["Pinecrest Landscaping", "Northgate Motors", "Willow & Vine", "Summit Orthodontics", "Quarry Street Grill"];
  const list: GroundingItem[] = Array.from({ length: 4 }).map((_, i) => {
    const amount = value + (((seed + i * 5) % 9) - 4) * 0.3;
    const day = 28 - i * 3 - (seed % 3);
    return {
      label: accounts[(seed + i) % accounts.length],
      value: `$${Math.max(amount, 0.5).toFixed(1)}K`,
      badgeLabel: `Jul ${Math.max(day, 1)}`,
      badgeTone: "neutral",
    };
  });

  return {
    key: "avg-account-value",
    label: "Avg. Account Value",
    definition: "Average deal size across closed accounts this month.",
    cardValue: `$${value.toFixed(1)}K`,
    topline: `$${value.toFixed(1)}K`,
    comparison,
    chart: { data: chart },
    listTitle: "Most recent deals",
    list,
  };
}

export function getAllMetricContent(seed: number, pace: Pace): MetricContent[] {
  return [
    activityPaceContent(seed, pace),
    asksContent(seed),
    closingRatioContent(seed),
    avgAccountValueContent(seed),
  ];
}
