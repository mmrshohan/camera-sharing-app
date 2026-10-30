// Builds the "where used" map: which prototype files import which Library components.
// Screens import components through `@components/<Name>`, so the import lines are the truth.
import { mkdirSync, readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, sep } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export interface SourceFile {
  /** Path under src/prototype/, with forward slashes. */
  path: string;
  text: string;
}

/** `RingButton` → `ring-button`: the id in the component's meta. */
export function componentId(name: string): string {
  return name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
}

// Value imports only: `import type { … }` draws nothing on screen.
const componentImport = /import\s+(?!type\s)[^;]*?from\s+["']@components\/([A-Za-z0-9]+)["']/g;

export function scanUsage(files: SourceFile[]): Record<string, string[]> {
  const usage = new Map<string, Set<string>>();
  for (const file of files) {
    const screen = file.path.replace(/\.[^./]+$/, "");
    for (const [, name] of file.text.matchAll(componentImport)) {
      if (!name) continue;
      const id = componentId(name);
      usage.set(id, (usage.get(id) ?? new Set<string>()).add(screen));
    }
  }
  return Object.fromEntries(
    [...usage.keys()].sort().map((id) => [id, [...(usage.get(id) ?? [])].sort()]),
  );
}

/** Scans `<root>/src/prototype` and writes `src/workspace/generated/usage.json` if it changed. */
export function writeUsage(root: string): Record<string, string[]> {
  const prototype = join(root, "src", "prototype");
  const files = readdirSync(prototype, { recursive: true, encoding: "utf8" })
    .filter((path) => /\.tsx?$/.test(path))
    .sort()
    .map((path) => ({
      path: path.split(sep).join("/"),
      text: readFileSync(join(prototype, path), "utf8"),
    }));
  const usage = scanUsage(files);
  const out = join(root, "src", "workspace", "generated");
  const file = join(out, "usage.json");
  const json = `${JSON.stringify(usage, null, 2)}\n`;
  if (!existsSync(file) || readFileSync(file, "utf8") !== json) {
    mkdirSync(out, { recursive: true });
    writeFileSync(file, json);
  }
  return usage;
}

function main(): void {
  const usage = writeUsage(fileURLToPath(new URL("..", import.meta.url)));
  console.log(`usage: ${Object.keys(usage).length} components used by prototype screens`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
