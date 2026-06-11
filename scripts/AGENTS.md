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
* Wipe the existing store then write the entire store