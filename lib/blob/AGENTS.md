# Blob

This directory stores all of the functionality necessary to persist data for the application.

# Phase 1 Rules
* Persistence is one JSON file per rep (`reps/{repId}/data.json`) plus one shared, small index file for login (`reps/index.json`) — no locking or transactions
* Performance is of no concern

## Schema Structuring - **One JSON file per rep, organized sensibly**
* The schema that is created here will be discarded when phase 1 is complete
* The use of dictionaries and arrays can be used to help denormalize data but spending time thinking about performant schema design should be kept to an absolute minimum
* Prioritize an easy and obvious design over one that is highly thought out and performant
* This schema should be stored in `schema.ts` and should be the only instance of the schema. All other files should reference this file.
* Never duplicate enum values — define them once as a `const` array with a derived type (e.g. `export const CALL_OUTCOMES = ["yes", "no", "pending"] as const; export type CallOutcome = typeof CALL_OUTCOMES[number]`) and import them wherever they are needed.

## Usage
* Always import the `blob` singleton from `lib/blob` — never instantiate a store class directly — so the correct persistence layer is selected via environment