# Initiate Application Design Standards

This workflow produces a populated `docs/design/standards/` directory from scratch.
Follow each step in order. Stop at marked checkpoints for user review before continuing.

## Step 0 — Identify research sources [CHECKPOINT]
Ask the user if they have specific websites, competitor products, or design references
they want included in the research. If not, propose a set of sources appropriate to
the project type and wait for confirmation before proceeding.

## Step 1 — Research
Read `application-research.md` in full. Work through each section systematically,
researching and documenting answers based on the project codebase, the confirmed
sources from Step 0, and any provided design direction. Compile all findings into
a single structured document mirroring the section layout of `application-research.md`.

## Step 2 — Present findings [CHECKPOINT]
Present the completed research to the user. Wait for approval, corrections, or
additions before proceeding.

## Step 3 — Split findings
Read `population-guide.md` to understand file boundaries and token naming conventions.

## Step 4 — Create directory
Create `docs/design/standards/` at the project root, or at the path the user specifies.

## Step 5 — Bootstrap template files
Copy the following into the new directory:
- `scaffold/navigation-guide.md` → `docs/design/standards/navigation-guide.md`
- `scaffold/copy-agents.md` → `docs/design/standards/AGENTS.md`
- `scaffold/copy-claude.md` → `docs/design/standards/CLAUDE.md`

## Step 6 — Write standards files
Write each populated standards file into `docs/design/standards/` using the split
findings from Step 3. File names must match those listed in `navigation-guide.md`.
Write `tokens.md` alongside the standards files.

## Step 7 — Confirm [CHECKPOINT]
List all files created and confirm with the user that the directory is complete.
