# Details

## Page Purpose

Goal-setting is a configuration surface, completely separate from the manager dashboard. The dashboard is for observing rep performance; this page is for configuring the targets that drive those calculations. The two concepts should not share a page or be conflated in navigation.

## Entry Point

A dedicated page in the manager view. Navigation into the page will be determined when the broader manager navigation is planned. The page stands on its own and does not depend on the dashboard as an entry point.

## Page Structure

### Empty State

When the manager first lands on the page, no rep is selected. The page displays an empty state prompting the manager to select a rep. No content is shown until a rep is chosen.

### Rep Selection

A dropdown at the top of the page allows the manager to select which rep they are configuring. This is a picker, not a ranked list — it carries no performance meaning.

### Goal Fields

Three fields, split into two groups:

**Sales Goals**
- Monthly Goal

**Activity Targets**
- Weekly Calls
- Weekly Asks

These labels are final. "Asks" is an understood industry term and intentional.

Annual goal is not a field on this page. If an annual figure is needed elsewhere in the product, it is a calculated display value derived from the monthly goal — never editable.

## Edit Flow

Fields display in read mode by default. The manager sees the current values but cannot interact with them.

A single "Edit" button puts the entire page into edit mode — all three fields open simultaneously. There is no field-level editing.

A single "Save" button commits all changes at once. After saving, the page returns to read mode displaying the updated values. This return to read mode is the confirmation signal — the manager sees their changes reflected as stable, live numbers.

There is no cancel flow defined at this stage.
