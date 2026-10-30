export type ChangeKind = "Added" | "Changed" | "Fixed" | "Removed";

export interface Release {
  /** "Unreleased" or a semantic version such as "1.0.0". */
  version: string;
  /** YYYY-MM-DD; null only for Unreleased. */
  date: string | null;
  sections: Record<ChangeKind, string[]>;
}

export const changeKinds: readonly ChangeKind[] = ["Added", "Changed", "Fixed", "Removed"];

const isChangeKind = (name: string): name is ChangeKind =>
  (changeKinds as readonly string[]).includes(name);
const releaseHeading = /^## \[(Unreleased|\d+\.\d+\.\d+)\](?: - (\d{4}-\d{2}-\d{2}))?$/;
const linkReference = /^\[[^\]]+\]:\s/;

/**
 * Reads design/CHANGELOG.md in Keep a Changelog form: `## [Unreleased]` or
 * `## [x.y.z] - YYYY-MM-DD`, then `### Added | Changed | Fixed | Removed` lists. Text before the
 * first release is ignored. Anything else inside a release is an error, so an entry can never
 * silently disappear from the workspace.
 */
export function parseChangelog(md: string): Release[] {
  const releases: Release[] = [];
  let release: Release | undefined;
  let items: string[] | undefined;

  md.split(/\r?\n/).forEach((raw, index) => {
    const line = raw.trimEnd();
    const fail = (problem: string) => {
      throw new Error(`CHANGELOG.md line ${index + 1}: ${problem}`);
    };

    if (line.startsWith("## ")) {
      const match = releaseHeading.exec(line);
      const version = match?.[1];
      const date = match?.[2] ?? null;
      if (!version) return fail(`"${line}" is not "## [Unreleased]" or "## [x.y.z] - YYYY-MM-DD"`);
      if ((version === "Unreleased") !== (date === null)) {
        return fail(`"${line}": only Unreleased goes without a date`);
      }
      release = { version, date, sections: { Added: [], Changed: [], Fixed: [], Removed: [] } };
      releases.push(release);
      items = undefined;
      return;
    }
    if (!release || line === "" || linkReference.test(line)) return;

    if (line.startsWith("### ")) {
      const kind = line.slice(4).trim();
      if (!isChangeKind(kind)) {
        return fail(`unknown section "${kind}"; use Added, Changed, Fixed or Removed`);
      }
      items = release.sections[kind];
    } else if (line.startsWith("- ")) {
      if (!items) return fail("a list item outside Added, Changed, Fixed or Removed");
      items.push(line.slice(2).trim());
    } else if (/^\s+\S/.test(line) && items && items.length > 0) {
      items[items.length - 1] += ` ${line.trim()}`;
    } else {
      fail(`"${line}" is not a heading or a list item`);
    }
  });

  return releases;
}
