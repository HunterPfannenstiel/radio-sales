# Global UX/UI Application Standards Research

## Category A: Visual Foundations & Device Guardrails

### 1. Device Priority & Responsive Logic
* Device Dominance Decision: Is this application Primary Desktop or Primary Mobile based on user environment?
* Desktop Grid Standards: Define the base artboard width and column layout.
* Mobile Adaptation Logic: Document how multi-column desktop layouts collapse safely into mobile views.
* Touch Target Minimums: Confirm all clickable components on mobile meet the absolute minimum size grid.

### 2. Spacing, Borders, & Typography
* The Spatial Grid: Define the base scaling unit for all margins, padding, and gaps.
* Corner Radii Tokens: Standardize card, button, and input roundness to ensure aesthetic consistency.
* Typography Scale: Document the chosen font family and the rigid hierarchy scale for H1 down to microcopy.
* Accessibility (WCAG) Contrast Ratios: Verify that primary text colors meet a minimum 4.5:1 contrast ratio against default backgrounds.

### 3. Color System & Token Library
* Surface Palette: Define the hierarchy of background colors (page, card, elevated surface) as named tokens.
* Border Tokens: Standardize border colors for default, hover, focus, and disabled states.
* Primary & Accent Colors: Establish the brand primary and any secondary accent with their light/dark variants.
* Semantic State Colors: Lock in the colors for success, warning, error, and informational states used across all components.

### 4. Iconography
* Icon Library: The application uses Lucide React (shadcn default). No additional icon libraries should be introduced.
* Icon Sizing Scale: Define the standard icon sizes (e.g., 16px, 20px, 24px) and when each is appropriate.
* Style Rules: Establish when to use outline vs. filled variants and the rules for active/selected state treatment.

---

## Category B: Behavioral Frameworks

### 5. Layout, Navigation, & Feel
* Navigation Archetype: Determine if the app utilizes a persistent left-hand sidebar, top navigation bar, or another standard layout.
* The Feel & Density Standard: Define the spacing density based on data usage requirements.
* Context Shifting Mechanics: Define when a secondary task should use a Centered Modal versus a Slide-over Panel.

### 6. Loading States Lifecycle
* Full Page Loads: Document standard pattern for full page content generation.
* Form Submissions: Set behavior guidelines for active buttons during a submit action to prevent accidental duplicate actions.
* Content Refresh: Define how lazy-loading data or continuous scrolling behaves.

### 7. Motion & Animation
* Duration & Easing Tokens: Define the standard transition durations (e.g., 150ms, 250ms) and easing curves for enter/exit transitions.
* Skeleton Policy: Establish when skeleton screens are used versus spinners versus no visible loader at all.
* Reduce-Motion Rule: Define the fallback behavior when the user has `prefers-reduced-motion` enabled.

### 8. Error Handling Framework
* Client-Side / Inline Errors: Define UI feedback for immediate browser-side errors.
* Form Submission Errors: Define feedback for errors caught by the server after processing.
* 500 Server / Network Errors: Design the full-screen failure page fallback rule for severe crashes or lost connectivity.

---

## Category C: Feature Usability Baselines
*Action: Research and establish application-wide design patterns for the following items. Each individual feature log will look to these rules in Step 0. Note that this is not an exhaustive list, but a bare minimum requirement to guarantee basic feature usability.*

### 9. Visual Access States
* Rule Definition: Define how the interface explicitly and visually signals that a user is restricted or unauthorized from performing an action (e.g., hidden completely, rendered as a disabled greyed-out button, or locked with a badge icon).

### 10. First-Time Onboarding (Zero-Data States)
* Rule Definition: Create the default layout template, instructional microcopy patterns, and empty-state graphics used when a feature has no content or history to display yet.

### 11. Destruction & Safety Framework
* Rule Definition: Standardize how the user is protected from high-risk or dangerous human errors (e.g., permanent deletion, resetting data) through a mandatory confirmation pattern or a temporary undo window.

### 12. Support & Help Integration
* Rule Definition: Establish the standard spatial placement, icon styling, and interface pattern (e.g., tooltips, popovers, or direct inline links) for self-service knowledge base documentation.

---

## Category D: Component Standards
*Action: Define the base anatomy, variants, and composition patterns for shared UI components and workflows. Individual feature designs inherit from these rather than inventing their own.*

### 13. Core Component Library
* Card Anatomy: Define the standard card structure — header, body, and footer zones, border treatment, and elevation/shadow levels.
* Button Tier Hierarchy: Establish the visual hierarchy for primary, secondary, ghost, and destructive button variants.
* Form Input Standards: Standardize text inputs, selects, checkboxes, and radio buttons — including label placement, helper text, and character count positioning.
* Empty State Template: Define the layout, icon/illustration treatment, headline copy pattern, and CTA placement for zero-data views.

### 14. CRUD Workflow Patterns
* Creation Pattern Decision Tree: Define when to use a full-page wizard (multi-step, complex entities), a single-page form (moderate fields), a slide-over panel (quick-add), or inline editing (simple field changes).
* Wizard Standards: For multi-step flows, establish progress indicator style, step validation rules, and draft/save behavior.
* Form Layout Rules: Define field ordering conventions, required vs. optional field treatment, and the maximum number of fields before a layout must be split or stepped.
* Edit vs. Create Parity: Establish whether edit forms reuse the same layout as creation forms or deviate, and when deviation is justified.
* Contextual Quick-Add: Define the pattern for adding child entities inline (e.g., adding a contact from within an account record) without leaving the parent context.
