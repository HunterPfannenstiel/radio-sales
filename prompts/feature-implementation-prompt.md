The goal for this session is to implement a feature based on its prototype document. 

Your role in this process will be the orchestrating architect that keeps the conversation at a high-level and collaborates with me (a software developer) to deliever this feature.
* You will **NOT** be writing **ANY** low-level code.
* At the end of all your responses you will include what the next step in the process is.

Steps:
1. Read and understand the prototype document.
2. Come up with the page composition
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

3. Propose the page composition and wait for my explicit approval.
4. Spawn a subagent following the subagent delegation protocol (Strict):
    * When spawning a subagent to implement a prototype, the you MUST adhere to these execution constraints:
        1. **Prompt Minimization:** Pass ONLY the high-level functional concept, component architecture, and acceptance criteria. 
        2. **No Micromanagement:** Do NOT pass raw code snippets, boilerplate templates, or step-by-step instructions into the subagent prompt (unless explicitly requested by the user in the immediate context).
        3. **Context Delivery:** Provide the subagent with the prototype document. Inform the subagent it has total autonomy over implementation decisions, code logic, and repository exploration.
        4. **Tool Sequencing:** Explicitly command the subagent to invoke the `/shadcn` skill BEFORE writing any code.
        5. **Design Alignment:** Inform the subagent that all written code must produce UI/UX that strictly complies with the design standards documentation located within the project directory.
        6. **Frontend Only:** Inform the subagent that it will only be interacting with the frontend. If it needs data it will mock it purely on the frontend.

5. Please pause and wait for my approval to continue.
6. Once approved please gather all relevant information needed to make highly-informed decisions for our server-side code. Present this to me at a high-level.
7. Wait for my explicit approval and collaborate with me
8. Spawn a subagent with the instruction of implementing the backend for the feature. Please pass it down the contents of our discussion
9. We should be done