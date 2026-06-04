# Storage

This directory stores all of the functionality necessary to persist data for phase 0 of the application.

# Phase 0 - **Extreme Prototyping**
* The persistence layer of the application will be JSON storage only
* Performance is of no concern

## Structure - **One JSON file organized sensibly**
* The schema that is created here will be discarded when phase 0 is complete
* The use of dictionaries and arrays can be used to help denormalize data but spending time thinking about performant schema design should be kept to an absolute minimum
* Prioritize an easy and obvious design over one that is highly thought out and performant