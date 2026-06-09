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
- Raw HTML
- No external dependencies
- Visuals only, very minimal functionality and wiring
    - Focus on the fundamental pieces that are core to the feature's survival
    - For instance: instead of having a nav bar button open a bottom sheet, have a component for the nav bar and a component for the bottom sheet contents.
- Each concept of the feature gets its own file/folder and is fully self-contained
- All logic for a concept must be in a hook in a separate file
    - The hooks are purely there to convey intent which is done via their API
        - No implementation agent should ever need to read a hook file
- All intended behavior should be placed in comments as close to their source as possible
    - This is how an implementation agent will answer "Is this what they want or not?"
- Page.tsx bundles all of the concepts together for display purposes only