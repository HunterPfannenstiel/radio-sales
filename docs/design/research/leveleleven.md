# Research: LevelEleven

**Role in this project:** Dashboard & pacing concept reference. LevelEleven's core UX insight — "am I ahead or behind right now?" answered with a single color-coded glance — is the direct antecedent to the flight deck dashboard concept.

**Source:** Web research, support documentation (support.leveleleven.com), G2/Capterra reviews.

---

## 1. Device Priority & Responsive Logic

LevelEleven is **desktop-primary**. It is a native Salesforce application accessed via browser.

- Responsive web design for tablet/phone viewing, but the experience differs: *"The use is not the same on a phone as on a computer"*
- LeaderTV feature uses responsive design for scaling to large TV displays
- No dedicated native mobile app — mobile access is via responsive web

---

## 2. Spacing, Borders, & Typography

- Clean sans-serif typography throughout; no specific typeface published
- **Critical color-coded pacing palette:**

| Color | Meaning |
|---|---|
| Red | Behind pace on monthly goal |
| Blue | On pace with target |
| Green | Ahead of pace |
| Teal | Goal achieved |

- Dark navy/charcoal backgrounds with white text on marketing site; teal/turquoise accents for CTAs and interactive elements
- Generous whitespace between sections; consistent padding patterns

---

## 3. Layout, Navigation & Feel

**Navigation:** Sticky header with expandable mega-menus. Role-based navigation options (Sales Managers, CRO, RevOps, etc.) — users see paths relevant to their role.

**Salesforce integration:** Mini leaderboard widget displayed throughout Salesforce for persistent ambient visibility.

**Information density:** High — up to 20 trackable metrics (4 primary + 16 secondary). Customizable metric selection reduces cognitive load by letting users choose what's relevant. Visual signaling prioritized over raw number display.

**Feel:** "Very comprehensive" and "nice" per user reviews, though some describe it as "dated" compared to modern SaaS. The core value is instant comprehension, not visual polish.

---

## 4. Loading States Lifecycle

Not documented in public materials. Real-time data refresh is implied by the live leaderboard and pacing features. Requires direct product access to observe actual patterns.

---

## 5. Error Handling

Not documented in public materials. As a Salesforce-native app, error handling likely follows Salesforce Lightning Design System conventions — but this is unconfirmed.

---

## 6. Visual Access States

- Role-based navigation means unauthorized sections are not rendered for the user's role
- "Grant User Access to Scorecard" documented in support; specific visual treatment (hidden vs. disabled) not publicly described
- Likely follows Salesforce conventions for disabled states

---

## 7. First-Time Onboarding / Zero-Data States

- Role-specific Getting Started guides: "Getting Started with Scorecard," "Getting to Know Scorecard," "Getting Started with LevelEleven Coach"
- Setup wizards for scorecard installation and configuration
- Zero-data state visuals not documented publicly

---

## 8. Destruction & Safety Framework

Not documented in public materials. Contests and scorecards can be deleted; specific confirmation pattern unknown. Requires direct product access to observe.

---

## 9. Support & Help Integration

- **Help Center:** support.leveleleven.com — structured, searchable knowledge base
- Organized by topic: Scorecard setup, Contests/Leaderboards, Coaching tools, User access, Integrations, FAQ
- Role-based Getting Started guides (manager-specific)
- Changelog and product update tracking available
- Specific in-app help placement (tooltips, buttons) not documented

---

## Key Patterns Adopted

| Pattern | Where Used in Standards |
|---|---|
| Red/Blue/Green/Teal pacing color palette | Section 2 — Status color system |
| Color-coded at-a-glance rep roster | Manager dashboard design direction |
| Role-based navigation visibility | Section 3 — Navigation feel |
| Metric customization to reduce cognitive load | Section 3 — Information density |
