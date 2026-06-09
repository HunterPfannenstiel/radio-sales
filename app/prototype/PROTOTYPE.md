# Prototype Design Document

## What it is
- Theory, **not** practice
    - The equivalent of your database being one JSON file instead of a fault-tolerent SQL database
- Low-fidelity version of an idea that focuses primarily on high-level structures such as component layout and feature parts

## What it is **NOT**
- A production-grade feature that can be copy-pasted into the application
- Parts that are architected with integrity

## How to use it
- Like the individual pieces of a piece of furniture: everything is there, just not cohesive and functional
- Understanding the intent and layout of a feature

## Rules
- Shadcn components or components from `/components` only
    - If a particular component doesn't exist yet, download it from shadcn
- Visuals only, very minimal functionality and wiring
    - Focus on the fundamental pieces that are core to the feature's survival
    - For instance: instead of having a nav bar button open a bottom sheet, have a component for the nav bar and a component for the bottom sheet contents.
- Each concept of the feature gets its own file/folder and is fully self-contained
- All logic for a concept must be in a hook in a separate file
- All intended behavior should be documented in a comment block at the top of the component. Inline comments only for element-level behavior that can't be inferred from the JSX.
    - This is how an implementation agent will answer "Is this what they want or not?"
- Page.tsx renders every concept individually. Do not use Dialog, Sheet, Popover, or any overlay wrapper — render the inner content as a plain element.