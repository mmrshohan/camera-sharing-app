import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
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

const contentTypes: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

/**
 * Serves earlier releases built by `npm run release:fetch` at /__releases/<version>/, with each
 * release's own index.html for its routes. With none built, the index is an empty list.
 */
function releases(): Plugin {
  const dir = fileURLToPath(new URL("./.releases/", import.meta.url));
  return {
    name: "releases",
    configureServer(server) {
      server.middlewares.use("/__releases", (req, res) => {
        let path: string;
        try {
          path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
        } catch {
          // A malformed escape such as %E0%A4%A is the client's mistake.
          res.statusCode = 400;
          res.end();
          return;
        }
        let file = join(dir, path);
        // Never outside .releases.
        if (!file.startsWith(dir)) {
          res.statusCode = 403;
          res.end();
          return;
        }
        if (path === "/index.json" && !existsSync(file)) {
          res.setHeader("Content-Type", contentTypes[".json"] ?? "application/json");
          res.end("[]");
          return;
        }
        if (!existsSync(file) || !statSync(file).isFile()) {
          // A route inside a release: that release's own page.
          const version = path.split("/")[1] ?? "";
          file = join(dir, version, "index.html");
          if (!version || extname(path) || !existsSync(file)) {
            res.statusCode = 404;
            res.end();
            return;
          }
        }
        res.setHeader("Content-Type", contentTypes[extname(file)] ?? "application/octet-stream");
        createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), whereUsed(), releases()],
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
