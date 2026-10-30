import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      include: ["tests/unit/**/*.test.{ts,tsx}"],
      environment: "node",
      // Vitest 5 caches transformed modules across runs by file content, which froze
      // import.meta.glob results: new component folders were invisible to the registry.
      fsModuleCache: false,
    },
  }),
);
