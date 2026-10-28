import { Fragment } from "react";
import { Link } from "react-router";
import { changeKinds, type Release } from "./changelog";

/** Renders `code` spans; the changelog uses no other inline Markdown. */
function Inline({ text }: { text: string }) {
  return text
    .split("`")
    .map((part, i) =>
      i % 2 === 1 ? <code key={i}>{part}</code> : <Fragment key={i}>{part}</Fragment>,
    );
}

interface ReleaseNotesProps {
  release: Release;
  /** Caps the entries shown, in file order; the rest are counted in a link to `moreHref`. */
  limit?: number;
  moreHref?: string;
}

/** A release's changes by kind. */
export function ReleaseNotes({ release, limit = Infinity, moreHref }: ReleaseNotesProps) {
  let budget = limit;
  const groups = changeKinds
    .map((kind) => {
      const items = release.sections[kind].slice(0, Math.max(budget, 0));
      budget -= items.length;
      return { kind, items };
    })
    .filter((group) => group.items.length > 0);
  const total = changeKinds.reduce((sum, kind) => sum + release.sections[kind].length, 0);
  const hidden = total - groups.reduce((sum, group) => sum + group.items.length, 0);

  if (total === 0) return <p className="ws-muted">No changes recorded yet.</p>;
  return (
    <div className="ws-notes">
      {groups.map(({ kind, items }) => (
        <section key={kind}>
          <h3>{kind}</h3>
          <ul className="ws-list">
            {items.map((item, i) => (
              <li key={i}>
                <Inline text={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
      {hidden > 0 && moreHref && (
        <p>
          <Link to={moreHref}>{hidden} more in the changelog</Link>
        </p>
      )}
    </div>
  );
}
