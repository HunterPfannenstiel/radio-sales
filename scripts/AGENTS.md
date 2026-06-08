# Scripts

## Runtime Limitations

### TypeScript
* No @/... path aliases — use relative imports (e.g. ../../lib/db) in all script files
* No TypeScript enums — use const objects instead (const Role = { Admin: 'admin' } as const)
* No namespace or module declarations
* Type-only imports must use import type syntax (not just stripped automatically in all cases)

### Environment
* Requires Node.js 22.6+ — check with node --version if scripts fail to run at all
* .env.local is loaded via --env-file, so variables must be in that file (not .env)
* process.env types won't be augmented — cast or assert as needed

## Seed Scripts

### Standards
* Define data in constants at the top of the file, don't inline anything
* Wipe existing data at the start of the script
    * Accessing the persistence classes is acceptable in this case

### Phase 0 Rules
* All data mutations must be performed using the mutators defined in /server/mutations
    * If certain functionality is not supported by the mutations you are allowed to create a seed mutation where the name of the mutation is prefixed with 'Seed' and the mutation is placed under a 'seed' property for the aggregated mutation object. Inform the user that this specific mutation was created before continuing.