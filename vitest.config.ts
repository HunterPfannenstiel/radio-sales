import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    env: { USE_LOCAL_BLOB: "true" },
    exclude: ["**/node_modules/**", "**/e2e/**"],
    // Integration tests share on-disk state via LocalBlobStore (.blob-store),
    // with no locking (see lib/blob/AGENTS.md). Running test files in
    // parallel lets one file's beforeEach wipe (or writes) race another
    // file's mid-test reads/writes to that same directory.
    fileParallelism: false,
  },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
