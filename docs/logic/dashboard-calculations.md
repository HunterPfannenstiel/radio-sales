# Dashboard Calculation Logic

## Overview

The dashboard shows three metric blocks: **Money Pace** (monthly), **Calls** (weekly), and **Asks** (weekly). Each has a count or dollar amount, a goal, and a pace status.

---

## Money Pace

### Monthly Value

Each qualifying call log contributes a **monthly value** — the portion of the deal that falls in a single month:

```
monthlyValue = budget / termInMonths
```

### Deal Span

A deal's revenue span begins on the **1st of the month the call was logged** (not the exact log date) and extends forward for `termInMonths`. A deal contributes to a target month only if that month falls within:

Deals with no budget, no term value, or a term of zero are skipped entirely.

### soldAmount

The sum of `monthlyValue` for every call log where:
- `outcome === "yes"`, and
- the deal's span covers the target month

### projectedAmount

Built from two sources, both scoped to deals whose span covers the target month:

- **Sold deals** (`outcome === "yes"`): contributes `monthlyValue × 0.95`
- **Pending deals** (outcome is not `"no"` and a confidence is set): contributes `confidenceWeight × monthlyValue`

Confidence weights:

| Confidence | Weight |
|---|---|
| In | 0.95 |
| Sure | 0.80 |
| Expect | 0.40 |
| Hope | 0.10 |

> Note: sold deals contribute to `projectedAmount` at 95% — so projected will always be slightly below sold when all deals are closed.

### soldPercent

```
soldPercent = round((soldAmount / goalAmount) × 100)
```

### Pace Status

`expectedAmount` is an internal "par" value — where the rep needs to be right now to hit their goal at the current point in the month. It is **not displayed** on the dashboard:

```
expectedAmount = goalAmount × (workingDaysElapsed / totalWorkingDaysInMonth)
```

Working days are Monday–Friday only. For a past month, all working days are counted. The user's local timezone is used to determine today's date to avoid UTC midnight skew.

Pace status is determined in this order:

| Status | Condition |
|---|---|
| `goal_reached` | `soldAmount ≥ goalAmount` |
| `missed` | Month is fully in the past and goal not reached |
| `ahead` | `soldAmount ≥ expectedAmount` |
| `on_pace` | `projectedAmount ≥ expectedAmount` (but `soldAmount < expectedAmount`) |
| `behind` | Everything else |

---

## Calls

Calls track how many call logs the rep has recorded in the current ISO week (Monday–Friday).

### Count

Every log falling within the current ISO week counts as one call, regardless of outcome or any other field.

### Expected

A linear pacing target across the 5-day work week:

```
callExpected = weeklyCallTarget × (workingDaysElapsedInWeek / 5)
```

### Pace Status

| Status | Condition |
|---|---|
| `goal_reached` | `callCount ≥ weeklyCallTarget` |
| `missed` | Week is fully in the past and goal not reached |
| `on_pace` | `callCount ≥ callExpected` |
| `behind` | Everything else |

---

## Asks

Asks track how many calls this week included a budget — i.e., the rep put a dollar number on the table.

### Count

Same week-filtered call logs as calls, but only those where the `budget` field is set (not null or undefined). A single call log counts as both a call and an ask if a budget was entered.

### Expected

Same linear pacing as calls:

```
askExpected = weeklyAskTarget × (workingDaysElapsedInWeek / 5)
```

### Pace Status

Identical logic to calls, using `askCount` and `weeklyAskTarget`.

---

## Key Design Notes

- **Money pace is monthly; calls and asks are weekly.** Goals are set separately for each cadence.
- **A deal's revenue span always starts on the 1st of the month it was logged**, not the specific day.
- **`expectedAmount` is never shown** — it exists only as an internal benchmark to determine pace status.
- **Projected includes sold deals at 95%**, so a rep who has fully hit their goal will still see projected slightly below sold.
- **Weeks are ISO weeks** (Monday start). The week shown is passed in from the client along with the user's timezone to ensure correct day boundaries.
