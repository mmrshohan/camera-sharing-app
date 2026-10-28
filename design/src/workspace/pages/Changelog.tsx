import { ReleaseNotes } from "../ReleaseNotes";
import { releaseLabel, releases } from "../releases";

export function Changelog() {
  return (
    <>
      <h1 className="ws-title">Changelog</h1>
      <p className="ws-lede">
        What changed in each release of the design system, newest first. Unreleased is what has
        changed since the last release.
      </p>
      {releases.map((release) => (
        <section
          key={release.version}
          id={`release-${release.version}`}
          className="ws-section"
          aria-labelledby={`release-${release.version}-title`}
        >
          <h2 id={`release-${release.version}-title`}>{releaseLabel(release)}</h2>
          <ReleaseNotes release={release} />
        </section>
      ))}
    </>
  );
}
