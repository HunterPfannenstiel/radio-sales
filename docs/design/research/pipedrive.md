# Research: Pipedrive

**Role in this project:** Opportunity progression UI reference. The stage-based pipeline (approach → uncover → present → close → service) maps directly to Pipedrive's deal stages. Their kanban-to-detail-view pattern informs opportunity history and next-step flow.

**Source:** Web research, official documentation (support.pipedrive.com, pipedrive.readme.io), design system (figma.com/@pipedrive), G2/Capterra reviews, Pipedrive engineering blog.

---

## 1. Device Priority & Responsive Logic

Pipedrive is **desktop-primary with robust mobile optimization.**

- Main interface optimized for desktop workflows
- Mobile app focused on "clarity and fewer taps to complete key actions" — significant investment in mobile UX
- Mobile usability testing achieved a **26% boost in session completion** after UI optimization
- Deal cards adapt across mobile screen sizes: minimal visual noise, only key info and actionable elements shown
- Multi-view support (kanban, list, dashboard) — users choose the layout that suits their device
- Email builder respects mobile-first responsive templates

---

## 2. Spacing, Borders, & Typography

- Figma design system published at figma.com/@pipedrive with pre-built components
- **Clean sans-serif fonts** — Arial, Helvetica, Verdana cited for web-safe email compatibility; primary UI font not published
- Email design philosophy: "clear headers, bold images, and lots of white space to make content easy to navigate"
- **Light and dark themes:** "black theme" available in Interface Preferences — noted as "preferred choice across SaaS interfaces that improves focus on content"
- **Color system (three semantic roles):**
  - Hero color: draws attention to primary content
  - Accent color: highlights headings, links
  - Call-to-action color: stands out for interactive elements (buttons, banners)
- Corner radii and specific spacing values maintained in internal design system; not publicly specified

---

## 3. Layout, Navigation & Feel

**Navigation:** Customizable left sidebar — users drag to reorder feature widgets, disable unused items, and access "More" for additional options. Default landing page is configurable per user.

**Keyboard navigation:** Two shortcut layers — letter shortcuts for quick add (deal, lead, activity) and number shortcuts for sidebar tab navigation.

**Information density:** Hierarchical — "overview first, with drill-down capabilities for detailed analysis."

**Kanban pipeline view:**
- Deal cards show: title, contact, value, label, owner (customizable field display)
- Activity icons on cards for quick access to upcoming tasks
- Default sort: next activity date
- Drag-and-drop to progress deals through stages
- Delete zone: drag card to delete button (with confirmation)
- Deal rotting (stagnation highlighting) configurable from day one

**Detail view (deal/opportunity):**
- **Deal progress bar:** visual indicator of current pipeline stage + days spent in each stage
- **Customizable sidebar sections:**
  - Summary: deal value, score, products, revenue metrics, labels, probability, expected close date, contacts, organizations
  - History: notes, activities, emails, files, documents, invoices, changelog (stage/value/label/contact updates)
  - Focus: activities, email drafts, and pinned notes needing attention to close
  - Followers management
- Hover cards on linked contacts/organizations/team members — contextual detail without opening a new view
- Inline editing via pencil icons on editable fields
- Sections reorderable by drag; fields toggleable visible/hidden; empty fields filterable

**Contextual view:** Native feature showing lead/activity details without opening a separate window — reduces navigation friction.

---

## 4. Loading States Lifecycle

- Web forms wait for all external resources (images, styles) before initializing
- Form submissions show configurable outcomes: custom thank-you message or redirect
- Real-time updates in kanban drag-and-drop
- No public documentation on skeleton screens, spinners, or specific loading indicators

---

## 5. Error Handling

**Inline validation:**
- Validation fires after hitting submit (not real-time)
- Email fields validated for proper format
- Other fields (phone, zip) can accept invalid data — limited client-side validation
- Global error message displayed inside the modal if request fails

**Error message philosophy:** "Helpful, contextual, and actionable — users must understand and be able to act on them." Plain language, no technical jargon.

**Default fallback:** *"Unexpected error: Something went wrong, please try again."*

**Common error patterns handled:** Network offline, 5xx server errors, 403 permission denied, 404 not found, validation failed, rate limit.

**Status page:** status.pipedrive.com for system health information.

---

## 6. Visual Access States

**Three-layer permission architecture:**
1. **Access Rights** — which parts of Pipedrive users can access
2. **Permission Sets** — what users can do in those areas (granular global, deal, and campaign permissions)
3. **Visibility Groups** — which data records users can see

**UI treatment:**
- Deletion options hidden or disabled for unauthorized users
- Custom field edit restrictions per permission set
- Pencil icon (edit) absent on read-only fields — absence signals read-only state
- No documented inline "insufficient permissions" messages — hidden/disabled is the pattern

---

## 7. First-Time Onboarding / Zero-Data States

**Setup checklist:** Lower-right corner widget guiding new users through:
- Email sync
- Mobile app installation
- Calendar sync
- Contact/lead import
- Pipeline configuration
- Custom field setup

**Intro video:** New users watch a 1-minute video showing how to create deals and move them through pipeline stages.

**Onboarding improvements (2026):** 21% increase in completion rate; 42% faster onboarding for teams.

**Learning resources:** Structured courses at learn.pipedrive.com; role-specific video tutorials per checklist step.

---

## 8. Destruction & Safety Framework

**Standard deletion flow:**
1. Access delete from detail view menu, pipeline view drag-to-delete zone, or list view checkbox + trash icon
2. Confirmation dialog appears — mandatory
3. Dialog warns: *"Deleting an item in Pipedrive will also delete linked historical information (e.g., invoices, notes, or attachments)"*
4. Permanent and irreversible after the recovery window

**Recovery window:** Admins can **restore deleted items within 30 days**. Associated historical data restored alongside the primary item. After 30 days: permanent deletion with no recovery.

**Permission gating:** Only users with deletion permissions enabled can access the delete function — it's not shown to others.

**Community feedback:** Users have requested "Undo" button alternatives to confirmation dialogs. Current design prioritizes data safety over streamlined workflow.

---

## 9. Support & Help Integration

**In-product:**
- Hover cards: hovering over contacts, organizations, or team members shows contextual detail inline
- Contextual view: details panel without navigation away from current screen
- App panels: marketplace apps pinnable to sidebar for integrated workflows
- Tooltips mentioned as beneficial for rapidly-evolving features

**External:**
- Knowledge base at support.pipedrive.com — searchable, organized by category
- Academy at learn.pipedrive.com — structured learning courses
- Developer documentation at pipedrive.readme.io
- Blog articles for feature guidance and best practices
- 1:1 customer success manager for accounts >$1,000/month

---

## Key Patterns Adopted

| Pattern | Where Used in Standards |
|---|---|
| Left sidebar with drag-to-reorder | Section 3 — Navigation |
| Overview first, drill-down for detail | Section 3 — Information density |
| Slide-over / contextual view for details | Section 3 — Context-shifting mechanics |
| Setup checklist widget (lower-right) | Section 7 — Admin first-run onboarding |
| Cascading deletion warning in confirmation modal | Section 8 — Destruction & Safety |
| 30-day soft-delete recovery window | Section 8 — Destruction & Safety |
| Hover cards for contextual detail | Detail view / opportunity panel design |
| Validate on blur (not keystroke) | Section 5 — Error Handling |
