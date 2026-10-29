import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { parseChangelog } from "../../src/workspace/changelog";

const fixture = `# Changelog

Notes before the first release are ignored.

## [Unreleased]

### Added

- RingButton in the Lab.
- Shutter in the Lab,
  with a second line.

## [1.0.0] - 2026-11-02

### Changed

- Accent text is darker.

### Fixed

- Labels no longer clip at the largest text size.
`;

describe("parseChangelog", () => {
  test("returns releases in file order; Unreleased has no date", () => {
    const releases = parseChangelog(fixture);
    expect(releases.map((r) => [r.version, r.date])).toEqual([
      ["Unreleased", null],
      ["1.0.0", "2026-11-02"],
    ]);
    expect(releases[0]!.sections.Added).toEqual([
      "RingButton in the Lab.",
      "Shutter in the Lab, with a second line.",
    ]);
    expect(releases[1]!.sections).toEqual({
      Added: [],
      Changed: ["Accent text is darker."],
      Fixed: ["Labels no longer clip at the largest text size."],
      Removed: [],
    });
  });

  test("rejects a section it does not know instead of dropping its entries", () => {
    expect(() => parseChangelog("## [Unreleased]\n\n### Security\n\n- Something.\n")).toThrow(
      /Security/,
    );
  });

  test("rejects a release heading that is not in Keep a Changelog form", () => {
    expect(() => parseChangelog("## 1.0.0\n\n### Added\n\n- Something.\n")).toThrow(/1\.0\.0/);
  });

  test("the shipped CHANGELOG.md parses: Unreleased first, then 1.1.0 and 1.0.0 with their dates", () => {
    const md = readFileSync(new URL("../../CHANGELOG.md", import.meta.url), "utf8");
    const [first, latest, previous] = parseChangelog(md);
    expect(first?.version).toBe("Unreleased");
    expect(latest).toMatchObject({ version: "1.1.0", date: "2026-10-30" });
    expect(latest?.sections.Added.join(" ")).toContain("SignInButton");
    expect(previous).toMatchObject({ version: "1.0.0", date: "2026-10-29" });
    expect(previous?.sections.Added.length).toBeGreaterThan(0);
  });

  test("the package's version is the newest release, in package.json and its lockfile", () => {
    const read = (file: string) =>
      JSON.parse(readFileSync(new URL(`../../${file}`, import.meta.url), "utf8")) as {
        version: string;
        packages?: Record<string, { version?: string }>;
      };
    const md = readFileSync(new URL("../../CHANGELOG.md", import.meta.url), "utf8");
    const newest = parseChangelog(md).find((release) => release.date !== null);
    const pkg = read("package.json");
    const lock = read("package-lock.json");
    expect(pkg.version).toBe(newest?.version);
    expect([lock.version, lock.packages?.[""]?.version]).toEqual([pkg.version, pkg.version]);
  });
});
