# Research: Spotio

**Role in this project:** Mobile logging flow reference. Spotio is the closest analogue to the rep's daily quick-log experience — minimize taps between "open app" and "call logged."

**Source:** Web research, support documentation, App Store listing, G2/Capterra reviews.

---

## 1. Device Priority & Responsive Logic

Spotio is explicitly **mobile-first**. The entire product is built around field sales reps working from their phones.

- "3-tap methodology" — most core actions reachable within 3 taps from the home screen
- Supports landscape and portrait modes; tablet-optimized layout available
- Desktop web app exists for strategic planning (route building, territory setup) but the rep's primary surface is mobile
- Offline-first architecture: "Download My Day" preloads an area before going into the field; records sync to cloud when connection is restored

---

## 2. Spacing, Borders, & Typography

- Clean, readable typography system with font scaling for outdoor/field visibility
- Card-based, modular layouts with consistent spacing and generous whitespace
- Flat, minimal design aesthetic; clean iconography (trash, text bubble, phone)
- Color-coded pin system on map — customizable by deal stage:
  - Green = current customers
  - Yellow = promising leads
  - Red = lost leads
  - White = ghost records (owned by another user / no matching data)

---

## 3. Layout, Navigation & Feel

**Mobile:** Bottom navigation bar as primary structure. Home and "More" are default items. Up to 3 customizable nav items; items added to the nav bar are removed from the app menu to prevent duplication. Profile icon (top-left) → Chat with Support, Download My Day.

**Desktop:** Sticky header with mega menus organized by use case ("Boost Sales Activity," "Accelerate Revenue Growth," etc.)

**Map-centric interface:** Central map with color-coded pins is the default rep view. Lasso selection for grouping leads. Color legend in lower-left corner. Dynamic pin clustering on zoom.

**Role-based information:** Reps see personal metrics (quota, appointments, pipeline). Managers see team performance. Executives see revenue trends. Prevents cognitive overload.

---

## 4. Loading States Lifecycle

**Sync state indicators** (strongest documented pattern across all four products):

| State | Treatment |
|---|---|
| Waiting for connection | Blue message bar |
| Records synced successfully | Green message bar |
| No internet | Red persistent bar |
| Record generation in progress | Loading wheel animation |

**Offline/pending UI:** Two-tab interface within the sync view — "Pending" (awaiting cloud sync) and "History" (previously synced). Downloaded areas stored locally for 24 hours. On reconnection, records auto-geocode and sync across all users in real time.

---

## 5. Error Handling

- Not explicitly documented in public materials
- Confirmation dialogs exist for destructive actions (see section 8)
- Support accessible via "?" icon top-right (web) and profile menu → Chat (mobile)
- Inline validation implied by custom field configuration (required notes, specific triggers before sync)

---

## 6. Visual Access States

**Ghost record pattern:** Records owned by other users appear as white pins — the rep knows the record exists but cannot see or edit the data inside it. Managers can toggle ghost record visibility.

**Permission-based visibility:**
- Restricted Visibility users see locations of others' records but cannot work on them
- Delete options are hidden entirely for unauthorized users — no disabled button, no error message; the action simply isn't there
- Hovering over permission settings shows a tooltip explaining the permission's scope

**Rule extracted:** Hide completely is preferred over showing disabled states. Tooltip-on-hover for explaining permissions is acceptable in settings context.

---

## 7. First-Time Onboarding / Zero-Data States

**Mobile login flow:**
1. Enter phone number → "Continue"
2. 6-digit SMS/email code (auto-pastes from SMS)
3. Countdown timer for resend
4. Welcome screen confirms user's name → "Next"

The name confirmation step is a trust signal — proves the right account was found before proceeding.

**Onboarding resources:** Role-specific Quick Start Guides (Admin 101, Manager 101, Rep 101) available via "?" icon. Spotio U on-demand video courses per role.

**Zero-data state patterns:** Not explicitly documented. Map-based interface provides geographic context even before any leads are added.

---

## 8. Destruction & Safety Framework

**Mobile:** Tap trash can icon → modal requires typing "DELETE" in all capitals → confirms with explicit permanence warning: *"Deleting a record is permanent and cannot be reversed."*

**Web:** Pencil icon → trash can → pop-up confirmation with "Delete" button.

**Scope warning:** Modal clearly states what is deleted: the record, all contact details, all associated activities, activity history, and pauses any Autoplay sequences.

**No undo/restore capability.** The type-to-confirm pattern carries the full safety burden. Completed activities cannot be deleted.

---

## 9. Support & Help Integration

**Mobile:** Profile icon (top-left) → "Chat with Support" → choose live chat or Knowledge Base search.

**Web:** "?" icon (top-right) → "Open Chat" → same two options.

**Support portal (support.spotio.com):** Organized by Quick Start Guides, Knowledge Base, Getting Started paths (Admin / Manager / Rep), and Quick Start Videos. Role-based documentation keeps reps from wading through admin content.

**Contact:** support@spotio.com, in-app live chat.

---

## Key Patterns Adopted

| Pattern | Where Used in Standards |
|---|---|
| 3-tap methodology | Section 1 — mobile quick-log design target |
| Blue/green/red sync indicators | Section 4 — Loading States |
| Hide > Disable for restricted actions | Section 6 — Access States |
| Name confirmation in login flow | Section 7 — Onboarding |
| Type "DELETE" for high-stakes destruction | Section 8 — Destruction & Safety |
| "?" icon top-right + profile menu chat | Section 9 — Help Integration |
