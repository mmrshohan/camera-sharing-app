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

  test("the shipped CHANGELOG.md parses: Unreleased first, then 1.0.0 with its date", () => {
    const md = readFileSync(new URL("../../CHANGELOG.md", import.meta.url), "utf8");
    const [first, release] = parseChangelog(md);
    expect(first?.version).toBe("Unreleased");
    expect(release).toMatchObject({ version: "1.0.0", date: "2026-10-29" });
    expect(release?.sections.Added.length).toBeGreaterThan(0);
  });
});
