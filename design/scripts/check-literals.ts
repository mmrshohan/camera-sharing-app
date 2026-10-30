// Guards the design-system rule that colors, font sizes and durations come only from tokens.
// Components and prototype screens must use var(--…) or the `tokens` import instead of literals.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export interface LiteralMatch {
  line: number;
  match: string;
}

const alwaysForbidden: RegExp[] = [
  /#[0-9a-fA-F]{3,8}\b/g, // hex colors
  /\brgba?\(/g,
  /\bhsla?\(/g,
  /font-size\s*:\s*[0-9.]+(?:px|pt|rem|em)/g,
  /\bfontSize\s*:\s*['"]?[0-9.]+/g, // inline style objects in TSX
  /\bduration\s*:\s*[0-9.]+/g, // motion props in TSX
];

// A literal time is only a problem inside a transition or animation declaration.
const motionDeclaration = /\b(?:transition|animation)[a-z-]*\s*:/;
const timeValue = /\b[0-9.]+m?s\b/g;

const isComment = (line: string) => /^\s*(?:\/\/|\/\*|\*)/.test(line);

export function findLiterals(fileText: string, filePath: string): LiteralMatch[] {
  void filePath; // reserved for per-file allowances; none are needed yet
  const found: LiteralMatch[] = [];
  fileText.split("\n").forEach((text, index) => {
    if (isComment(text)) return;
    for (const pattern of alwaysForbidden) {
      for (const m of text.matchAll(pattern)) found.push({ line: index + 1, match: m[0] });
    }
    if (motionDeclaration.test(text)) {
      for (const m of text.matchAll(timeValue)) found.push({ line: index + 1, match: m[0] });
    }
  });
  return found;
}

function* filesUnder(dir: string): Generator<string> {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) yield* filesUnder(path);
    else if (/\.(css|tsx?)$/.test(name)) yield path;
  }
}

function main(): void {
  const root = fileURLToPath(new URL("..", import.meta.url));
  const scanned = ["src/components", "src/prototype"].map((d) => join(root, d));
  let failures = 0;
  for (const dir of scanned) {
    let entries: Generator<string>;
    try {
      statSync(dir);
      entries = filesUnder(dir);
    } catch {
      continue; // folder not created yet
    }
    for (const file of entries) {
      for (const { line, match } of findLiterals(readFileSync(file, "utf8"), file)) {
        console.log(`${relative(root, file)}:${line} ${match}`);
        failures += 1;
      }
    }
  }
  if (failures > 0) {
    console.error(`check-literals: ${failures} literal value(s) found. Use tokens instead.`);
    process.exit(1);
  }
  console.log("check-literals: no literal colors, font sizes or durations.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
