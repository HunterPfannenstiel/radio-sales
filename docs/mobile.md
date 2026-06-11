# Mobile Standards

## Layout

- Never apply `overflow-y-auto` with a fixed height (`h-svh`, `h-screen`, etc.) to a wrapper that contains the full page content — this creates a nested scroll container that breaks pull-to-refresh and causes erratic scroll behavior on iOS
- Use the document as the scroll container for page content; reserve overflow scroll for isolated widgets (modals, dropdowns, sidebars)
- When a layout needs fixed-height shell behavior on desktop, make it responsive: `md:h-svh` + `md:overflow-y-auto`

## Keyboard & Inputs

- Always ensure input `font-size` is at least `16px`. iOS Safari automatically zooms the viewport on focus for any input below this threshold, causing unwanted scroll and zoom behavior.
- Set `interactiveWidget: "resizes-content"` in the Next.js viewport export. This makes the browser treat keyboard appearance/disappearance as a clean viewport resize, so page content transitions smoothly instead of snapping when the keyboard is dismissed.

## Vaul Drawers

Our `DrawerContent` component wraps vaul with a set of fixes that should not be removed:

- **`outline-none`** — vaul's content element receives focus on open, which triggers the browser's default blue focus ring. Suppressed with `outline-none`.
- **`!bottom-0`** — because `repositionInputs` is enabled by default, vaul repositions the drawer when an input is focused. `!important` is required to keep the drawer anchored to the bottom against vaul's inline style overrides.
- **`!h-[85vh]` default** — drawers default to 85vh. Pass `height="h-[Xvh]"` to use a different height; the component applies `!important` automatically. Do not set height via `className` — it will lose to the base `!important` rule.