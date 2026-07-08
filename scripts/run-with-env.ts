import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import { parseEnv } from "node:util";

// ---------------------------------------------------------------------------
// Runs any one-off script (e.g. scripts/seed-demo-account.ts) against a named
// environment, without the script itself knowing anything about environments.
//
// "dev" bypasses Vercel entirely and just runs the script with whatever is
// already in .env.local — same as running it directly.
//
// "itg" pulls that environment's credentials fresh from Vercel for this run
// only (never cached, never written into the repo) and injects *only* those
// values into the child process's environment. The pulled file is deleted
// immediately after, success or failure.
//
// Deliberately NOT using `vercel env run`: it loads and prioritizes the
// local .env.local over whatever environment you ask it to pull, which
// silently defeats explicit targeting (confirmed empirically — every value
// it injected matched .env.local, not the requested environment). Pulling
// to an isolated file and merging it ourselves avoids that entirely.
//
// There is no "production" target: production secrets are marked Sensitive
// in Vercel, which makes them permanently unreadable outside an actual
// Vercel build/runtime (vercel env pull always returns them as empty
// strings — confirmed empirically). Scripts that need to touch production
// data must run inside a real Vercel deployment, not from a local machine.
//
// See the USAGE constant below for invocation examples (also printed on
// any argument error).
// ---------------------------------------------------------------------------

const ENVIRONMENTS = {
  dev: { vercelEnv: null },
  itg: { vercelEnv: "preview" },
} as const;

type Target = keyof typeof ENVIRONMENTS;

const USAGE = `Usage:
  pnpm run:env --target=dev scripts/seed-demo-account.ts
  pnpm run:env --target=itg scripts/seed-demo-account.ts`;

function parseArgs(argv: string[]): { target: Target; scriptArgs: string[] } {
  const [first, ...rest] = argv;
  const match = first?.match(/^--target=(.+)$/);
  const validTargets = Object.keys(ENVIRONMENTS).join(", ");

  if (!match) {
    throw new Error(`First argument must be --target=<${validTargets}>\n\n${USAGE}`);
  }
  const target = match[1] as Target;
  if (!(target in ENVIRONMENTS)) {
    throw new Error(`Unknown target "${target}". Valid targets: ${validTargets}\n\n${USAGE}`);
  }
  if (rest.length === 0) {
    throw new Error(`Provide a script to run, e.g. scripts/seed-demo-account.ts\n\n${USAGE}`);
  }
  return { target, scriptArgs: rest };
}

function run(cmd: string, args: string[], env: NodeJS.ProcessEnv): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: "inherit", env });
    child.on("error", reject);
    child.on("exit", (code) => resolve(code ?? 1));
  });
}

async function main() {
  const { target, scriptArgs } = parseArgs(process.argv.slice(2));
  const config = ENVIRONMENTS[target];

  // Local dev: no Vercel involved, just run the script as-is against .env.local.
  if (config.vercelEnv === null) {
    process.exitCode = await run(
      "npx",
      ["tsx", "--env-file=.env.local", ...scriptArgs],
      process.env
    );
    return;
  }

  const tempEnvPath = join(tmpdir(), `radio-sales-${target}-${randomUUID()}.env`);
  let code = 1;

  try {
    console.log(`Pulling "${target}" credentials from Vercel (environment: ${config.vercelEnv})...`);
    const pullCode = await run(
      "vercel",
      ["env", "pull", "--environment", config.vercelEnv, "--yes", tempEnvPath],
      process.env
    );
    if (pullCode !== 0) {
      throw new Error(`vercel env pull failed (exit code ${pullCode}).`);
    }

    const pulled = parseEnv(await readFile(tempEnvPath, "utf8"));

    console.log(`Running against "${target}"...`);
    // Only the freshly-pulled values, layered over the runner's own bare
    // process.env — .env.local is never read here, so it can't bleed in.
    code = await run("npx", ["tsx", ...scriptArgs], { ...process.env, ...pulled });
  } finally {
    await rm(tempEnvPath, { force: true });
  }

  process.exitCode = code;
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
