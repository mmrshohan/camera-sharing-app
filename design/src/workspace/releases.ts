import raw from "../../CHANGELOG.md?raw";
import { parseChangelog, type Release } from "./changelog";

/** Earlier releases built with `npm run release:fetch`, newest first; none until one is built. */
export async function listReleases(): Promise<string[]> {
  try {
    const response = await fetch("/__releases/index.json");
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? data.filter((v): v is string => typeof v === "string") : [];
  } catch {
    return [];
  }
}

/** Every design-system release in CHANGELOG.md, newest first. */
export const releases = parseChangelog(raw);

const dateFormat = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "Unreleased", or "v1.0.0 · 2 November 2026". */
export function releaseLabel(release: Release): string {
  if (release.date === null) return release.version;
  return `v${release.version} · ${dateFormat.format(new Date(`${release.date}T00:00:00Z`))}`;
}
