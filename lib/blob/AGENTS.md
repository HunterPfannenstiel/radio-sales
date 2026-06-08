# Blob

This directory stores all of the functionality necessary to persist data for the application.

# Phase 0 Rules
* You must use a single JSON file as the application's only persistence layer
* Performance is of no concern

## Schema Structuring - **One JSON file organized sensibly**
* The schema that is created here will be discarded when phase 0 is complete
* The use of dictionaries and arrays can be used to help denormalize data but spending time thinking about performant schema design should be kept to an absolute minimum
* Prioritize an easy and obvious design over one that is highly thought out and performant
* This schema should be stored in `schema.ts` and should be the only instance of the schema. All other files should reference this file.