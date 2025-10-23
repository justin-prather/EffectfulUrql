import { defineConfig } from "vitest/config";
import { svelte } from "@sveltejs/vite-plugin-svelte";

export default defineConfig({
  plugins: [svelte()],
  test: {
    globals: true,
    environment: "happy-dom",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/**",
        "dist/**",
        "**/*.test.ts",
        "**/*.spec.ts",
        "**/vitest.config.ts",
      ],
    },
    include: ["src/**/*.{test,spec}.ts"],
  },
  resolve: {
    conditions: process.env.VITEST ? ["browser"] : undefined,
  },
});
