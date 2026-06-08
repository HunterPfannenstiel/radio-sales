# Destruction & Safety

Standards for protecting users from high-risk or irreversible actions. Modal and dialog anatomy belongs in [components.md](components.md).

---

## Rule: No One-Click Delete

Every permanent destructive action requires at least one explicit confirmation step. No exceptions, regardless of how minor the action seems.

---

## Standard Confirmation Pattern

Used for all destructive actions that affect a single record or item:

1. User triggers the delete action (button, menu item, or drag target)
2. A centered confirmation modal appears — see [navigation.md](navigation.md) for context-switching rules
3. The modal body states what will be deleted and **lists cascading data**: *"This will also delete 3 activities and 1 note."*
4. Two buttons only:
   - **Cancel** — default focus, neutral styling, closes the modal
   - **Delete [Item Name]** — `--color-status-warning` background, explicit label naming what is being deleted

**Rule:** The destructive button label must name the thing being deleted ("Delete Call", "Delete Opportunity") — never just "Delete" or "Confirm."

---

## Type-to-Confirm Threshold

Reserved for actions that are especially broad or irreversible: deleting an account, a territory, or resetting an entire period's data.

For these actions, the Delete button is disabled until the user types a confirmation phrase (displayed in the modal, never a riddle). Once the phrase matches, the button becomes active.

Do not apply type-to-confirm to individual record deletions — it creates unnecessary friction for routine cleanup.

---

## Recovery Window Policy

Where feasible, implement soft-delete with a 30-day admin recovery window. After 30 days the record is permanently removed.

When a soft-delete is in place, the confirmation modal should communicate it: *"Your admin can restore this within 30 days."*

When a deletion is immediately permanent, the modal must make this explicit: *"This cannot be undone."*

---

## Permission Gating

Destructive actions are only shown to users with deletion permissions. Users without permission do not see the delete button at all — see [access-states.md](access-states.md).
