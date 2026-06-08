# Access States

Standards for visually communicating that a user is restricted from performing an action. Specific permission logic belongs at the feature level, not here.

---

## Rule: Hide > Disable > Error

Apply restrictions in this order of preference:

| Restriction type | Treatment |
|---|---|
| Feature-level (entire section the user's role cannot access) | **Hidden** — not rendered at all |
| Action-level (the control exists but the user lacks permission for this specific record or item) | **Disabled** with a tooltip explaining why |
| Unexpected access attempt (direct URL navigation to a forbidden route) | **Silent redirect** to the user's default landing page |

---

## Feature-Level Hiding

If a rep's role does not include access to a section — for example, manager-only views — that nav item and all its content are not rendered. There is no:

- Locked icon or padlock badge
- Greyed-out nav item
- "Contact your administrator" placeholder screen

The feature simply does not exist for that user.

---

## Action-Level Disabled State

When a button or action exists in the UI but the current user lacks permission to take it on a specific record:

- The element renders at reduced opacity using `--color-text-disabled`
- It is not interactive
- A tooltip appears on hover (desktop) or tap (mobile) with a one-sentence explanation: *"You don't have permission to delete this record."*

The tooltip must explain why — "Disabled" alone is not a sufficient message.

---

## What Not to Do

- Do not show a full-page "Access Denied" wall for individual action restrictions — use the tooltip
- Do not use `--color-status-warning` for disabled states — disabled is neutral, not dangerous
- Do not show an error toast when a user navigates to a forbidden route — redirect silently
