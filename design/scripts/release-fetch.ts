// Builds an earlier design-system release from its tag, so pages can be compared with it.
// Usage: npm run release:fetch 1.0.0
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const semver = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/;

export interface ReleasePlan {
  tag: string;
  worktree: string;
  outDir: string;
  base: string;
}

/** Where a release comes from and where it goes. Rejects anything but semver. */
export function releasePlan(version: string, repoRoot: string, tmpRoot: string): ReleasePlan {
  if (!semver.test(version)) throw new Error("Version must be semver, like 1.0.0");
  return {
    tag: `design-v${version}`,
    worktree: `${tmpRoot}/design-release-${version}`,
    outDir: `${repoRoot}/design/.releases/${version}`,
    base: `/__releases/${version}/`,
  };
}

/** Built releases, newest first, from the entries of .releases. */
export function releaseIndex(entries: string[]): string[] {
  const parts = (v: string) => v.split(/[.-]/).map((p) => (/^\d+$/.test(p) ? Number(p) : p));
  return entries
    .filter((entry) => semver.test(entry))
    .sort((a, b) => {
      const [x, y] = [parts(a), parts(b)];
      for (let i = 0; i < Math.max(x.length, y.length); i += 1) {
        const [p, q] = [x[i], y[i]];
        if (p === q) continue;
        // A pre-release sorts before its release: 1.0.0-test < 1.0.0.
        if (p === undefined) return -1;
        if (q === undefined) return 1;
        if (typeof p === "number" && typeof q === "number") return q - p;
        return String(q).localeCompare(String(p));
      }
      return 0;
    });
}

const run = (command: string, args: string[], cwd: string) =>
  execFileSync(command, args, { cwd, stdio: "inherit" });

function main(): void {
  const version = process.argv[2] ?? "";
  const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  }).trim();
  const plan = releasePlan(version, repoRoot, tmpdir());
  try {
    run("git", ["rev-parse", "--verify", plan.tag], repoRoot);
    run("git", ["worktree", "add", "--detach", plan.worktree, plan.tag], repoRoot);
    run("npm", ["ci"], join(plan.worktree, "design"));
    run(
      "npm",
      ["run", "build", "--", "--base", plan.base, "--outDir", plan.outDir],
      join(plan.worktree, "design"),
    );
    const releases = join(repoRoot, "design", ".releases");
    writeFileSync(
      join(releases, "index.json"),
      `${JSON.stringify(releaseIndex(readdirSync(releases)), null, 2)}\n`,
    );
    console.log(`release:fetch: built ${plan.tag} into ${plan.outDir}`);
  } catch (error) {
    console.error(`release:fetch: ${error instanceof Error ? error.message : String(error)}`);
    process.exitCode = 1;
  } finally {
    if (existsSync(plan.worktree))
      run("git", ["worktree", "remove", "--force", plan.worktree], repoRoot);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
