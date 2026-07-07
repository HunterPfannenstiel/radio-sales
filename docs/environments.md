# Environment Strategy

## 1. Overview

This document describes how we move a feature from local development to production, and the infrastructure that supports testing it along the way — without waiting until it merges to `main` to see it running for real.

### The three tiers

| Tier | Branch | Purpose |
|---|---|---|
| **Feature** | `feature/*` | Where a single feature or fix is developed and first tested in a deployed (non-local) environment. |
| **Integration** | `integration` | Where merged features are tested together before being considered for release. Acts as a staging ground and a stable link for broader review. |
| **Production** | `main` | What real users interact with. |

### Core principle: shared, disposable test persistence

Feature branches and the integration branch **share one Supabase project** as their persistence layer. This project is understood to be freely wipeable and mutable at any time — it holds no data that needs to survive, and no one should treat data in it as durable. This is a deliberate simplification: rather than provisioning isolated storage per feature branch, we accept that concurrently-tested branches share state, in exchange for a much simpler credential and infrastructure story. Production has its own, separate Supabase project, which this process never touches.

### How this is enacted

Two platforms do the actual work:

- **Vercel** builds and deploys every push automatically. Which branch you push to determines which deployment type you get (Production vs. Preview) and which set of credentials get wired in — this is automatic, not something engineers configure per branch.
- **Supabase** hosts two projects: one production project, and one shared test project that all Feature and Integration deployments connect to.

The sections that follow cover each part of this in detail: how Vercel decides what kind of deployment a push produces, how credentials get matched to the right environment, specifics of the shared test persistence layer, how the integration branch is distinguished for convenience, and — last, once finalized — how we handle schema changes across a shared test database.

## 2. Environment Tiers & Vercel Mapping

Vercel determines deployment type using one setting: **Project Settings → Environments → Production**, which tracks the production branch (set to `main`).

- A push to `main` → **Production deployment**, published to the production domain(s).
- A push to *any other branch* (`feature/*`, `integration`, etc.) → **Preview deployment**, published to a unique, auto-generated URL scoped to that push.

This check happens automatically on every push — no per-branch registration is required. `integration` is not special-cased by Vercel; it is a Preview deployment like any feature branch (Section 5 covers how we give it a stable, memorable URL on top of this).

### Deployment identity

Each build has access to environment variables that identify what it is:

| Variable | Meaning |
|---|---|
| `VERCEL_ENV` | `production`, `preview`, or `development` |
| `VERCEL_GIT_COMMIT_REF` | The branch name that triggered the build |
| `VERCEL_URL` | The unique URL of this specific deployment |

### A note on "Development"

Vercel's `Development` environment is *not* a deployment type — nothing you push ever becomes a Development deployment. It's simply a set of environment variable values used when running the app locally (via `vercel env pull` or `vercel dev`). It's mentioned here only to avoid confusing it with Preview, which is the one relevant to "push a branch, get a live URL."

## 3. Credential Management

Credentials are matched to the right environment by **Vercel's environment scoping on environment variables**, not by application code. In the project's **Environment Variables** settings, each variable is tagged with the environment(s) it applies to: **Production**, **Preview**, or **Development**.

Practically, this means:

- The same variable name (e.g. `SUPABASE_URL`, `SUPABASE_SECRET_KEY`) is defined **twice** — once scoped to Production, pointing at the production Supabase project; once scoped to Preview, pointing at the shared test Supabase project.
- Application code never branches on environment (no `if (env === 'preview')` logic). It just reads `process.env.SUPABASE_URL` and gets whichever value Vercel injected for that deployment.
- Because Preview-scoped variables apply to **all** non-production branches by default, every feature branch and the integration branch automatically get the same test credentials with zero per-branch setup.

### Where this can be overridden later

Vercel supports scoping a variable to a specific branch or branch pattern within Preview, and separately supports **Custom Environments** for defining a named environment (e.g. "Integration") distinct from generic Preview. Neither is in use today — they're documented here only as the mechanism to reach for if Integration or a specific feature branch ever needs to diverge from the shared Preview configuration.

## 4. Persistence Layer

Feature branches and the integration branch all connect to **one shared Supabase project**, dedicated entirely to testing. It holds no data that needs to survive and can be wiped or modified at any time without approval. Production has a completely separate Supabase project that this shared project never interacts with.

### Why shared instead of isolated

Supabase supports fully isolated, ephemeral database instances per branch (see "Branching," noted below), but this setup deliberately uses one shared instance instead. The tradeoff: simpler credential management (one fixed set of test credentials, not one per branch) and no per-branch provisioning/teardown to manage — at the cost of feature branches not being isolated from each other. Two people testing conflicting changes against the shared project at the same time can affect one another's results. This is accepted as a reasonable tradeoff for now given the team's current size and workflow.

### Connection pooling

This app must use Supabase's pooled connection string (**Supavisor**, port `6543`, transaction mode) rather than the direct connection (port `5432`). This isn't specific to multiple people testing concurrently — it applies regardless of team size. Serverless functions (what every Vercel deployment runs as) open a new database connection per invocation instead of reusing one from a long-lived pool. Even a single developer working alone can trigger several concurrent invocations at once — a page firing a handful of parallel data-fetching calls, a couple of open browser tabs, a redeploy where the outgoing instance is still serving requests while the new one spins up — and the direct connection limit on smaller compute tiers is low enough for that to add up. Since Supabase already exposes the pooled connection string for every project at no extra setup cost, there's no real reason not to use it.

### Key handling

The same discipline around Supabase keys applies here as in production, just with a wider blast radius if violated: the secret key (`SUPABASE_SECRET_KEY`) bypasses row-level security and must never be exposed client-side. Because this project is shared, a leaked key here exposes every in-flight feature branch's test data at once, not just one deployment. We use Supabase's newer Secret key type (not the legacy `service_role` JWT) specifically because it can be revoked individually if leaked, without rotating the whole project's JWT secret.

### Availability

The shared test project should be kept on a tier that does not auto-pause due to inactivity, since testers may hit a feature or integration URL at any time without warning.

## 5. Integration Branch

Vercel does not treat `integration` differently from any other non-production branch — it produces a normal Preview deployment, using the same shared credentials and shared test persistence layer described in Sections 3 and 4. There is no special registration step to make a branch "the integration branch" from Vercel's perspective; it's the same mechanism as any `feature/*` branch.

### Stable URL

The one practical difference we impose: `integration` is assigned a fixed, memorable domain (e.g. `integration.yourapp.com`) via Vercel's Domains settings, bound specifically to that branch. This means the URL always resolves to the latest `integration` deployment, so anyone reviewing it — teammates, stakeholders — has one link that's always current, rather than needing to track down a fresh, auto-generated preview URL every time new commits land. Feature branches are not given this treatment; their auto-generated preview URLs are sufficient since they're typically shared short-term, per PR.
