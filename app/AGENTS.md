# Pages

## Standards
* Use shadcn components
* Raw HTML is acceptable for structural and layout elements
* app/globals.css must be used for styling
    * **NEVER** hardcode the following: colors, border radii, and typography

### Page Composition
* A page should be organized in concepts
* Each concept should be its own component
* Don't over-abstract, 1 layer of abstraction is ideal for a page
* If a page just contains one concept don't abstract
* State that is shared by at least two components can be stored at the page level

Example Page Composition:
```tsx
<>
    <RaceSelector />
    <RaceInfo />
    <PredictionGrid />
    <PropSelector />
    <SubmitButton />
</>
```

### Component Rules
* Components that represent app-wide concepts can be turned into reusable components and placed in /components
    * These components are typically stateless or contain very little state
* Reuse components from the /components directory

## Phase 0 Rules
* You must only use client components
* All network interactions must flow through /hooks/useFetch and /hooks/useRequest