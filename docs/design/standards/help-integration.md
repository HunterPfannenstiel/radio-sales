# Help Integration

Standards for surfacing support and self-service documentation. Icon styling belongs in [iconography.md](iconography.md). Tooltip component anatomy belongs in [components.md](components.md).

---

## Entry Points

| Surface | Placement | Behavior |
|---|---|---|
| Desktop | "?" icon, top-right corner, every page | Opens help slide-over panel |
| Mobile | Profile menu → "Help & Support" | Opens same help panel |

The "?" entry point is present on every page without exception. It is never hidden, removed for space, or placed inside a dropdown menu.

---

## Help Panel vs. Tooltip vs. Inline Link

Three patterns serve different information needs:

| Pattern | When to use |
|---|---|
| **Help slide-over panel** | The user needs to leave their current task to read documentation or contact support |
| **Tooltip (ⓘ icon)** | A single field, setting, or label needs a one-sentence clarification — the user does not need to leave the page |
| **Inline help link** | An empty state or first-run context where the user needs to navigate to docs to complete setup |

**Decision rule:** If the help content can be expressed in one sentence, use a tooltip. If it requires reading or navigation, use the panel. If the user is already in an empty/zero-data state, embed the link directly in the empty state CTA.

---

## Tooltip Placement Rules

- A small `ⓘ` icon appears inline, immediately after the field label it describes
- Tooltip appears on hover (desktop) and tap (mobile)
- Tooltip text is **one sentence maximum** — if more is needed, link to the help panel instead
- Do not use tooltips on interactive elements (buttons, links) — those should be self-explanatory or use descriptive labels

---

## Help Panel Contents

1. Search field (searches the knowledge base)
2. Featured articles relevant to the current page — updates per route
3. Link to open a support chat

---

## Empty State Help Links

Every empty state CTA that links to documentation points to the specific article for that feature — never the help center homepage. A rep on an empty call log screen should land on "How to log a call", not the help root.

See [onboarding.md](onboarding.md) for full empty state rules.
