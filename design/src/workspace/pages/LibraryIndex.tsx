import { Link } from "react-router";
import { ComponentCard } from "../ComponentCard";
import { labEntries, libraryEntries } from "../registry";
import { groupNames, type ComponentGroup } from "../types";

const groups: ComponentGroup[] = [1, 2, 3, 4];

export function LibraryIndex() {
  const finals = libraryEntries();
  const inReview = [...new Set(labEntries().map((e) => e.meta.group))].sort();
  return (
    <section>
      <h1 className="ws-title">Library</h1>
      <p className="ws-lede">
        Finalized components, approved by the owner. Every prototype screen is built only from
        these.
      </p>
      {finals.length === 0 ? (
        <div className="ws-empty">
          <p>No components are final yet.</p>
          {inReview.length > 0 && (
            <p>
              Group {inReview.join(", ")} {inReview.length === 1 ? "is" : "are"} being built and
              reviewed in the <Link to="/lab">Lab</Link>.
            </p>
          )}
        </div>
      ) : (
        groups.map((group) => {
          const entries = finals.filter((e) => e.meta.group === group);
          if (entries.length === 0) return null;
          return (
            <section key={group} className="ws-group">
              <h2 className="ws-group__title">
                {group} · {groupNames[group]}
              </h2>
              <div className="ws-grid">
                {entries.map((entry) => (
                  <ComponentCard key={entry.meta.id} entry={entry} base="library" />
                ))}
              </div>
            </section>
          );
        })
      )}
    </section>
  );
}
