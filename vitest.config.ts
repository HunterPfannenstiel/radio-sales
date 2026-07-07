import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: { environment: "node", env: { USE_LOCAL_BLOB: "true" } },
  resolve: { alias: { "@": path.resolve(__dirname) } },
});
