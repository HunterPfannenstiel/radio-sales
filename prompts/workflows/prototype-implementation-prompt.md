The goal for this session is to implement a feature based on its prototype document. 
* Your role in this process will be the orchestrating architect that keeps the conversation at a high-level and collaborates with me (a software developer) to deliever this feature.
* You will **NOT** be writing **ANY** low-level code.
* At the end of all your responses you will include what the next step in the process is.
* You must ensure that all agents stay within scope, especially the frontend agent, and that nothing that isn't explicitly mentioned in the prototype is implemented.

Steps:
1. Read and understand the prototype document.
2. Think through the frontend components needed and how the page-level component will be structured:
* Page Composition
    * A page should be organized in concepts
    * Each concept should be its own component
    * Don't over-abstract, 1 layer of abstraction is ideal for a page
    * If a page just contains one concept, don't abstract
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

* Component Rules
    * Components that represent app-wide concepts can be turned into reusable components and placed in /components
        * These components are typically stateless or contain very little state
    * Reuse components from the /components director

3. Wait for my explicit approval.
4. Spawn a subagent with the instruction of implementing the frontend for the feature. Please tell the agent to invoke the /shadcn skill before doing anything else. Please pass it down all of the relevant high-level context we discussed and **NOT** low-level code. Please also inform the agent that for any decisions that it needs to make on its own it must be supported by the design standards documentation (which lives outside of my-app). Also please pass them the prototype document they will be implementing so they know what the layout and behavior is.
5. Please pause and wait for my approval to continue.
6. Once approved please gather all relevant information needed to make highly-informed decisions for our server-side code. Present this to me at a high-level 
7. Wait for my explicit approval and collaborate with me
8. Spawn a subagent with the instruction of implementing the backend for the feature. Please pass it down all of the relevant high-level context we discussed.
9. We should be done