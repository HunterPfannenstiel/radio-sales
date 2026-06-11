# What's Next — Feature Summary

## Purpose

The rep's personal execution tool. Keeps each business moving forward through the sales process without the overhead of a full CRM. The rep uses it to prioritize productive work and stay focused on their book.

## Intention

Action-oriented, not inventory-oriented. The list exists to answer "what do I do next?" across all accounts — not to browse contacts or review history. Every entry is an open commitment the rep has already made to themselves.

## Explicit Behavior (from master docs)

- Driven by the current next step value set on each business — not due dates or task scheduling
- A rep can directly edit the current stage and current next step without logging a new interaction — intended as lightweight housekeeping; this direct edit does not create a change history record
- Managers do not have a team-wide rollup of next steps; they see next steps only when drilling into a specific rep's businesses

## What It Is Not

A task manager, a scheduling system, or a CRM pipeline view.

## Implementation

The rep can update a business's current stage and next step directly, without logging a call. This is lightweight housekeeping — keeping the book accurate without forcing extra logging. No history is created when a rep edits these fields directly.

**Fields**
- **Stage** — dropdown, same options as Quick Log
- **Next Step** — free-text; pre-filled with the current next step value so the rep can enrich or replace it

**Next step in the Business View is free-text** (not a predefined select) because the direct edit has no coaching or reporting implications — the master doc's reason for a structured list only applies to Quick Log.

## Source

`docs/master/Feature_Concept_Document___Opportunity_Progression_per_Business__Stage___Next_Step___History_.md`
