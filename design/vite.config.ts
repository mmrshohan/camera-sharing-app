import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const src = (path: string) => fileURLToPath(new URL(`./src/${path}`, import.meta.url));
const { version } = JSON.parse(
  readFileSync(new URL("./package.json", import.meta.url), "utf8"),
) as {
  version: string;
};

export default defineConfig({
  plugins: [react()],
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
