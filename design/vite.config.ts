import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { writeUsage } from "./scripts/build-usage";

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));
const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

/** Keeps "where used" current while screens are edited; `npm run usage` builds it at start. */
function whereUsed(): Plugin {
  const root = fileURLToPath(new URL(".", import.meta.url));
  const prototype = src("prototype/");
  return {
    name: "where-used",
    hotUpdate({ file }) {
      if (this.environment.name === "client" && file.startsWith(prototype)) writeUsage(root);
    },
  };
}

export default defineConfig({
  plugins: [react(), whereUsed()],
  define: {
    __DESIGN_VERSION__: JSON.stringify(version),
  },
  resolve: {
    alias: {
      "@tokens": src("tokens"),
      "@icons": src("icons"),
      "@components": src("components"),
      "@workspace": src("workspace"),
      "@prototype": src("prototype"),
      "@shared": src("shared"),
    },
  },
  // Localhost only: the workspace is never exposed to the network.
  server: { host: "127.0.0.1", port: 4300, strictPort: true },
  preview: { host: "127.0.0.1", port: 4300, strictPort: true },
});
