// Builds an earlier design-system release from its tag, so pages can be compared with it.
// Usage: npm run release:fetch 1.0.0
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, rmSync, writeFileSync } from "node:fs";
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

/** What release:fetch does outside itself; tests pass their own. */
export interface Effects {
  run: (command: string, args: string[], cwd: string) => void;
  exists: (path: string) => boolean;
  deleteFolder: (path: string) => void;
  writeIndex: () => void;
  log: (message: string) => void;
  error: (message: string) => void;
}

const message = (error: unknown) => (error instanceof Error ? error.message : String(error));

/** Removes the temporary worktree, and git's record of any worktree whose folder is gone. */
function clear(plan: ReleasePlan, repoRoot: string, fx: Effects): void {
  fx.run("git", ["worktree", "prune"], repoRoot);
  if (!fx.exists(plan.worktree)) return;
  try {
    fx.run("git", ["worktree", "remove", "--force", plan.worktree], repoRoot);
  } catch {
    // A folder git no longer records as a worktree would stop every run; it is only ours.
    fx.deleteFolder(plan.worktree);
  }
}

/** Builds a release in a temporary worktree, which it always removes. Returns whether it built. */
export function fetchRelease(plan: ReleasePlan, repoRoot: string, fx: Effects): boolean {
  try {
    // Ctrl-C ends the run before its cleanup, so a worktree may be left from last time.
    clear(plan, repoRoot, fx);
    fx.run("git", ["rev-parse", "--verify", plan.tag], repoRoot);
    fx.run("git", ["worktree", "add", "--detach", plan.worktree, plan.tag], repoRoot);
    fx.run("npm", ["ci"], join(plan.worktree, "design"));
    fx.run(
      "npm",
      ["run", "build", "--", "--base", plan.base, "--outDir", plan.outDir],
      join(plan.worktree, "design"),
    );
    fx.writeIndex();
    fx.log(`release:fetch: built ${plan.tag} into ${plan.outDir}`);
    return true;
  } catch (error) {
    fx.error(`release:fetch: ${message(error)}`);
    return false;
  } finally {
    // A cleanup that fails is reported after whatever stopped the build, never instead of it.
    try {
      clear(plan, repoRoot, fx);
    } catch (error) {
      fx.error(`release:fetch: could not remove ${plan.worktree}: ${message(error)}`);
    }
  }
}

function main(): void {
  const version = process.argv[2] ?? "";
  const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
    encoding: "utf8",
  }).trim();
  const plan = releasePlan(version, repoRoot, tmpdir());
  const releases = join(repoRoot, "design", ".releases");
  const built = fetchRelease(plan, repoRoot, {
    run: (command, args, cwd) => execFileSync(command, args, { cwd, stdio: "inherit" }),
    exists: existsSync,
    deleteFolder: (path) => rmSync(path, { recursive: true, force: true }),
    writeIndex: () =>
      writeFileSync(
        join(releases, "index.json"),
        `${JSON.stringify(releaseIndex(readdirSync(releases)), null, 2)}\n`,
      ),
    log: (line) => console.log(line),
    error: (line) => console.error(line),
  });
  if (!built) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
