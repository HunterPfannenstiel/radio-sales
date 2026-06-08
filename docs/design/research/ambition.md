# Research: Ambition

**Role in this project:** Gamification & motivation layer reference. Leaderboards, streaks, and celebration moments. Their "fun rather than forced" philosophy matches the tone for private bests and percent-to-goal competition.

**Source:** Web research, help documentation (help.ambition.com), G2/Capterra/SoftwareReviews.

---

## 1. Device Priority & Responsive Logic

Ambition is **desktop-primary** with dedicated companion surfaces:

- Core application: browser-based, desktop-first
- **AmbitionTV** (Android TV / Chromecast): purpose-built for leaderboard display on office screens — "bigger the screen the better" philosophy
- **Ambition Mobile App** (iOS/Android): launched to provide "the full power of Ambition right in their pocket" — AI coaching, pipeline, and performance intelligence optimized for mobile
- Dashboard responsive re-size mode: grids automatically re-flow to fit different display sizes (individual desktop, shared TV)
- Adapts information density by context (TV wallboard = high contrast, large type; individual dashboard = dense metrics)

**Key insight:** The leaderboard experience is explicitly designed for communal TV display, not individual mobile consumption.

---

## 2. Spacing, Borders, & Typography

- Interface described as "Apple-esque" quality — refined, clean, intuitive
- Grid-based dashboard with customizable widget layout (drag to reorder)
- Leaderboard supports **card view** and **grid view**:
  - Card view: individual performer cards with name, photo/GIF, score — top-3 show animated GIFs
  - Grid view: vertical ranking list, up to 5 metrics simultaneously, color-coded columns
- Green text used for "Most Improved" indicators
- Customizable branding per organization

---

## 3. Layout, Navigation & Feel

**Navigation:** Left-side sidebar as primary navigation pattern.
- Access leaderboards: left nav → Leaderboard
- Access competitions: left nav → Competitions → Create
- Access dashboards: left nav → Dashboards tab
- Sidebar widget available with customizable content

**Filtering:** Filter icon in upper-right of leaderboard/dashboard for metric, timeframe, ranking method, and hierarchy.

**Information density:** Dashboard-focused with customizable widget layouts. Tab-based views for switching between data contexts. Some users find it "a bit cumbersome with all the features" — higher complexity than a logging-only tool.

**Leaderboard UX specifics:**
- Filtering: by metric, timeframe (daily to yearly, up to 3-year custom), ranking method (value / percent-to-target / most improved), hierarchy (employee / team / role / location / territory)
- Optional display of zero-data employees (configurable)
- Emoji support in column headers
- Ascending/descending sort

---

## 4. Loading States Lifecycle

Not explicitly documented. Real-time metric updates implied by "watch the scores and activity roll in" phrasing. TV display automatic slide cycling suggests timed refresh states. Specific visual indicators not published.

---

## 5. Error Handling

- Archive/delete workflows use a **confirmation screen** where the user reads information and confirms — modal-based pattern
- Field validation in competition creation: CSV uploads include a verification step where Ambition auto-detects field mapping and asks the user to confirm
- Toast notification pattern mentioned as standard feedback: brief non-modal message for quick feedback
- Inactive users shown as "(inactive)" in gray text within workflow manager interfaces — status indicator rather than error

---

## 6. Visual Access States

**Three-tier permission system:** Employee, Manager, Admin sets. Custom sets can only add permissions, not remove.

**Key pattern:** Ambition hides features entirely rather than showing disabled states.
- Unauthorized users don't see the action at all
- "Coaching: All Access" is off by default — the feature doesn't appear until explicitly enabled per user
- Individual dashboards visible only to the relevant employee
- No documented "grayed out" or "locked" button patterns — absence is the signal

---

## 7. First-Time Onboarding / Zero-Data States

**New user setup flow:**
1. Admin creates user → "Invite Upon Creation" option sends welcome email automatically
2. User sets password via email link
3. First action: visit user settings and set profile picture, anthem, and GIF

**Profile personalization is the first-time experience** — Ambition makes rep identity the first step, not configuration.

**Automated provisioning:** Salesforce sync or CSV upload for bulk onboarding. API calls used primarily during onboarding for metric building and user provisioning.

**Recommendation (Ambition's own):** Uncheck auto-invite during initial admin setup phase — invite reps only once the system is configured.

---

## 8. Destruction & Safety Framework

- **Archive/delete confirmation screen:** "To prevent accidental archiving, a confirmation screen will appear where you can carefully read the information provided and confirm your choice."
- Workflows auto-append "Is Deleted = False" filter — deleted records never surface in active workflows
- Inactive user labeling: when a workflow's creator or editor is no longer a licensed user, their name shows in gray with "(inactive)" — protects against orphaned modifications
- **Duplication as safe alternative:** Workflows can be duplicated rather than deleted, allowing similar setups without destroying the original
- Competitions deletable only by creator or admin/manager with explicit permissions

---

## 9. Support & Help Integration

- **Help Center:** help.ambition.com — organized by product area
- Video series: "How I Use Ambition" featuring real customer walkthroughs
- Live demo scheduling and product overview sessions available
- Support channels: phone, online, knowledge base, live webinars, in-person training, one-on-one onboarding coaching
- In-product contextual help (tooltips, popovers) implied but not explicitly documented in public materials

---

## Key Patterns Adopted

| Pattern | Where Used in Standards |
|---|---|
| Leaderboard as TV/desktop communal surface (not mobile) | Section 1 — Device Priority |
| Card view vs. grid view leaderboard layouts | Leaderboard feature design |
| Hide entirely vs. disable for restricted access | Section 6 — Access States |
| Confirmation screen with read-back before destructive action | Section 8 — Destruction & Safety |
| Profile personalization as first onboarding step | Section 7 — Onboarding (rep first-run) |
| "Fun rather than forced" gamification philosophy | Leaderboard, streaks, and personal-best design |
