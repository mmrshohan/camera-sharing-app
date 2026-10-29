import { describe, expect, test } from "vitest";
import { fetchRelease, releaseIndex, releasePlan, type Effects } from "../../scripts/release-fetch";

describe("release comparison", () => {
  test("a release is built from its tag into .releases, served under /__releases", () => {
    expect(releasePlan("1.0.0", "/r", "/t")).toEqual({
      tag: "design-v1.0.0",
      worktree: "/t/design-release-1.0.0",
      outDir: "/r/design/.releases/1.0.0",
      base: "/__releases/1.0.0/",
    });
  });

  test("only semver versions", () => {
    expect(() => releasePlan("v1", "/r", "/t")).toThrow("Version must be semver, like 1.0.0");
    expect(() => releasePlan("1.0", "/r", "/t")).toThrow("Version must be semver, like 1.0.0");
    expect(releasePlan("0.0.1-test", "/r", "/t").tag).toBe("design-v0.0.1-test");
  });

  test("the index lists built releases, newest first, ignoring anything else", () => {
    expect(releaseIndex(["1.0.0", "1.2.0", "index.json", "notes", "1.10.0", "0.0.1-test"])).toEqual(
      ["1.10.0", "1.2.0", "1.0.0", "0.0.1-test"],
    );
  });

  describe("its temporary worktree (code review 6)", () => {
    const plan = releasePlan("1.0.0", "/r", "/t");

    /** A shell that records each command; `fail` names commands that throw ("rm" for the folder). */
    function shell(leftOver: boolean, fail: string[] = []) {
      const calls: string[] = [];
      const errors: string[] = [];
      const deleted: string[] = [];
      let there = leftOver;
      const fx: Effects = {
        run: (command, args) => {
          const line = [command, ...args].join(" ");
          calls.push(line);
          if (fail.some((f) => line.startsWith(f))) throw new Error(`Command failed: ${line}`);
          if (line.startsWith("git worktree add")) there = true;
          if (line.startsWith("git worktree remove")) there = false;
        },
        exists: (path) => path === plan.worktree && there,
        deleteFolder: (path) => {
          if (fail.includes("rm")) throw new Error(`Could not delete ${path}`);
          deleted.push(path);
          there = false;
        },
        writeIndex: () => {},
        log: () => {},
        error: (line) => errors.push(line),
      };
      return { fx, calls, errors, deleted };
    }

    test("one left by an interrupted run is cleared before a new one is added", () => {
      const { fx, calls } = shell(true);
      expect(fetchRelease(plan, "/r", fx)).toBe(true);
      const before = calls.slice(
        0,
        calls.indexOf(`git worktree add --detach ${plan.worktree} ${plan.tag}`),
      );
      expect(before).toContain(`git worktree remove --force ${plan.worktree}`);
      expect(before).toContain("git worktree prune");
    });

    test("a leftover folder git no longer records as a worktree is deleted, so runs aren't stuck (review)", () => {
      const { fx, errors, deleted } = shell(true, ["git worktree remove"]);
      expect(fetchRelease(plan, "/r", fx)).toBe(true);
      expect(deleted).toContain(plan.worktree);
      expect(errors).toEqual([]);
    });

    test("a failed cleanup is reported after the error that stopped the build, never instead of it", () => {
      const { fx, errors } = shell(false, ["npm ci", "git worktree remove", "rm"]);
      expect(fetchRelease(plan, "/r", fx)).toBe(false);
      expect(errors[0]).toBe("release:fetch: Command failed: npm ci");
      expect(errors[1]).toMatch(/could not remove .*design-release-1\.0\.0/);
    });
  });
});
