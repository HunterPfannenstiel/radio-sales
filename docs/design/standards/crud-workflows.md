# CRUD Workflows

Standards for creation, editing, and deletion interaction patterns. Form input anatomy belongs in [components.md](components.md). Slide-over and modal mechanics belong in [navigation.md](navigation.md).

---

## Creation Pattern Decision Tree

Choose the container for a creation form based on complexity and context:

| Form complexity | Context needed? | Use |
|---|---|---|
| 1–5 fields, under 2 minutes | No | **Modal** |
| 3–8 fields, user needs to reference the parent list/view | Yes | **Slide-over panel** |
| 6+ fields, 3+ steps, or branching logic | No | **Full-page form** |

When in doubt, start with a modal. Escalate to slide-over or full-page only when there's a documented reason.

---

## Wizard Standards

Wizards (multi-step forms) are reserved for complex first-run configuration — not for routine data entry.

**Rules:**
- Show a step indicator (horizontal stepper) at the top; it is sticky and always visible
- Validate each step before allowing the user to proceed to the next
- Allow backward navigation to any previously completed step
- Save a draft automatically on close — never lose user input mid-wizard
- Show a review step as the final step before submitting

The admin first-run setup checklist (see [onboarding.md](onboarding.md)) is a non-blocking alternative to a mandatory wizard for new accounts. Prefer the checklist over a blocking multi-step flow whenever possible.

---

## Form Layout Rules

**Field ordering:** Most important or required fields come first. Optional or supplementary fields come last.

**Column layout:**
- Mobile (all breakpoints): single-column always — no side-by-side fields on narrow viewports
- Desktop: two-column layout is permitted only for pairs of closely related short fields (e.g., start date + end date, value + confidence)
- Never put unrelated fields side-by-side in a two-column layout

**Button placement:**
- Action buttons are always at the bottom of the form
- On mobile: full-width, stacked (primary above secondary)
- On desktop: auto-width, right-aligned, primary rightmost

**Form width:** Constrain to a readable maximum width — wide open forms on large screens are harder to scan than a contained column.

---

## Edit vs. Create Parity

Use a single unified form component for both creating and editing a record.

**Rules:**
- Fields are identical between create and edit mode — no conditional field rendering based on mode
- Header copy and submit button label adapt to context ("Add Account" vs. "Save Changes")
- Edit mode shows additional actions not present in create mode: delete button, duplicate option
- Validation rules are identical in both modes

Separate create and edit components are only justified when the workflows genuinely diverge (e.g., bulk CSV import on create, single-field edit on update).

---

## Contextual Quick-Add Pattern

Reps must be able to log a call without navigating away from their current context. Two patterns serve this:

**Quick-add button on a card → modal:**
- Each account card in a list shows a "Log Call" button in its footer zone
- Tapping opens a focused modal scoped to that account
- On submit, the modal closes and the list refreshes in place
- Use this pattern for the primary quick-log action throughout the product

**Inline form expansion (within a detail view):**
- An "Add [item]" button at the bottom of a section expands an inline form in place
- The form uses compact field sizing (see [components.md](components.md))
- On submit or cancel, the form collapses back to the button
- Use this pattern for adding sub-records within a slide-over or detail view (e.g., adding an opportunity to an account)

**App-wide quick-log entry point:**
- The quick-log action is always one tap/click from anywhere in the product — see [navigation.md](navigation.md)
- On mobile, a persistent floating action button or center tab bar item serves this role

---

## Deletion Workflow

Deletion follows [destruction-safety.md](destruction-safety.md) for confirmation requirements. From a workflow standpoint:

- Delete actions are accessible from the edit form footer and from record detail views
- Delete is never the primary or default action — it is always secondary or in a menu
- After deletion, the user returns to the parent list view, which refreshes without the deleted record
- No success toast for deletion — the absence of the record in the list is the confirmation
