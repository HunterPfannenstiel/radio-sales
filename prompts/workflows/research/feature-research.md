# Feature-Specific UX/UI Research Log

## Feature Name:

## Step 0: Global Standards Inheritance
*Action: Review the Global UX/UI Application Standards document before beginning. Identify the foundational behaviors this feature will automatically inherit to prevent redundant research and ensure total usability.*

* Layout & Frame: Identify the established app-wide container pattern this feature will occupy (e.g., standard panel, drawer, or modal layout).
* Styling & Tokens: Confirm the global typography scales, semantic color rules, spacing intervals, and corner radii tokens that apply to this component.
* System Feedback: Reference the global rules for loading lifecycles, content refresh behaviors, and success messaging locations.
* Guardrail Behavior: Reference the established system-wide frameworks for displaying client-side inline errors, form submission rejections, and server failures.
* Visual Access States: Reference the global design rule for how restricted or unauthorized actions are displayed visually (e.g., completely hidden, greyed out, or badged with a lock icon).
* First-Time Onboarding: Identify the global empty-state framework and educational tooltip patterns used to guide users who have no data yet.
* Destruction & Safety: Reference the system-wide standards for dangerous actions (e.g., confirmation modals or temporary undo states).
* Support Integration: Confirm the standard placement and style for inline help icons, tooltips, or documentation links.

## Step 1: The Grounding Phase

### Action A: The Ultimate Human Experience
"If this feature is a massive success, the user will be able to accomplish [Enter the Core Action] smoothly, while feeling [Enter Positive Emotion] and completely avoiding [Enter Negative Emotion]."

### Action B: Baseline Journey Context
* Before using this feature, the user is:
* After using this feature, the user will instantly transition to:

### Action C: The Pleasantness Benchmark
* Our Pleasantness Criteria:

## Step 2: Competitor UI Deconstruction (Influenced by Step 1)
*Action: Examine competitors executing this exact feature to analyze their interface patterns. Use Step 1 to ground your research and not get sidetracked.*

* The Entry Point: Where do they place the primary button or path to trigger this feature? Is it front-and-center or contextually hidden?
* The Core Interface Pattern: What overarching layout style did they choose to present this data?
* The Aha! Moment: Identify the specific point in their user flow that feels the most satisfying, smooth, or clear.

## Step 3: Competitor Forensic Mining
* Clutter & Confusion Keywords: Search for competitor names alongside terms like confusing, hidden, or clunky specifically relating to this feature area.
* User Restrictions: Identify where users feel limited by the current market standard.
* Visual Noise Pitfalls: Note if users complain that a competitor's screen feels too busy or overwhelming.

## Step 4: Low-Fidelity Wireframing & Behavior Specs
* Wireframe Concept Sketch Attached:
* Behavior Annotation Check: Did you explicitly note how the UI transitions to Global Loading States on save?
* Behavior Annotation Check: Did you explicitly note how the UI surfaces a Global Error State if an action fails?
* Behavior Annotation Check: Did you map how the interface opens and dismisses back into the Baseline Journey Context from Step 1?
