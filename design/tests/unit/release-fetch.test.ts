import { describe, expect, test } from "vitest";
import { releaseIndex, releasePlan } from "../../scripts/release-fetch";

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
});
